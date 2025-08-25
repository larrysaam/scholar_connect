ALTER TABLE public.jobs
DROP CONSTRAINT jobs_status_check,
ADD CONSTRAINT jobs_status_check CHECK (status IN ('active', 'paused', 'completed', 'cancelled', 'closed'));