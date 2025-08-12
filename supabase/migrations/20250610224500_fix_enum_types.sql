-- Drop existing trigger and function if they exist
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Drop existing types if they exist (to recreate them fresh)
DROP TYPE IF EXISTS user_role CASCADE;
DROP TYPE IF EXISTS sex_type CASCADE;
DROP TYPE IF EXISTS study_level CASCADE;
DROP TYPE IF EXISTS payout_method CASCADE;
DROP TYPE IF EXISTS consultation_status CASCADE;
DROP TYPE IF EXISTS job_status CASCADE;
DROP TYPE IF EXISTS payment_status CASCADE;
DROP TYPE IF EXISTS payment_method CASCADE;
DROP TYPE IF EXISTS payment_type CASCADE;

-- Create all required enum types
CREATE TYPE user_role AS ENUM ('student', 'expert', 'aid', 'admin');
CREATE TYPE sex_type AS ENUM ('male', 'female');
CREATE TYPE study_level AS ENUM ('undergraduate', 'masters', 'phd', 'postdoc');
CREATE TYPE payout_method AS ENUM ('mobile_money', 'bank_transfer', 'paypal');
CREATE TYPE consultation_status AS ENUM ('pending', 'confirmed', 'completed', 'cancelled');
CREATE TYPE job_status AS ENUM ('pending', 'assigned', 'in_progress', 'completed', 'cancelled');
CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'failed', 'refunded', 'released');
CREATE TYPE payment_method AS ENUM ('stripe', 'mobile_money', 'bank_transfer');
CREATE TYPE payment_type AS ENUM ('consultation', 'service');

-- Update users table to use the new enum types (only if table exists)
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'users' AND table_schema = 'public') THEN
        ALTER TABLE public.users 
          ALTER COLUMN role TYPE user_role USING role::text::user_role,
          ALTER COLUMN role SET DEFAULT 'student'::user_role;
    END IF;
END $$;

-- Create the handle_new_user function
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

-- Create the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();