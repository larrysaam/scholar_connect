-- Fix service_pricing RLS policy to allow unauthenticated users to create pricing during signup

-- Drop the existing policy that requires authentication
DROP POLICY IF EXISTS "Users can manage pricing for their services" ON public.service_pricing;

-- Create a new policy that allows authenticated users to manage pricing for their services
CREATE POLICY "Users can manage pricing for their services" ON public.service_pricing
  FOR ALL
  USING (
    service_id IN (
      SELECT id FROM public.consultation_services 
      WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    service_id IN (
      SELECT id FROM public.consultation_services 
      WHERE user_id = auth.uid()
    )
  );

-- Allow unauthenticated users to create pricing (for signup process)
CREATE POLICY "Unauthenticated users can create pricing" ON public.service_pricing
  FOR INSERT
  WITH CHECK (true);

-- Also allow service role to manage all pricing (for admin operations)
DROP POLICY IF EXISTS "Service role can manage all pricing" ON public.service_pricing;
CREATE POLICY "Service role can manage all pricing" ON public.service_pricing
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
