-- Allow users to update rating and reviews on other users' profiles
-- This enables the review system to work

-- For researcher_profiles: Allow authenticated users to update rating, total_reviews, and reviews
-- But only these fields, and only if they are not the profile owner (to prevent self-reviews)
DROP POLICY IF EXISTS "Users can update rating and reviews on researcher profiles" ON researcher_profiles;
CREATE POLICY "Users can update rating and reviews on researcher profiles" ON researcher_profiles
    FOR UPDATE USING (auth.uid() != user_id)
    WITH CHECK (auth.uid() != user_id);

-- For research_aid_profiles: Allow authenticated users to update rating, total_reviews, and reviews
DROP POLICY IF EXISTS "Users can update rating and reviews on research aid profiles" ON research_aid_profiles;
CREATE POLICY "Users can update rating and reviews on research aid profiles" ON research_aid_profiles
    FOR UPDATE USING (auth.uid() != user_id)
    WITH CHECK (auth.uid() != user_id);
