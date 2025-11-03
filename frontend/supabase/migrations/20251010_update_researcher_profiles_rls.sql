-- Add RLS policy for researcher profile creation
CREATE POLICY "Users can create their own researcher profile"
ON public.researcher_profiles
FOR INSERT
TO authenticated
WITH CHECK (
    -- Allow users to only create their own profile
    id = auth.uid()::uuid
);

-- Allow users to read their own profiles
CREATE POLICY "Users can read their own researcher profile"
ON public.researcher_profiles
FOR SELECT
TO authenticated
USING (id = auth.uid()::uuid);

-- Ensure RLS is enabled
ALTER TABLE public.researcher_profiles FORCE ROW LEVEL SECURITY;
