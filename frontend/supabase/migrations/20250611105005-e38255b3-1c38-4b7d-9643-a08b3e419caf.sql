
-- Complete database setup for ResearchWhao platform

-- 1. Ensure all required enum types exist
DO $$ BEGIN
    CREATE TYPE public.user_role AS ENUM ('student', 'expert', 'aid', 'admin');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE public.sex_type AS ENUM ('male', 'female');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE public.study_level AS ENUM ('undergraduate', 'masters', 'phd', 'postdoc');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE public.payout_method AS ENUM ('mobile_money', 'bank_transfer', 'paypal');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE public.consultation_status AS ENUM ('pending', 'confirmed', 'completed', 'cancelled');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE public.job_status AS ENUM ('pending', 'assigned', 'in_progress', 'completed', 'cancelled');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE public.payment_status AS ENUM ('pending', 'paid', 'failed', 'refunded', 'released');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE public.payment_method AS ENUM ('stripe', 'mobile_money', 'bank_transfer');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE public.payment_type AS ENUM ('consultation', 'service');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- 2. Update users table to use proper enum types and ensure it has all needed columns
ALTER TABLE public.users 
  ALTER COLUMN role TYPE user_role USING role::text::user_role,
  ALTER COLUMN role SET DEFAULT 'student'::user_role;

-- Add any missing columns to users table
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

-- 3. Update other tables to use proper enum types
-- Update consultations table
DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'consultations') THEN
        -- Add status column if it doesn't exist
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'consultations' AND column_name = 'status') THEN
            ALTER TABLE public.consultations ADD COLUMN status consultation_status DEFAULT 'pending'::consultation_status;
        ELSE
            -- Update existing status column to use enum
            ALTER TABLE public.consultations ALTER COLUMN status TYPE consultation_status USING status::text::consultation_status;
        END IF;
    END IF;
END $$;

-- Update jobs table
DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'jobs') THEN
        -- Add status column if it doesn't exist
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'jobs' AND column_name = 'status') THEN
            ALTER TABLE public.jobs ADD COLUMN status job_status DEFAULT 'pending'::job_status;
        ELSE
            -- Update existing status column to use enum
            ALTER TABLE public.jobs ALTER COLUMN status TYPE job_status USING status::text::job_status;
        END IF;
    END IF;
END $$;

-- Update payments table
DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'payments') THEN
        -- Update status column
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'payments' AND column_name = 'status') THEN
            ALTER TABLE public.payments ALTER COLUMN status TYPE payment_status USING status::text::payment_status;
        END IF;
        
        -- Update payment_method column
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'payments' AND column_name = 'payment_method') THEN
            ALTER TABLE public.payments ALTER COLUMN payment_method TYPE payment_method USING payment_method::text::payment_method;
        END IF;
        
        -- Update payment_type column
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'payments' AND column_name = 'payment_type') THEN
            ALTER TABLE public.payments ALTER COLUMN payment_type TYPE payment_type USING payment_type::text::payment_type;
        END IF;
    END IF;
END $$;

-- Update withdrawals table
DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'withdrawals') THEN
        -- Update status column
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'withdrawals' AND column_name = 'status') THEN
            ALTER TABLE public.withdrawals ALTER COLUMN status TYPE payment_status USING status::text::payment_status;
        END IF;
        
        -- Update payout_method column
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'withdrawals' AND column_name = 'payout_method') THEN
            ALTER TABLE public.withdrawals ALTER COLUMN payout_method TYPE payout_method USING payout_method::text::payout_method;
        END IF;
    END IF;
END $$;

-- 4. Ensure the trigger function is properly created
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
DECLARE
    user_role_value user_role;
BEGIN
    -- Determine the role with explicit casting
    CASE 
        WHEN NEW.raw_user_meta_data->>'role' = 'expert' THEN
            user_role_value := 'expert'::user_role;
        WHEN NEW.raw_user_meta_data->>'role' = 'aid' THEN
            user_role_value := 'aid'::user_role;
        WHEN NEW.raw_user_meta_data->>'role' = 'admin' THEN
            user_role_value := 'admin'::user_role;
        ELSE
            user_role_value := 'student'::user_role;
    END CASE;

    -- Insert new user with comprehensive data
    INSERT INTO public.users (id, email, name, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(
            NEW.raw_user_meta_data->>'fullName', 
            NEW.raw_user_meta_data->>'name', 
            NEW.email
        ),
        user_role_value
    );
    
    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        RAISE LOG 'Error in handle_new_user: % - SQLSTATE: %', SQLERRM, SQLSTATE;
        RAISE;
END;
$function$;

-- 5. Create the trigger that was missing
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW 
    EXECUTE FUNCTION public.handle_new_user();

-- 6. Enable Row Level Security on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.withdrawals ENABLE ROW LEVEL SECURITY;

-- 7. Create RLS policies for users table
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
CREATE POLICY "Users can view own profile" 
    ON public.users 
    FOR SELECT 
    USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
CREATE POLICY "Users can update own profile" 
    ON public.users 
    FOR UPDATE 
    USING (auth.uid() = id);

-- 8. Create RLS policies for consultations table
DROP POLICY IF EXISTS "Users can view own consultations" ON public.consultations;
CREATE POLICY "Users can view own consultations" 
    ON public.consultations 
    FOR SELECT 
    USING (auth.uid() = student_id OR auth.uid() = expert_id);

DROP POLICY IF EXISTS "Students can create consultations" ON public.consultations;
CREATE POLICY "Students can create consultations" 
    ON public.consultations 
    FOR INSERT 
    WITH CHECK (auth.uid() = student_id);

DROP POLICY IF EXISTS "Participants can update consultations" ON public.consultations;
CREATE POLICY "Participants can update consultations" 
    ON public.consultations 
    FOR UPDATE 
    USING (auth.uid() = student_id OR auth.uid() = expert_id);

-- 9. Create RLS policies for jobs table
DROP POLICY IF EXISTS "Users can view own jobs" ON public.jobs;
CREATE POLICY "Users can view own jobs" 
    ON public.jobs 
    FOR SELECT 
    USING (auth.uid() = student_id OR auth.uid() = aid_id);

DROP POLICY IF EXISTS "Students can create jobs" ON public.jobs;
CREATE POLICY "Students can create jobs" 
    ON public.jobs 
    FOR INSERT 
    WITH CHECK (auth.uid() = student_id);

DROP POLICY IF EXISTS "Participants can update jobs" ON public.jobs;
CREATE POLICY "Participants can update jobs" 
    ON public.jobs 
    FOR UPDATE 
    USING (auth.uid() = student_id OR auth.uid() = aid_id);

-- 10. Create RLS policies for payments table
DROP POLICY IF EXISTS "Users can view own payments" ON public.payments;
CREATE POLICY "Users can view own payments" 
    ON public.payments 
    FOR SELECT 
    USING (auth.uid() = student_id OR auth.uid() = provider_id);

DROP POLICY IF EXISTS "Students can create payments" ON public.payments;
CREATE POLICY "Students can create payments" 
    ON public.payments 
    FOR INSERT 
    WITH CHECK (auth.uid() = student_id);

-- 11. Create RLS policies for withdrawals table
DROP POLICY IF EXISTS "Users can view own withdrawals" ON public.withdrawals;
CREATE POLICY "Users can view own withdrawals" 
    ON public.withdrawals 
    FOR SELECT 
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create own withdrawals" ON public.withdrawals;
CREATE POLICY "Users can create own withdrawals" 
    ON public.withdrawals 
    FOR INSERT 
    WITH CHECK (auth.uid() = user_id);
