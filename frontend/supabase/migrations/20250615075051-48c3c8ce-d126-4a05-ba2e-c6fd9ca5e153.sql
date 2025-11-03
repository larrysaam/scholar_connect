
-- 1. Create the "user_role" enum if it doesn't exist
DO $$
BEGIN
    CREATE TYPE public.user_role AS ENUM ('student', 'expert', 'aid', 'admin');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- 2. Ensure 'role' column in public.users uses the enum and has a default
ALTER TABLE public.users
  ALTER COLUMN role TYPE user_role USING role::text::user_role,
  ALTER COLUMN role SET DEFAULT 'student'::user_role;

-- 3. (Re)create the handle_new_user function and trigger for auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    user_role_value user_role;
BEGIN
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Make sure the trigger is created on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

