-- Add admin RLS policy for transactions table
DO $$
BEGIN
    CREATE POLICY "Admins can view all transactions"
    ON public.transactions
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
