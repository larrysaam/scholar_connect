
-- Create messages table
CREATE TABLE public.messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  recipient_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  booking_id uuid NOT NULL REFERENCES public.service_bookings(id) ON DELETE CASCADE,
  content text NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on messages table
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- RLS policy for users to view their own messages
CREATE POLICY "Users can view their own messages" 
ON public.messages
FOR SELECT
USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

-- RLS policy for students to send messages for paid bookings
CREATE POLICY "Students can send messages for paid bookings" 
ON public.messages
FOR INSERT
WITH CHECK (
  auth.uid() = sender_id AND
  EXISTS (
    SELECT 1
    FROM public.service_bookings
    WHERE id = booking_id AND client_id = auth.uid() AND payment_status = 'paid'
  )
);

-- RLS policy for researchers/aids to send messages for their bookings
CREATE POLICY "Providers can send messages for their bookings" 
ON public.messages
FOR INSERT
WITH CHECK (
  auth.uid() = sender_id AND
  EXISTS (
    SELECT 1
    FROM public.service_bookings
    WHERE id = booking_id AND provider_id = auth.uid()
  )
);
