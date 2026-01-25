-- ================================================================
-- Add response_reason column to coauthor_invitations table
-- Execute this in Supabase SQL Editor
-- ================================================================

-- Add the response_reason column
ALTER TABLE public.coauthor_invitations 
ADD COLUMN IF NOT EXISTS response_reason text;

-- Add a comment to document the column
COMMENT ON COLUMN public.coauthor_invitations.response_reason 
IS 'The reason provided by the invitee when accepting or declining the invitation';

-- Verify the column was added successfully
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'coauthor_invitations'
ORDER BY ordinal_position;

-- Optional: View sample data to confirm structure
SELECT 
    id,
    status,
    responded_at,
    response_reason,
    created_at
FROM public.coauthor_invitations 
LIMIT 5;
