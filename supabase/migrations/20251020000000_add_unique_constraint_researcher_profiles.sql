-- Add unique constraint on user_id to prevent multiple researcher profiles per user
-- First, clean up any duplicate profiles (keep the most recent one)
DELETE FROM researcher_profiles 
WHERE id NOT IN (
    SELECT DISTINCT ON (user_id) id 
    FROM researcher_profiles 
    ORDER BY user_id, created_at DESC
);

-- Add unique constraint on user_id
ALTER TABLE researcher_profiles 
ADD CONSTRAINT unique_researcher_profile_per_user 
UNIQUE (user_id);
