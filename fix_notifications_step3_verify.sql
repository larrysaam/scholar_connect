-- ================================================================
-- STEP 3: Verify Everything Works
-- Run this to confirm all changes are correct
-- ================================================================

-- Check notification URLs
SELECT 
    COUNT(*) as total_collaboration_notifications,
    COUNT(CASE WHEN action_url LIKE '%tab=co-author-invitations%' THEN 1 END) as correct_url_count,
    COUNT(CASE WHEN action_url LIKE '%tab=collaborations%' THEN 1 END) as wrong_url_count
FROM notifications
WHERE category = 'collaboration';

-- View sample of recent collaboration notifications
SELECT 
    id,
    title,
    message,
    action_url,
    action_label,
    created_at
FROM notifications
WHERE category = 'collaboration'
ORDER BY created_at DESC
LIMIT 10;

-- Check if function exists and has correct definition
SELECT 
    proname as function_name,
    CASE 
        WHEN prosrc LIKE '%tab=co-author-invitations%' THEN '✓ Correct'
        ELSE '✗ Still wrong'
    END as status
FROM pg_proc 
WHERE proname = 'notify_coauthor_invitation_email';
