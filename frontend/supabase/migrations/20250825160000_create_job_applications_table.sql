CREATE TABLE IF NOT EXISTS public.job_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE NOT NULL,
    applicant_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;

-- Policy for Research Aids to insert their own applications
CREATE POLICY "Research Aids can create their own job applications" ON public.job_applications
    FOR INSERT WITH CHECK (auth.uid() = applicant_id);

-- Policy for Students (job owners) to view applications for their jobs
CREATE POLICY "Students can view applications for their jobs" ON public.job_applications
    FOR SELECT USING (
        job_id IN (SELECT id FROM public.jobs WHERE user_id = auth.uid())
    );

-- Policy for Research Aids to view their own applications
CREATE POLICY "Research Aids can view their own job applications" ON public.job_applications
    FOR SELECT USING (auth.uid() = applicant_id);

-- Policy for Students (job owners) to update application status (accept/reject)
CREATE POLICY "Students can update job application status for their jobs" ON public.job_applications
    FOR UPDATE USING (
        job_id IN (SELECT id FROM public.jobs WHERE user_id = auth.uid())
    );

-- Policy to prevent deletion (optional, but good for audit)
CREATE POLICY "No one can delete job applications" ON public.job_applications
    FOR DELETE USING (false);

-- Grant necessary permissions
GRANT ALL ON public.job_applications TO authenticated;