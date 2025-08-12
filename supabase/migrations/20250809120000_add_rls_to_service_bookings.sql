
-- Add RLS policies for service_bookings table

-- Enable RLS on the table
ALTER TABLE public.service_bookings ENABLE ROW LEVEL SECURITY;

-- Policy for providers (researchers) to view their bookings
CREATE POLICY "Providers can view their bookings" 
ON public.service_bookings
FOR SELECT
USING (auth.uid() = provider_id);

-- Policy for clients (students) to view their bookings
CREATE POLICY "Clients can view their bookings" 
ON public.service_bookings
FOR SELECT
USING (auth.uid() = client_id);

-- Policy for clients (students) to create new bookings
CREATE POLICY "Clients can create new bookings" 
ON public.service_bookings
FOR INSERT
WITH CHECK (auth.uid() = client_id);

-- Policy for providers (researchers) to update their bookings
CREATE POLICY "Providers can update their bookings" 
ON public.service_bookings
FOR UPDATE
USING (auth.uid() = provider_id)
WITH CHECK (auth.uid() = provider_id);
