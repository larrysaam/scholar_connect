ALTER TABLE public.service_bookings
ADD COLUMN IF NOT EXISTS shared_documents JSONB;