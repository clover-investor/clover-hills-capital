-- Run this in Supabase SQL editor.
-- It is idempotent and safe to run multiple times.

BEGIN;

ALTER TABLE public.transactions
    ADD COLUMN IF NOT EXISTS top_up_frequency TEXT;

ALTER TABLE public.transactions
    ADD COLUMN IF NOT EXISTS last_paid_at TIMESTAMPTZ;

ALTER TABLE public.transactions
    ADD COLUMN IF NOT EXISTS last_top_up_email_at TIMESTAMPTZ;

-- Replace ROI processor with a constraint-safe version.
-- Uses status='approved' for generated earning transactions.
CREATE OR REPLACE FUNCTION public.process_daily_roi()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    tx RECORD;
    earning_amount NUMERIC;
    processed_count INTEGER := 0;
BEGIN
    FOR tx IN
        SELECT
            t.id,
            t.user_id,
            t.plan_id,
            t.amount,
            t.created_at,
            t.last_paid_at,
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
        earning_amount := ROUND((tx.amount * (tx.daily_roi / 100.0))::numeric, 2);
        IF earning_amount <= 0 THEN
            CONTINUE;
        END IF;

        UPDATE public.users
        SET
            available_balance = COALESCE(available_balance, 0) + earning_amount,
            total_balance = COALESCE(total_balance, 0) + earning_amount,
            earnings = COALESCE(earnings, 0) + earning_amount,
            updated_at = now()
        WHERE id = tx.user_id;

        INSERT INTO public.transactions (
            user_id,
            type,
            amount,
            status,
            plan_id,
            created_at,
            updated_at
        ) VALUES (
            tx.user_id,
            'earning',
            earning_amount,
            'approved',
            tx.plan_id,
            now(),
            now()
        );

        UPDATE public.transactions
        SET
            last_paid_at = now(),
            updated_at = now()
        WHERE id = tx.id;

        processed_count := processed_count + 1;
    END LOOP;

    RETURN processed_count;
END;
$$;

COMMIT;
