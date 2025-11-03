-- Fix the user registration trigger function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create a robust handle_new_user function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
DECLARE
    user_role_value user_role;
    user_name text;
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

    -- Get the user name from metadata
    user_name := COALESCE(
        NEW.raw_user_meta_data->>'fullName',
        NEW.raw_user_meta_data->>'name',
        NEW.raw_user_meta_data->>'full_name',
        split_part(NEW.email, '@', 1)
    );

    -- Insert new user with proper error handling
    INSERT INTO public.users (id, email, name, role)
    VALUES (
        NEW.id,
        NEW.email,
        user_name,
        user_role_value
    );
    
    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        -- Log the error for debugging
        RAISE LOG 'Error in handle_new_user for user %: % - SQLSTATE: %', NEW.email, SQLERRM, SQLSTATE;
        -- Re-raise the error to prevent user creation
        RAISE;
END;
$function$;

-- Recreate the trigger
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW 
    EXECUTE FUNCTION public.handle_new_user();

-- Enable RLS on users table
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create basic RLS policies for users table
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Enable insert for authenticated users only" ON public.users
    FOR INSERT WITH CHECK (auth.uid() = id);