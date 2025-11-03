-- Add admin RLS policy for users table based on role column
-- This allows users with role 'admin' to view all users

DO $$
BEGIN
    CREATE POLICY "Admins can view all users based on role"
    ON public.users
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.users admin_user
            WHERE admin_user.id = auth.uid() 
            AND admin_user.role = 'admin'
        )
    );
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- Also add admin policies for other tables needed by admin dashboard
DO $$
BEGIN
    CREATE POLICY "Admins can view all service bookings"
    ON public.service_bookings
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.users admin_user
            WHERE admin_user.id = auth.uid() 
            AND admin_user.role = 'admin'
        )
    );
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
    CREATE POLICY "Admins can view all jobs"
    ON public.jobs
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.users admin_user
            WHERE admin_user.id = auth.uid() 
            AND admin_user.role = 'admin' 
        )
    );
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
    CREATE POLICY "Admins can view all researcher profiles"
    ON public.researcher_profiles
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.users admin_user
            WHERE admin_user.id = auth.uid() 
            AND admin_user.role = 'admin'
        )
    );
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
    CREATE POLICY "Admins can view all researcher reviews"
    ON public.researcher_reviews
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.users admin_user
            WHERE admin_user.id = auth.uid() 
            AND admin_user.role = 'admin'
        )
    );
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;
