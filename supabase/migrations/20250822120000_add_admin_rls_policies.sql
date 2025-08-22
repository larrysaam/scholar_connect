-- Ensure RLS is enabled on the tables
ALTER TABLE public.service_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consultation_services ENABLE ROW LEVEL SECURITY;

-- Drop existing policies for admins to avoid conflicts
DROP POLICY IF EXISTS "Allow admin to read all service bookings" ON public.service_bookings;
DROP POLICY IF EXISTS "Allow admin to read all users" ON public.users;
DROP POLICY IF EXISTS "Allow admin to read all consultation services" ON public.consultation_services;

-- Add policies for a user with the 'admin' role
CREATE POLICY "Allow admin to read all service bookings"
ON public.service_bookings
FOR SELECT
TO authenticated
USING ( (SELECT auth.jwt() ->> 'role') = 'admin' );

CREATE POLICY "Allow admin to read all users"
ON public.users
FOR SELECT
TO authenticated
USING ( (SELECT auth.jwt() ->> 'role') = 'admin' );

CREATE POLICY "Allow admin to read all consultation services"
ON public.consultation_services
FOR SELECT
TO authenticated
USING ( (SELECT auth.jwt() ->> 'role') = 'admin' );
