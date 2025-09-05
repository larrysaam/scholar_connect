ALTER TABLE public.job_applications
ADD COLUMN booking_id UUID REFERENCES public.service_bookings(id) ON DELETE SET NULL;