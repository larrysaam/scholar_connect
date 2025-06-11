
-- First, drop the existing trigger and function to recreate them properly
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Ensure the user_role enum type exists
DO $$ BEGIN
    CREATE TYPE public.user_role AS ENUM ('student', 'expert', 'aid', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Update the users table to ensure it uses the correct enum type
DO $$ BEGIN
    -- Only alter if the column exists and is not already the correct type
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'users' 
        AND column_name = 'role'
    ) THEN
        -- Update the column to use the enum type
        ALTER TABLE public.users 
        ALTER COLUMN role TYPE user_role USING role::text::user_role;
        
        ALTER TABLE public.users 
        ALTER COLUMN role SET DEFAULT 'student'::user_role;
    END IF;
END $$;

-- Recreate the handle_new_user function with proper error handling
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
    -- Insert new user with proper role casting
    INSERT INTO public.users (id, email, name, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(
            NEW.raw_user_meta_data->>'fullName', 
            NEW.raw_user_meta_data->>'name', 
            NEW.email
        ),
        CASE 
            WHEN NEW.raw_user_meta_data->>'role' = 'student' THEN 'student'::user_role
            WHEN NEW.raw_user_meta_data->>'role' = 'expert' THEN 'expert'::user_role
            WHEN NEW.raw_user_meta_data->>'role' = 'aid' THEN 'aid'::user_role
            WHEN NEW.raw_user_meta_data->>'role' = 'admin' THEN 'admin'::user_role
            ELSE 'student'::user_role
        END
    );
    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        -- Log the error and re-raise it
        RAISE LOG 'Error in handle_new_user: %', SQLERRM;
        RAISE;
END;
$function$;

-- Recreate the trigger
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW 
    EXECUTE FUNCTION public.handle_new_user();
