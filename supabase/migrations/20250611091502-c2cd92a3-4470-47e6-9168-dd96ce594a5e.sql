
-- Add missing columns to the payments table
ALTER TABLE public.payments 
ADD COLUMN IF NOT EXISTS status payment_status DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS payment_type payment_type DEFAULT 'service',
ADD COLUMN IF NOT EXISTS payment_method payment_method DEFAULT 'stripe';

-- Ensure the withdrawals table has the missing columns
ALTER TABLE public.withdrawals 
ADD COLUMN IF NOT EXISTS status payment_status DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS payout_method payout_method DEFAULT 'mobile_money';
