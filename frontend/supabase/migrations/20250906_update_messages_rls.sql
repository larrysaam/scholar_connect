DROP POLICY IF EXISTS "Users can send messages in their bookings" ON public.messages;

CREATE POLICY "Users can send messages in their bookings" ON public.messages
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');