-- Add duration_days to transactions table
ALTER TABLE public.transactions ADD COLUMN IF NOT EXISTS duration_days INTEGER;
