-- Migration: Advanced Earning Logic
-- Description: Sunday randomization, top-up penalties, and global settings.

BEGIN;

-- 1. Update transaction types
ALTER TABLE public.transactions DROP CONSTRAINT IF EXISTS transactions_type_check;
ALTER TABLE public.transactions ADD CONSTRAINT transactions_type_check CHECK (type IN ('deposit', 'withdrawal', 'investment', 'earning', 'penalty'));

-- 2. Create app_settings table
CREATE TABLE IF NOT EXISTS public.app_settings (
  key TEXT PRIMARY KEY,
  value JSONB,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Function to generate weekly earning days
CREATE OR REPLACE FUNCTION public.generate_weekly_earning_days()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    days_count INTEGER;
    chosen_days TEXT[];
    all_days TEXT[] := ARRAY['mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
    idx INTEGER;
    result JSONB;
BEGIN
    -- Randomize 3, 4, or 5
    days_count := floor(random() * 3 + 3)::int;
    
    -- Randomly pick days
    chosen_days := ARRAY[]::TEXT[];
    WHILE array_length(chosen_days, 1) IS NULL OR array_length(chosen_days, 1) < days_count LOOP
        idx := floor(random() * 6 + 1)::int;
        IF NOT (all_days[idx] = ANY(chosen_days)) THEN
            chosen_days := array_append(chosen_days, all_days[idx]);
        END IF;
    END LOOP;

    result := jsonb_build_object(
        'days', to_jsonb(chosen_days),
        'count', days_count,
        'week_starting', (now()::date - extract(dow from now())::int)::date
    );

    INSERT INTO public.app_settings (key, value, updated_at)
    VALUES ('weekly_earning_days', result, now())
    ON CONFLICT (key) DO UPDATE SET value = result, updated_at = now();

    RETURN result;
END;
$$;

-- 4. Function to check if today is an earning day
CREATE OR REPLACE FUNCTION public.is_earning_day()
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
DECLARE
    settings JSONB;
    today_name TEXT;
BEGIN
    SELECT value INTO settings FROM public.app_settings WHERE key = 'weekly_earning_days';
    IF settings IS NULL THEN
        -- If not set, generate now (fallback)
        settings := public.generate_weekly_earning_days();
    END IF;

    -- If week has changed, regenerate
    IF (settings->>'week_starting')::date < (now()::date - extract(dow from now())::int)::date THEN
        settings := public.generate_weekly_earning_days();
    END IF;

    today_name := lower(to_char(now(), 'dy'));
    
    -- Sunday is never an earning day according to rules (mon-sat)
    IF today_name = 'sun' THEN
        RETURN FALSE;
    END IF;

    RETURN settings->'days' @> jsonb_build_array(today_name);
END;
$$;

-- 5. Updated ROI Processor with earning day check AND top-up penalty check
CREATE OR REPLACE FUNCTION public.process_daily_roi()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    tx RECORD;
    earning_amount NUMERIC;
    processed_count INTEGER := 0;
    is_earning BOOLEAN;
    last_deposit_at TIMESTAMPTZ;
    freq_days INTEGER;
    is_defaulting BOOLEAN;
BEGIN
    is_earning := public.is_earning_day();

    FOR tx IN
        SELECT
            t.id,
            t.user_id,
            t.plan_id,
            t.amount,
            t.created_at,
            t.last_paid_at,
            t.top_up_frequency,
            p.daily_roi,
            p.duration_days
        FROM public.transactions t
        JOIN public.plans p ON p.id = t.plan_id
        WHERE t.type = 'investment'
          AND t.status = 'approved'
          AND (
              t.last_paid_at IS NULL
              OR t.last_paid_at::date < now()::date
          )
          AND (
              (now()::date - t.created_at::date) <= p.duration_days
          )
    LOOP
        -- Check top-up status
        freq_days := CASE 
            WHEN tx.top_up_frequency ILIKE '%weekly%' AND NOT tx.top_up_frequency ILIKE '%bi%' THEN 7
            WHEN tx.top_up_frequency ILIKE '%bi-weekly%' THEN 14
            WHEN tx.top_up_frequency ILIKE '%monthly%' THEN 30
            ELSE NULL
        END;

        is_defaulting := FALSE;
        IF freq_days IS NOT NULL THEN
            SELECT created_at INTO last_deposit_at
            FROM public.transactions
            WHERE user_id = tx.user_id AND type = 'deposit' AND status = 'approved'
            ORDER BY created_at DESC LIMIT 1;

            IF last_deposit_at IS NULL THEN
                last_deposit_at := tx.created_at; -- Use investment start if no deposits yet
            END IF;

            IF (now()::date - last_deposit_at::date) > freq_days THEN
                is_defaulting := TRUE;
            END IF;
        END IF;

        -- 1. Apply ROI if it's an earning day and NOT defaulting
        IF is_earning AND NOT is_defaulting THEN
            earning_amount := ROUND((tx.amount * (tx.daily_roi / 100.0))::numeric, 2);
            IF earning_amount > 0 THEN
                UPDATE public.users
                SET
                    available_balance = COALESCE(available_balance, 0) + earning_amount,
                    total_balance = COALESCE(total_balance, 0) + earning_amount,
                    earnings = COALESCE(earnings, 0) + earning_amount,
                    updated_at = now()
                WHERE id = tx.user_id;

                INSERT INTO public.transactions (
                    user_id, type, amount, status, plan_id, created_at, updated_at
                ) VALUES (
                    tx.user_id, 'earning', earning_amount, 'approved', tx.plan_id, now(), now()
                );
                
                processed_count := processed_count + 1;
            END IF;
        END IF;

        -- 2. Apply Penalty if defaulting (once a week, specifically on Sunday)
        IF is_defaulting AND to_char(now(), 'dy') = 'sun' THEN
            -- Check if already penalized today
            IF NOT EXISTS (
                SELECT 1 FROM public.transactions 
                WHERE user_id = tx.user_id 
                AND type = 'penalty' 
                AND created_at::date = now()::date
            ) THEN
                earning_amount := ROUND((tx.amount * 0.025)::numeric, 2); -- 2.5% loss of invested amount
                
                UPDATE public.users
                SET
                    available_balance = GREATEST(0, COALESCE(available_balance, 0) - earning_amount),
                    total_balance = GREATEST(0, COALESCE(total_balance, 0) - earning_amount),
                    updated_at = now()
                WHERE id = tx.user_id;

                INSERT INTO public.transactions (
                    user_id, type, amount, status, plan_id, created_at, updated_at
                ) VALUES (
                    tx.user_id, 'penalty', earning_amount, 'approved', tx.plan_id, now(), now()
                );
            END IF;
        END IF;

        -- Mark as processed for today
        UPDATE public.transactions
        SET
            last_paid_at = now(),
            updated_at = now()
        WHERE id = tx.id;

    END LOOP;

    RETURN processed_count;
END;
$$;

COMMIT;
