-- Fix consultation services RLS policy to allow experts to create services during signup
-- Drop the existing policy that might be too restrictive
DROP POLICY IF EXISTS "Researchers can create services" ON public.consultation_services;

-- Drop existing policy if it exists to avoid conflicts
DROP POLICY IF EXISTS "Experts can create their own services" ON public.consultation_services;

-- Create a new policy that allows authenticated experts to create services
CREATE POLICY "Experts can create their own services" ON public.consultation_services
  FOR INSERT
  WITH CHECK (
    auth.uid() = user_id OR auth.uid() IS NULL
  );

-- Allow unauthenticated users to create services (for signup process)
CREATE POLICY "Unauthenticated users can create services" ON public.consultation_services
  FOR INSERT
  WITH CHECK (true);

-- Also allow service role to create services (for admin operations)
DROP POLICY IF EXISTS "Service role can manage all services" ON public.consultation_services;
CREATE POLICY "Service role can manage all services" ON public.consultation_services
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
