-- Create researcher_profiles table for additional researcher information
CREATE TABLE IF NOT EXISTS researcher_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Professional Information
    title TEXT,
    department TEXT,
    years_experience INTEGER DEFAULT 0,
    students_supervised INTEGER DEFAULT 0,
    hourly_rate DECIMAL(10,2) DEFAULT 0,
    response_time TEXT DEFAULT 'Usually responds within 24 hours',
    is_online BOOLEAN DEFAULT false,
    online_status TEXT DEFAULT 'offline' CHECK (online_status IN ('online', 'offline', 'busy', 'away')),
    
    -- Bio and Description
    bio TEXT,
    research_interests TEXT[],
    specialties TEXT[],
    
    -- Education
    education JSONB DEFAULT '[]'::jsonb,
    
    -- Experience
    experience JSONB DEFAULT '[]'::jsonb,
    
    -- Publications
    publications JSONB DEFAULT '[]'::jsonb,
    
    -- Awards and Recognition
    awards JSONB DEFAULT '[]'::jsonb,
    fellowships JSONB DEFAULT '[]'::jsonb,
    grants JSONB DEFAULT '[]'::jsonb,
    
    -- Professional Memberships
    memberships TEXT[],
    
    -- Supervision Information
    supervision JSONB DEFAULT '[]'::jsonb,
    
    -- Availability
    available_times JSONB DEFAULT '[]'::jsonb,
    
    -- Verification Status
    verifications JSONB DEFAULT '{
        "academic": "pending",
        "publication": "pending", 
        "institutional": "pending"
    }'::jsonb,
    
    -- Rating and Reviews
    rating DECIMAL(3,2) DEFAULT 0.0,
    total_reviews INTEGER DEFAULT 0,
    
    -- Profile Settings
    profile_visibility TEXT DEFAULT 'public' CHECK (profile_visibility IN ('public', 'private', 'limited')),
    show_contact_info BOOLEAN DEFAULT true,
    show_hourly_rate BOOLEAN DEFAULT true,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_researcher_profiles_user_id ON researcher_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_researcher_profiles_rating ON researcher_profiles(rating DESC);
CREATE INDEX IF NOT EXISTS idx_researcher_profiles_online_status ON researcher_profiles(online_status);
CREATE INDEX IF NOT EXISTS idx_researcher_profiles_hourly_rate ON researcher_profiles(hourly_rate);
CREATE INDEX IF NOT EXISTS idx_researcher_profiles_visibility ON researcher_profiles(profile_visibility);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_researcher_profiles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER researcher_profiles_updated_at
    BEFORE UPDATE ON researcher_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_researcher_profiles_updated_at();

-- Enable RLS
ALTER TABLE researcher_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users can view public profiles and their own profile
CREATE POLICY "Users can view public researcher profiles" ON researcher_profiles
    FOR SELECT USING (
        profile_visibility = 'public' OR 
        (auth.uid() = user_id)
    );

-- Users can insert their own profile
CREATE POLICY "Users can create their own researcher profile" ON researcher_profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own profile
CREATE POLICY "Users can update their own researcher profile" ON researcher_profiles
    FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own profile
CREATE POLICY "Users can delete their own researcher profile" ON researcher_profiles
    FOR DELETE USING (auth.uid() = user_id);

-- Create reviews table for researcher reviews
CREATE TABLE IF NOT EXISTS researcher_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    researcher_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    reviewer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Review Content
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    
    -- Review Context
    service_type TEXT,
    collaboration_type TEXT,
    
    -- Status
    is_verified BOOLEAN DEFAULT false,
    is_public BOOLEAN DEFAULT true,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Prevent duplicate reviews from same reviewer
    UNIQUE(researcher_id, reviewer_id)
);

-- Create indexes for reviews
CREATE INDEX IF NOT EXISTS idx_researcher_reviews_researcher_id ON researcher_reviews(researcher_id);
CREATE INDEX IF NOT EXISTS idx_researcher_reviews_reviewer_id ON researcher_reviews(reviewer_id);
CREATE INDEX IF NOT EXISTS idx_researcher_reviews_rating ON researcher_reviews(rating DESC);
CREATE INDEX IF NOT EXISTS idx_researcher_reviews_created_at ON researcher_reviews(created_at DESC);

-- Enable RLS for reviews
ALTER TABLE researcher_reviews ENABLE ROW LEVEL SECURITY;

-- RLS Policies for reviews
-- Anyone can view public reviews
CREATE POLICY "Anyone can view public researcher reviews" ON researcher_reviews
    FOR SELECT USING (is_public = true);

-- Users can create reviews for others (not themselves)
CREATE POLICY "Users can create reviews for researchers" ON researcher_reviews
    FOR INSERT WITH CHECK (
        auth.uid() = reviewer_id AND 
        auth.uid() != researcher_id
    );

-- Users can update their own reviews
CREATE POLICY "Users can update their own reviews" ON researcher_reviews
    FOR UPDATE USING (auth.uid() = reviewer_id);

-- Users can delete their own reviews
CREATE POLICY "Users can delete their own reviews" ON researcher_reviews
    FOR DELETE USING (auth.uid() = reviewer_id);

-- Create function to update researcher rating when reviews change
CREATE OR REPLACE FUNCTION update_researcher_rating()
RETURNS TRIGGER AS $$
BEGIN
    -- Update the researcher's rating in researcher_profiles
    UPDATE researcher_profiles 
    SET 
        rating = (
            SELECT COALESCE(AVG(rating), 0)
            FROM researcher_reviews 
            WHERE researcher_id = COALESCE(NEW.researcher_id, OLD.researcher_id)
            AND is_public = true
        ),
        total_reviews = (
            SELECT COUNT(*)
            FROM researcher_reviews 
            WHERE researcher_id = COALESCE(NEW.researcher_id, OLD.researcher_id)
            AND is_public = true
        ),
        updated_at = NOW()
    WHERE user_id = COALESCE(NEW.researcher_id, OLD.researcher_id);
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create triggers to update rating on review changes
CREATE TRIGGER update_researcher_rating_on_insert
    AFTER INSERT ON researcher_reviews
    FOR EACH ROW
    EXECUTE FUNCTION update_researcher_rating();

CREATE TRIGGER update_researcher_rating_on_update
    AFTER UPDATE ON researcher_reviews
    FOR EACH ROW
    EXECUTE FUNCTION update_researcher_rating();

CREATE TRIGGER update_researcher_rating_on_delete
    AFTER DELETE ON researcher_reviews
    FOR EACH ROW
    EXECUTE FUNCTION update_researcher_rating();