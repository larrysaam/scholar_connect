
-- First, let's check if the enum exists and create it if it doesn't
DO $$ 
BEGIN
    -- Check if user_role type exists, if not create it
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM ('student', 'expert', 'aid', 'admin');
    END IF;
END $$;

-- Ensure the users table has the correct structure
ALTER TABLE public.users 
ALTER COLUMN role TYPE user_role USING 
  CASE 
    WHEN role::text = 'student' THEN 'student'::user_role
    WHEN role::text = 'expert' THEN 'expert'::user_role  
    WHEN role::text = 'aid' THEN 'aid'::user_role
    WHEN role::text = 'admin' THEN 'admin'::user_role
    ELSE 'student'::user_role
  END;

-- Set default value for role column
ALTER TABLE public.users ALTER COLUMN role SET DEFAULT 'student'::user_role;

-- Recreate the trigger function to ensure it works properly
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
