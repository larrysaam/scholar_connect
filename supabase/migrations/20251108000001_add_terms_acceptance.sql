-- Add terms acceptance columns to users table
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS terms_accepted boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS terms_accepted_at timestamp with time zone;

-- Create an index for efficient querying
CREATE INDEX IF NOT EXISTS idx_users_terms_accepted ON public.users (terms_accepted);

-- Update RLS policies if needed (users should be able to update their own terms acceptance)
-- This ensures users can update their own terms_accepted status
-- Drop the policy if it exists and recreate it
DROP POLICY IF EXISTS "Users can update their own terms acceptance" ON public.users;
CREATE POLICY "Users can update their own terms acceptance" ON public.users
    FOR UPDATE USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);
