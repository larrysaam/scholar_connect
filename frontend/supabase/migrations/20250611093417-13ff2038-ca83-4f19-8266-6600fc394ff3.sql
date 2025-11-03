
-- Safely create the user_role enum type only if it doesn't exist
DO $$ BEGIN
    CREATE TYPE public.user_role AS ENUM ('student', 'expert', 'aid', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Recreate the handle_new_user function to ensure it works correctly
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
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
$function$;

-- Ensure the trigger exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
