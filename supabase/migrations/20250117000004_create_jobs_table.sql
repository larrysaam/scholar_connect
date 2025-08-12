-- Create jobs table for job postings
CREATE TABLE IF NOT EXISTS public.jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    budget DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'XAF' NOT NULL,
    location TEXT,
    duration TEXT,
    skills_required TEXT[] DEFAULT '{}',
    experience_level TEXT,
    urgency TEXT DEFAULT 'medium',
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed', 'cancelled')),
    applications_count INTEGER DEFAULT 0,
    deadline TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_jobs_user_id ON public.jobs(user_id);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON public.jobs(status);
CREATE INDEX IF NOT EXISTS idx_jobs_category ON public.jobs(category);
CREATE INDEX IF NOT EXISTS idx_jobs_created_at ON public.jobs(created_at DESC);

-- Enable RLS
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view all active jobs" ON public.jobs
    FOR SELECT USING (status = 'active' OR auth.uid() = user_id);

CREATE POLICY "Users can create their own jobs" ON public.jobs
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own jobs" ON public.jobs
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own jobs" ON public.jobs
    FOR DELETE USING (auth.uid() = user_id);

-- Create job applications table
CREATE TABLE IF NOT EXISTS public.job_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE NOT NULL,
    applicant_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    cover_letter TEXT,
    proposed_budget DECIMAL(10,2),
    estimated_duration TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'withdrawn')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(job_id, applicant_id)
);

-- Create indexes for job applications
CREATE INDEX IF NOT EXISTS idx_job_applications_job_id ON public.job_applications(job_id);
CREATE INDEX IF NOT EXISTS idx_job_applications_applicant_id ON public.job_applications(applicant_id);
CREATE INDEX IF NOT EXISTS idx_job_applications_status ON public.job_applications(status);

-- Enable RLS for job applications
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for job applications
CREATE POLICY "Job owners can view applications for their jobs" ON public.job_applications
    FOR SELECT USING (
        job_id IN (SELECT id FROM public.jobs WHERE user_id = auth.uid())
        OR applicant_id = auth.uid()
    );

CREATE POLICY "Users can create applications" ON public.job_applications
    FOR INSERT WITH CHECK (auth.uid() = applicant_id);

CREATE POLICY "Users can update their own applications" ON public.job_applications
    FOR UPDATE USING (auth.uid() = applicant_id);

CREATE POLICY "Job owners can update applications for their jobs" ON public.job_applications
    FOR UPDATE USING (
        job_id IN (SELECT id FROM public.jobs WHERE user_id = auth.uid())
    );

-- Function to update applications count
CREATE OR REPLACE FUNCTION update_job_applications_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE public.jobs 
        SET applications_count = applications_count + 1 
        WHERE id = NEW.job_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE public.jobs 
        SET applications_count = applications_count - 1 
        WHERE id = OLD.job_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to update applications count
CREATE TRIGGER trigger_update_applications_count_insert
    AFTER INSERT ON public.job_applications
    FOR EACH ROW EXECUTE FUNCTION update_job_applications_count();

CREATE TRIGGER trigger_update_applications_count_delete
    AFTER DELETE ON public.job_applications
    FOR EACH ROW EXECUTE FUNCTION update_job_applications_count();