-- Debug Script for Discussion Forum Issues
-- Run this in Supabase SQL Editor to diagnose problems

-- ========================================
-- 1. Check if RLS is enabled and policies exist
-- ========================================
SELECT 
    schemaname,
    tablename,
    rowsecurity as "RLS Enabled"
FROM pg_tables 
WHERE tablename IN ('discussion_posts', 'researcher_profiles', 'users');

-- ========================================
-- 2. Check RLS policies for researcher_profiles
-- ========================================
SELECT 
    policyname,
    tablename,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE tablename = 'researcher_profiles';

-- ========================================
-- 3. Verify researcher profiles exist
-- ========================================
SELECT 
    rp.id,
    rp.user_id,
    rp.subtitle,
    rp.title,
    u.name as user_name,
    u.role as user_role,
    u.email
FROM researcher_profiles rp
JOIN users u ON u.id = rp.user_id
WHERE u.role = 'researcher'
LIMIT 10;

-- ========================================
-- 4. Check discussion posts with researcher authors
-- ========================================
SELECT 
    dp.id as post_id,
    dp.title as post_title,
    dp.category,
    u.id as author_id,
    u.name as author_name,
    u.role as author_role,
    rp.subtitle as author_subtitle,
    dp.created_at
FROM discussion_posts dp
JOIN users u ON u.id = dp.author_id
LEFT JOIN researcher_profiles rp ON rp.user_id = u.id
WHERE u.role = 'researcher'
ORDER BY dp.created_at DESC
LIMIT 10;

-- ========================================
-- 5. Test the exact query used by the application
-- ========================================
SELECT 
    dp.id,
    dp.title,
    dp.content,
    dp.category,
    dp.likes_count,
    dp.replies_count,
    dp.created_at,
    dp.updated_at,
    json_build_object(
        'id', u.id,
        'name', u.name,
        'role', u.role,
        'avatar_url', u.avatar_url,
        'researcher_profiles', COALESCE(
            (SELECT json_agg(
                json_build_object('subtitle', rp.subtitle)
            )
            FROM researcher_profiles rp
            WHERE rp.user_id = u.id),
            '[]'::json
        )
    ) as author
FROM discussion_posts dp
JOIN users u ON u.id = dp.author_id
ORDER BY dp.created_at DESC
LIMIT 5;

-- ========================================
-- 6. Check for missing foreign keys
-- ========================================
SELECT 
    dp.id as post_id,
    dp.title,
    dp.author_id,
    u.id as user_exists,
    u.name
FROM discussion_posts dp
LEFT JOIN users u ON u.id = dp.author_id
WHERE u.id IS NULL;

-- ========================================
-- 7. Count posts by role
-- ========================================
SELECT 
    u.role,
    COUNT(dp.id) as post_count,
    COUNT(rp.id) as with_profile_count
FROM discussion_posts dp
JOIN users u ON u.id = dp.author_id
LEFT JOIN researcher_profiles rp ON rp.user_id = u.id
GROUP BY u.role;

-- ========================================
-- 8. If no policies exist, create them
-- ========================================

-- Enable RLS if not already enabled
ALTER TABLE researcher_profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Anyone can view researcher profiles" ON researcher_profiles;

-- Create read policy for researcher_profiles
CREATE POLICY "Anyone can view researcher profiles"
ON researcher_profiles FOR SELECT
USING (true);

-- ========================================
-- 9. Verify the policy was created
-- ========================================
SELECT 
    policyname,
    tablename,
    cmd,
    permissive,
    roles
FROM pg_policies
WHERE tablename = 'researcher_profiles';

-- ========================================
-- 10. Test with current user's perspective
-- ========================================
-- This simulates what the authenticated user would see
SELECT 
    dp.id,
    dp.title,
    u.name as author,
    u.role,
    rp.subtitle
FROM discussion_posts dp
JOIN users u ON u.id = dp.author_id
LEFT JOIN researcher_profiles rp ON rp.user_id = u.id
WHERE dp.author_id = auth.uid() -- Change this to a specific user_id if testing
ORDER BY dp.created_at DESC
LIMIT 5;
