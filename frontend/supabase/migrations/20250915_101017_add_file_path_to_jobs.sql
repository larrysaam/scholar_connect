-- Add file_path column to jobs table for storing deliverables
ALTER TABLE public.jobs ADD COLUMN IF NOT EXISTS file_path JSONB DEFAULT '[]'::jsonb;

-- Add comment to document the column
COMMENT ON COLUMN public.jobs.file_path IS 'Stores deliverables as array of objects with url and name properties';
