-- Create consultations table for researcher/student bookings and messaging
CREATE TABLE public.consultations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  researcher_id uuid REFERENCES public.users(id),
  student_id uuid REFERENCES public.users(id),
  service_id uuid REFERENCES public.services(id),
  booking_id uuid REFERENCES public.service_bookings(id),
  topic text,
  status text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);
