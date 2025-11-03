-- Add payment_id column to transactions table for MeSomb/other payment tracking
ALTER TABLE public.transactions
ADD COLUMN IF NOT EXISTS payment_id TEXT;
