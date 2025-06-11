
-- First, let's check if the enum exists and create it if it doesn't
DO $$ 
BEGIN
    -- Check if payment_status type exists, if not create it
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payment_status') THEN
        CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'released', 'refunded', 'failed');
    END IF;
    
    -- Check if payment_type type exists, if not create it
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payment_type') THEN
        CREATE TYPE payment_type AS ENUM ('consultation', 'service');
    END IF;
    
    -- Check if payment_method type exists, if not create it
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payment_method') THEN
        CREATE TYPE payment_method AS ENUM ('stripe', 'mobile_money', 'bank_transfer');
    END IF;
    
    -- Check if payout_method type exists, if not create it
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payout_method') THEN
        CREATE TYPE payout_method AS ENUM ('mobile_money', 'bank_transfer');
    END IF;
    
    -- Check if study_level type exists, if not create it
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'study_level') THEN
        CREATE TYPE study_level AS ENUM ('undergraduate', 'masters', 'phd', 'postdoc');
    END IF;
    
    -- Check if sex_type type exists, if not create it
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'sex_type') THEN
        CREATE TYPE sex_type AS ENUM ('male', 'female');
    END IF;
END $$;

-- Update the payments table columns to use the correct enum types
ALTER TABLE public.payments 
ALTER COLUMN status TYPE payment_status USING 
  CASE 
    WHEN status::text = 'pending' THEN 'pending'::payment_status
    WHEN status::text = 'paid' THEN 'paid'::payment_status
    WHEN status::text = 'released' THEN 'released'::payment_status
    WHEN status::text = 'refunded' THEN 'refunded'::payment_status
    WHEN status::text = 'failed' THEN 'failed'::payment_status
    ELSE 'pending'::payment_status
  END,
ALTER COLUMN payment_type TYPE payment_type USING 
  CASE 
    WHEN payment_type::text = 'consultation' THEN 'consultation'::payment_type
    WHEN payment_type::text = 'service' THEN 'service'::payment_type
    ELSE 'service'::payment_type
  END,
ALTER COLUMN payment_method TYPE payment_method USING 
  CASE 
    WHEN payment_method::text = 'stripe' THEN 'stripe'::payment_method
    WHEN payment_method::text = 'mobile_money' THEN 'mobile_money'::payment_method
    WHEN payment_method::text = 'bank_transfer' THEN 'bank_transfer'::payment_method
    ELSE 'stripe'::payment_method
  END;

-- Update the withdrawals table columns to use the correct enum types
ALTER TABLE public.withdrawals 
ALTER COLUMN status TYPE payment_status USING 
  CASE 
    WHEN status::text = 'pending' THEN 'pending'::payment_status
    WHEN status::text = 'paid' THEN 'paid'::payment_status
    WHEN status::text = 'released' THEN 'released'::payment_status
    WHEN status::text = 'refunded' THEN 'refunded'::payment_status
    WHEN status::text = 'failed' THEN 'failed'::payment_status
    ELSE 'pending'::payment_status
  END,
ALTER COLUMN payout_method TYPE payout_method USING 
  CASE 
    WHEN payout_method::text = 'mobile_money' THEN 'mobile_money'::payout_method
    WHEN payout_method::text = 'bank_transfer' THEN 'bank_transfer'::payout_method
    ELSE 'mobile_money'::payout_method
  END;

-- Update the users table columns to use the correct enum types
ALTER TABLE public.users 
ALTER COLUMN study_level TYPE study_level USING 
  CASE 
    WHEN study_level::text = 'undergraduate' THEN 'undergraduate'::study_level
    WHEN study_level::text = 'masters' THEN 'masters'::study_level
    WHEN study_level::text = 'phd' THEN 'phd'::study_level
    WHEN study_level::text = 'postdoc' THEN 'postdoc'::study_level
    ELSE NULL
  END,
ALTER COLUMN sex TYPE sex_type USING 
  CASE 
    WHEN sex::text = 'male' THEN 'male'::sex_type
    WHEN sex::text = 'female' THEN 'female'::sex_type
    ELSE NULL
  END;
