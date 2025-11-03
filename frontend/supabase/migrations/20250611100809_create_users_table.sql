
-- Check if the enum exists and create it if it doesn't
DO $$ 
BEGIN
    -- First check if the enum exists
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE public.user_role AS ENUM ('student', 'expert', 'aid', 'admin');
    END IF;
END $$;

-- Check if the users table exists and has the correct structure
DO $$ 
BEGIN
    -- Check if users table exists
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'users' AND table_schema = 'public') THEN
        -- Update the role column to use the enum if it's not already
        IF EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'users' 
            AND column_name = 'role' 
            AND table_schema = 'public'
            AND data_type != 'USER-DEFINED'
        ) THEN
            ALTER TABLE public.users ALTER COLUMN role TYPE user_role USING role::text::user_role;
        END IF;
        
        -- Set default value
        ALTER TABLE public.users ALTER COLUMN role SET DEFAULT 'student'::user_role;
    ELSE
        -- Create the users table if it doesn't exist
        CREATE TABLE public.users (
            id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
            email text NOT NULL,
            name text,
            role user_role NOT NULL DEFAULT 'student'::user_role,
            phone_number text,
            country text,
            institution text,
            faculty text,
            payout_details jsonb,
            preferred_payout_method text,
            wallet_balance numeric DEFAULT 0.00,
            date_of_birth date,
            sex text,
            study_level text,
            user_id uuid,
            research_areas text[],
            topic_title text,
            research_stage text,
            languages text[],
            expertise text[],
            other_expertise text,
            experience text,
            linkedin_url text,
            updated_at timestamp with time zone DEFAULT now(),
            created_at timestamp with time zone DEFAULT now()
        );
    END IF;
END $$;

-- Drop and recreate the trigger function with better error handling
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

    -- Insert new user
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

-- Recreate the trigger
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW 
    EXECUTE FUNCTION public.handle_new_user();
