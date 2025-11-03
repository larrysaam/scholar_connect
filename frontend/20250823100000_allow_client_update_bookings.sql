-- This migration fixes conflicting RLS update policies on service_bookings.
-- It removes the separate, restrictive policies for clients and providers
-- and replaces them with a single, permissive policy that allows either party
-- to update a booking they are involved in.

-- Drop the policy this migration file might have created in a previous run
DROP POLICY IF EXISTS "Clients can update their own bookings" ON public.service_bookings;

-- Drop the original provider-only update policy from the older migration
DROP POLICY IF EXISTS "Providers can update their bookings" ON public.service_bookings;

-- Drop the new combined policy if it exists, to make this script re-runnable
DROP POLICY IF EXISTS "Clients and Providers can update their own bookings" ON public.service_bookings;

-- Create the new, combined policy that works for both clients and providers
CREATE POLICY "Clients and Providers can update their own bookings"
ON public.service_bookings
FOR UPDATE
USING (auth.uid() = client_id OR auth.uid() = provider_id)
WITH CHECK (auth.uid() = client_id OR auth.uid() = provider_id);
