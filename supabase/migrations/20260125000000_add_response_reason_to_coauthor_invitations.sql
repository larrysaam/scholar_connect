-- Add response_reason column to coauthor_invitations table
-- This will store the reason provided by the invitee when accepting or declining an invitation

ALTER TABLE public.coauthor_invitations 
ADD COLUMN IF NOT EXISTS response_reason text;

-- Add a comment to the column
COMMENT ON COLUMN public.coauthor_invitations.response_reason IS 'The reason provided by the invitee when accepting or declining the invitation';
