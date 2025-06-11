
-- Migration 2: Update users table to use enum types
-- File: 20250611110002_update_users_table_enums.sql

-- Update users table to use proper enum types and ensure it has all needed columns
ALTER TABLE public.users 
  ALTER COLUMN role TYPE user_role USING role::text::user_role,
  ALTER COLUMN role SET DEFAULT 'student'::user_role;

-- Add any missing columns to users table with proper enum types
DO $$ BEGIN
    -- Check and add sex column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'sex') THEN
        ALTER TABLE public.users ADD COLUMN sex sex_type;
    ELSE
        -- Update existing sex column to use enum
        ALTER TABLE public.users ALTER COLUMN sex TYPE sex_type USING sex::text::sex_type;
    END IF;
    
    -- Check and add study_level column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'study_level') THEN
        ALTER TABLE public.users ADD COLUMN study_level study_level;
    ELSE
        -- Update existing study_level column to use enum
        ALTER TABLE public.users ALTER COLUMN study_level TYPE study_level USING study_level::text::study_level;
    END IF;
    
    -- Check and add preferred_payout_method column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'preferred_payout_method') THEN
        ALTER TABLE public.users ADD COLUMN preferred_payout_method payout_method;
    ELSE
        -- Update existing preferred_payout_method column to use enum
        ALTER TABLE public.users ALTER COLUMN preferred_payout_method TYPE payout_method USING preferred_payout_method::text::payout_method;
    END IF;
END $$;
