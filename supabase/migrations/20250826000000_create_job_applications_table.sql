
CREATE TABLE job_applications (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    job_id BIGINT NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    applicant_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'pending', -- pending, accepted, rejected
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (job_id, applicant_id)
);

ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;

-- Policies for job_applications table

-- Allow authenticated users to create applications for themselves
CREATE POLICY "Allow authenticated users to create applications"
ON job_applications
FOR INSERT
WITH CHECK (auth.uid() = applicant_id);

-- Allow students to view applications for their own jobs
CREATE POLICY "Allow students to view applications for their jobs"
ON job_applications
FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM jobs
    WHERE jobs.id = job_applications.job_id AND jobs.user_id = auth.uid()
  )
);

-- Allow applicants to view their own applications
CREATE POLICY "Allow applicants to view their own applications"
ON job_applications
FOR SELECT
USING (auth.uid() = applicant_id);

-- Allow students to update the status of applications for their jobs
CREATE POLICY "Allow students to update application status for their jobs"
ON job_applications
FOR UPDATE
USING (
  EXISTS (
    SELECT 1
    FROM jobs
    WHERE jobs.id = job_applications.job_id AND jobs.user_id = auth.uid()
  )
);
