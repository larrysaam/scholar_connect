
-- First, ensure the enum types exist
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('student', 'expert', 'aid', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE sex_type AS ENUM ('male', 'female');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE study_level AS ENUM ('undergraduate', 'masters', 'phd', 'postdoc');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE payout_method AS ENUM ('mobile_money', 'bank_transfer', 'paypal');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Update the handle_new_user function to be more robust
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
