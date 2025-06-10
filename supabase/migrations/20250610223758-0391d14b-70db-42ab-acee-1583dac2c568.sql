
-- First, ensure all required enum types exist
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('student', 'expert', 'aid', 'admin');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE sex_type AS ENUM ('male', 'female');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE study_level AS ENUM ('undergraduate', 'masters', 'phd', 'postdoc');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE payout_method AS ENUM ('mobile_money', 'bank_transfer', 'paypal');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE consultation_status AS ENUM ('pending', 'confirmed', 'completed', 'cancelled');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE job_status AS ENUM ('pending', 'assigned', 'in_progress', 'completed', 'cancelled');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'failed', 'refunded', 'released');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE payment_method AS ENUM ('stripe', 'mobile_money', 'bank_transfer');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE payment_type AS ENUM ('consultation', 'service');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- Ensure the users table exists with the correct structure
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    name TEXT,
    role user_role NOT NULL DEFAULT 'student',
    phone_number TEXT,
    country TEXT,
    institution TEXT,
    faculty TEXT,
    study_level study_level,
    sex sex_type,
    date_of_birth DATE,
    research_areas TEXT[],
    topic_title TEXT,
    research_stage TEXT,
    languages TEXT[],
    expertise TEXT[],
    other_expertise TEXT,
    experience TEXT,
    linkedin_url TEXT,
    wallet_balance NUMERIC(10,2) DEFAULT 0.00,
    preferred_payout_method payout_method,
    payout_details JSONB,
    user_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on users table
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create or replace the handle_new_user function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'fullName', NEW.raw_user_meta_data->>'name', NEW.email),
    CASE 
      WHEN NEW.raw_user_meta_data->>'role' = 'student' THEN 'student'::user_role
      WHEN NEW.raw_user_meta_data->>'role' = 'expert' THEN 'expert'::user_role
      WHEN NEW.raw_user_meta_data->>'role' = 'aid' THEN 'aid'::user_role
      WHEN NEW.raw_user_meta_data->>'role' = 'admin' THEN 'admin'::user_role
      ELSE 'student'::user_role
    END
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Ensure the trigger exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
