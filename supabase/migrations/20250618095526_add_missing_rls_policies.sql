
-- Add remaining RLS policies for all tables

-- Consultations policies
DO $$
BEGIN
    CREATE POLICY "Students can view their consultations" ON public.consultations
      FOR SELECT USING (auth.uid() = student_id);
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
    CREATE POLICY "Experts can view their consultations" ON public.consultations
      FOR SELECT USING (auth.uid() = expert_id);
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
    CREATE POLICY "Students can create consultations" ON public.consultations
      FOR INSERT WITH CHECK (auth.uid() = student_id);
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
    CREATE POLICY "Experts can update their consultations" ON public.consultations
      FOR UPDATE USING (auth.uid() = expert_id);
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- Jobs policies
DO $$
BEGIN
    CREATE POLICY "Students can view their jobs" ON public.jobs
      FOR SELECT USING (auth.uid() = student_id);
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
    CREATE POLICY "Research aids can view assigned jobs" ON public.jobs
      FOR SELECT USING (auth.uid() = aid_id);
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
    CREATE POLICY "Students can create jobs" ON public.jobs
      FOR INSERT WITH CHECK (auth.uid() = student_id);
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
    CREATE POLICY "Research aids can update assigned jobs" ON public.jobs
      FOR UPDATE USING (auth.uid() = aid_id);
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- Payments policies
DO $$
BEGIN
    CREATE POLICY "Students can view their payments" ON public.payments
      FOR SELECT USING (auth.uid() = student_id);
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
    CREATE POLICY "Providers can view their earnings" ON public.payments
      FOR SELECT USING (auth.uid() = provider_id);
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
    CREATE POLICY "Students can create payments" ON public.payments
      FOR INSERT WITH CHECK (auth.uid() = student_id);
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- Withdrawals policies
DO $$
BEGIN
    CREATE POLICY "Users can view own withdrawals" ON public.withdrawals
      FOR SELECT USING (auth.uid() = user_id);
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
    CREATE POLICY "Users can create own withdrawals" ON public.withdrawals
      FOR INSERT WITH CHECK (auth.uid() = user_id);
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- Content reviews policies
DO $$
BEGIN
    CREATE POLICY "Users can view all reviews (public)" ON public.content_reviews
      FOR SELECT USING (true);
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
    CREATE POLICY "Users can create reviews" ON public.content_reviews
      FOR INSERT WITH CHECK (auth.uid() = reviewer_id);
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
    CREATE POLICY "Users can update own reviews" ON public.content_reviews
      FOR UPDATE USING (auth.uid() = reviewer_id);
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- Forum posts policies
DO $$
BEGIN
    CREATE POLICY "Users can view all posts" ON public.forum_posts
      FOR SELECT USING (true);
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
    CREATE POLICY "Authenticated users can create posts" ON public.forum_posts
      FOR INSERT WITH CHECK (auth.uid() = author_id);
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
    CREATE POLICY "Users can update own posts" ON public.forum_posts
      FOR UPDATE USING (auth.uid() = author_id);
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
    CREATE POLICY "Users can delete own posts" ON public.forum_posts
      FOR DELETE USING (auth.uid() = author_id);
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- Search analytics policies
DO $$
BEGIN
    CREATE POLICY "Users can view own search analytics" ON public.search_analytics
      FOR SELECT USING (auth.uid() = user_id);
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
    CREATE POLICY "System can insert search analytics" ON public.search_analytics
      FOR INSERT WITH CHECK (true);
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- Additional institutional policies
DO $$
BEGIN
    ALTER TABLE public.institutional_profiles ENABLE ROW LEVEL SECURITY;
EXCEPTION
    WHEN OTHERS THEN NULL;
END $$;

DO $$
BEGIN
    CREATE POLICY "Users can view institutional profiles" ON public.institutional_profiles
      FOR SELECT USING (true);
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
    CREATE POLICY "Primary uploaders can manage their institutional profile" ON public.institutional_profiles
      FOR ALL USING (auth.uid() = primary_uploader_id);
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- Team members policies
DO $$
BEGIN
    CREATE POLICY "Team members can view their team" ON public.institutional_team_members
      FOR SELECT USING (
        auth.uid() = user_id OR 
        auth.uid() IN (
          SELECT user_id FROM public.institutional_team_members itm2 
          WHERE itm2.institutional_profile_id = institutional_team_members.institutional_profile_id 
          AND itm2.role = 'admin'
        )
      );
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
    CREATE POLICY "Admins can manage team members" ON public.institutional_team_members
      FOR ALL USING (
        auth.uid() IN (
          SELECT user_id FROM public.institutional_team_members itm2 
          WHERE itm2.institutional_profile_id = institutional_team_members.institutional_profile_id 
          AND itm2.role = 'admin'
        )
      );
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- Seller profiles policies
DO $$
BEGIN
    ALTER TABLE public.seller_profiles ENABLE ROW LEVEL SECURITY;
EXCEPTION
    WHEN OTHERS THEN NULL;
END $$;

DO $$
BEGIN
    CREATE POLICY "Users can view all seller profiles" ON public.seller_profiles
      FOR SELECT USING (true);
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
    CREATE POLICY "Users can manage their own seller profile" ON public.seller_profiles
      FOR ALL USING (auth.uid() = user_id);
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- Discussion forums policies
DO $$
BEGIN
    ALTER TABLE public.discussion_forums ENABLE ROW LEVEL SECURITY;
EXCEPTION
    WHEN OTHERS THEN NULL;
END $$;

DO $$
BEGIN
    CREATE POLICY "Users can view all forums" ON public.discussion_forums
      FOR SELECT USING (true);
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
    CREATE POLICY "Authenticated users can create forums" ON public.discussion_forums
      FOR INSERT WITH CHECK (auth.uid() = created_by);
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- Content metadata policies
DO $$
BEGIN
    ALTER TABLE public.content_metadata ENABLE ROW LEVEL SECURITY;
EXCEPTION
    WHEN OTHERS THEN NULL;
END $$;

DO $$
BEGIN
    CREATE POLICY "Users can view all content metadata" ON public.content_metadata
      FOR SELECT USING (true);
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- Content quality assessments policies
DO $$
BEGIN
    CREATE POLICY "Users can view quality assessments for their own content" ON public.content_quality_assessments
      FOR SELECT USING (
        content_id IN (
          SELECT id FROM public.content_metadata 
          WHERE content_metadata.id = content_quality_assessments.content_id
        )
      );
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
    CREATE POLICY "System can insert quality assessments" ON public.content_quality_assessments
      FOR INSERT WITH CHECK (true);
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
    CREATE POLICY "System can update quality assessments" ON public.content_quality_assessments
      FOR UPDATE USING (true);
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;
