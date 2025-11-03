-- Fix RLS policies for researcher_profiles and research_aid_profiles to allow unauthenticated INSERT during signup

-- For researcher_profiles table
-- Drop existing restrictive INSERT policy
DROP POLICY IF EXISTS "Users can create their own researcher profile" ON public.researcher_profiles;

-- Create policy for authenticated users to manage their own profiles
CREATE POLICY "Users can manage their own researcher profile" ON public.researcher_profiles
  FOR ALL
  TO authenticated
  USING (id = auth.uid()::uuid)
  WITH CHECK (id = auth.uid()::uuid);

-- Allow unauthenticated users to create profiles (for signup process)
CREATE POLICY "Unauthenticated users can create researcher profiles" ON public.researcher_profiles
  FOR INSERT
  WITH CHECK (true);

-- Allow service role to manage all profiles (for admin operations)
DROP POLICY IF EXISTS "Service role can manage all researcher profiles" ON public.researcher_profiles;
CREATE POLICY "Service role can manage all researcher profiles" ON public.researcher_profiles
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- For research_aid_profiles table
-- Drop existing restrictive INSERT policy
DROP POLICY IF EXISTS "Research aids can insert their own profile" ON public.research_aid_profiles;

-- Create policy for authenticated users to manage their own profiles
CREATE POLICY "Users can manage their own research aid profile" ON public.research_aid_profiles
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid()::uuid)
  WITH CHECK (user_id = auth.uid()::uuid);

-- Allow unauthenticated users to create profiles (for signup process)
CREATE POLICY "Unauthenticated users can create research aid profiles" ON public.research_aid_profiles
  FOR INSERT
  WITH CHECK (true);

-- Allow service role to manage all profiles (for admin operations)
DROP POLICY IF EXISTS "Service role can manage all research aid profiles" ON public.research_aid_profiles;
CREATE POLICY "Service role can manage all research aid profiles" ON public.research_aid_profiles
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
