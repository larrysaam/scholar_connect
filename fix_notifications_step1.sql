-- ================================================================
-- STEP 1: Update Existing Notifications ONLY
-- Run this first to fix old notifications
-- ================================================================

UPDATE notifications
SET action_url = REPLACE(action_url, 'tab=collaborations', 'tab=co-author-invitations')
WHERE category = 'collaboration'
  AND action_url LIKE '%tab=collaborations%';

-- Verify updates
SELECT 
    COUNT(*) as updated_count,
    COUNT(CASE WHEN action_url LIKE '%tab=co-author-invitations%' THEN 1 END) as correct_url_count
FROM notifications
WHERE category = 'collaboration';
