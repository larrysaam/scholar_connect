
ALTER TABLE public.jobs
ADD COLUMN file_path TEXT;

-- Add 'inactive' to the check constraint for job status
ALTER TABLE public.jobs
DROP CONSTRAINT IF EXISTS jobs_status_check,
ADD CONSTRAINT jobs_status_check CHECK (status IN ('active', 'paused', 'completed', 'cancelled', 'inactive'));
