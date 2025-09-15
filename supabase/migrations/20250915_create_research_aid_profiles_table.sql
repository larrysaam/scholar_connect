-- Create research_aid_profiles table for research aid specific information
CREATE TABLE IF NOT EXISTS public.research_aid_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE UNIQUE,
    
    -- Professional Information
    title TEXT,
    bio TEXT,
    expertise TEXT[],
    hourly_rate DECIMAL(10,2) DEFAULT 0,
    years_experience INTEGER DEFAULT 0,
    
    -- Availability
    availability JSONB DEFAULT '{}'::jsonb,
    
    -- Rating and Reviews
    rating DECIMAL(3,2) DEFAULT 0.0,
    total_consultations_completed INTEGER DEFAULT 0,
    is_verified BOOLEAN DEFAULT false,
    response_time TEXT DEFAULT 'Usually responds within 24 hours',
    
    -- Professional Details (JSONB fields)
    educational_background JSONB DEFAULT '[]'::jsonb,
    work_experience JSONB DEFAULT '[]'::jsonb,
    awards JSONB DEFAULT '[]'::jsonb,
    publications JSONB DEFAULT '[]'::jsonb,
    scholarships JSONB DEFAULT '[]'::jsonb,
    verifications JSONB DEFAULT '{}'::jsonb,
    
    -- Professional Memberships
    affiliations TEXT[],
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_research_aid_profiles_user_id ON public.research_aid_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_research_aid_profiles_rating ON public.research_aid_profiles(rating DESC);
CREATE INDEX IF NOT EXISTS idx_research_aid_profiles_hourly_rate ON public.research_aid_profiles(hourly_rate);
CREATE INDEX IF NOT EXISTS idx_research_aid_profiles_is_verified ON public.research_aid_profiles(is_verified);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_research_aid_profiles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER research_aid_profiles_updated_at
    BEFORE UPDATE ON public.research_aid_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_research_aid_profiles_updated_at();

-- Enable RLS (this should already exist from the other migration)
ALTER TABLE public.research_aid_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies (these should already exist from the other migration, but adding for completeness)
DO $$
BEGIN
    CREATE POLICY "Research aids can view their own profile" ON public.research_aid_profiles
        FOR SELECT USING (auth.uid() = user_id);
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
    CREATE POLICY "Research aids can update their own profile" ON public.research_aid_profiles
        FOR UPDATE USING (auth.uid() = user_id);
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
    CREATE POLICY "Research aids can insert their own profile" ON public.research_aid_profiles
        FOR INSERT WITH CHECK (auth.uid() = user_id);
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
    CREATE POLICY "Research aids can delete their own profile" ON public.research_aid_profiles
        FOR DELETE USING (auth.uid() = user_id);
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
    CREATE POLICY "Everyone can view public research aid profiles" ON public.research_aid_profiles
        FOR SELECT USING (true);
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;
