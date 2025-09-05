DROP POLICY IF EXISTS "Users can insert their own notifications" ON public.notifications;

CREATE POLICY "System can insert notifications for any user" ON public.notifications
    FOR INSERT WITH CHECK (true);