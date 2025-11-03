
-- First, let's check and create RLS policies only if they don't exist

-- Enable RLS for tables that don't have it yet
DO $$ 
BEGIN
    -- Enable RLS for content_quality_assessments if not already enabled
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables 
        WHERE schemaname = 'public' 
        AND tablename = 'content_quality_assessments' 
        AND rowsecurity = true
    ) THEN
        ALTER TABLE public.content_quality_assessments ENABLE ROW LEVEL SECURITY;
    END IF;

    -- Enable RLS for content_reviews if not already enabled
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables 
        WHERE schemaname = 'public' 
        AND tablename = 'content_reviews' 
        AND rowsecurity = true
    ) THEN
        ALTER TABLE public.content_reviews ENABLE ROW LEVEL SECURITY;
    END IF;

    -- Enable RLS for search_analytics if not already enabled
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables 
        WHERE schemaname = 'public' 
        AND tablename = 'search_analytics' 
        AND rowsecurity = true
    ) THEN
        ALTER TABLE public.search_analytics ENABLE ROW LEVEL SECURITY;
    END IF;

    -- Enable RLS for institutional_team_members if not already enabled
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables 
        WHERE schemaname = 'public' 
        AND tablename = 'institutional_team_members' 
        AND rowsecurity = true
    ) THEN
        ALTER TABLE public.institutional_team_members ENABLE ROW LEVEL SECURITY;
    END IF;
END $$;

-- Create policies for content_quality_assessments (only if they don't exist)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'content_quality_assessments' AND policyname = 'Users can view quality assessments for their own content') THEN
        CREATE POLICY "Users can view quality assessments for their own content" 
        ON public.content_quality_assessments 
        FOR SELECT 
        USING (
          content_id IN (
            SELECT id FROM public.content_metadata 
            WHERE content_metadata.id = content_quality_assessments.content_id
          )
        );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'content_quality_assessments' AND policyname = 'System can insert quality assessments') THEN
        CREATE POLICY "System can insert quality assessments" 
        ON public.content_quality_assessments 
        FOR INSERT 
        WITH CHECK (true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'content_quality_assessments' AND policyname = 'System can update quality assessments') THEN
        CREATE POLICY "System can update quality assessments" 
        ON public.content_quality_assessments 
        FOR UPDATE 
        USING (true);
    END IF;
END $$;

-- Create policies for content_reviews (only if they don't exist)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'content_reviews' AND policyname = 'Anyone can view content reviews') THEN
        CREATE POLICY "Anyone can view content reviews" 
        ON public.content_reviews 
        FOR SELECT 
        USING (true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'content_reviews' AND policyname = 'Authenticated users can create reviews') THEN
        CREATE POLICY "Authenticated users can create reviews" 
        ON public.content_reviews 
        FOR INSERT 
        WITH CHECK (auth.uid() = reviewer_id);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'content_reviews' AND policyname = 'Users can update their own reviews') THEN
        CREATE POLICY "Users can update their own reviews" 
        ON public.content_reviews 
        FOR UPDATE 
        USING (auth.uid() = reviewer_id);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'content_reviews' AND policyname = 'Users can delete their own reviews') THEN
        CREATE POLICY "Users can delete their own reviews" 
        ON public.content_reviews 
        FOR DELETE 
        USING (auth.uid() = reviewer_id);
    END IF;
END $$;

-- Create policies for search_analytics (only if they don't exist)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'search_analytics' AND policyname = 'Users can view their own search analytics') THEN
        CREATE POLICY "Users can view their own search analytics" 
        ON public.search_analytics 
        FOR SELECT 
        USING (auth.uid() = user_id);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'search_analytics' AND policyname = 'Users can insert their own search analytics') THEN
        CREATE POLICY "Users can insert their own search analytics" 
        ON public.search_analytics 
        FOR INSERT 
        WITH CHECK (auth.uid() = user_id);
    END IF;
END $$;

-- Create policies for institutional_team_members (only if they don't exist)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'institutional_team_members' AND policyname = 'Team members can view their team') THEN
        CREATE POLICY "Team members can view their team" 
        ON public.institutional_team_members 
        FOR SELECT 
        USING (
          auth.uid() = user_id OR 
          auth.uid() IN (
            SELECT user_id FROM public.institutional_team_members itm2 
            WHERE itm2.institutional_profile_id = institutional_team_members.institutional_profile_id 
            AND itm2.role = 'admin'
          )
        );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'institutional_team_members' AND policyname = 'Admins can manage team members') THEN
        CREATE POLICY "Admins can manage team members" 
        ON public.institutional_team_members 
        FOR ALL 
        USING (
          auth.uid() IN (
            SELECT user_id FROM public.institutional_team_members itm2 
            WHERE itm2.institutional_profile_id = institutional_team_members.institutional_profile_id 
            AND itm2.role = 'admin'
          )
        );
    END IF;
END $$;
