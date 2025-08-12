-- Temporarily disable the trigger to debug the issue
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create a simpler version of the trigger function for debugging
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
    -- Simple insert with minimal data to test
    INSERT INTO public.users (id, email, name, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.email, 'Unknown'),
        'student'::user_role
    );
    
    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        -- Log the specific error
        RAISE LOG 'Error in handle_new_user for user %: % - SQLSTATE: %, DETAIL: %', 
            NEW.email, SQLERRM, SQLSTATE, SQLDETAIL;
        -- Don't re-raise to allow user creation to proceed
        RETURN NEW;
END;
$function$;

-- Recreate the trigger
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW 
    EXECUTE FUNCTION public.handle_new_user();