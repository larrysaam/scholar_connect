ALTER TABLE public.messages
ADD COLUMN conversation_id UUID,
ADD COLUMN is_read BOOLEAN DEFAULT FALSE;

-- Add a foreign key constraint to conversations table if it exists
-- This assumes a 'conversations' table exists or will be created.
-- If 'conversations' table doesn't exist, this FK constraint will fail.
-- For now, I'll add it as a comment, and we can uncomment if the table is confirmed to exist.
-- ALTER TABLE public.messages
-- ADD CONSTRAINT fk_conversation
-- FOREIGN KEY (conversation_id)
-- REFERENCES public.conversations(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON public.messages(conversation_id);