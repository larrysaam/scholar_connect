ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can view user profiles of people they have bookings with" ON public.users
  FOR SELECT USING (
    EXISTS (
      SELECT 1
      FROM service_bookings
      WHERE
        (service_bookings.client_id = auth.uid() AND service_bookings.provider_id = users.id) OR
        (service_bookings.provider_id = auth.uid() AND service_bookings.client_id = users.id)
    )
  );
