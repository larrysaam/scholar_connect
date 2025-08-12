-- Ensure users table exists with correct structure
CREATE TABLE IF NOT EXISTS public.users (
    id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email text NOT NULL,
    name text,
    role text NOT NULL DEFAULT 'student',
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

-- Disable RLS to allow inserts
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;

-- Drop any existing policies
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.users;

-- Grant necessary permissions
GRANT ALL ON public.users TO authenticated;
GRANT ALL ON public.users TO anon;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);

-- Ensure no conflicting triggers exist
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();