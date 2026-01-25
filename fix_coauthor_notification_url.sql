-- ================================================================
-- Fix Co-author Invitation Notification Action URL
-- Update the trigger to use the correct tab name 'co-author-invitations'
-- Execute this in Supabase SQL Editor
-- ================================================================

-- PART 1: Update existing notifications with wrong URL
-- ================================================================

-- Update existing notifications to use correct tab name
UPDATE notifications
SET action_url = REPLACE(action_url, 'tab=collaborations', 'tab=co-author-invitations')
WHERE category = 'collaboration'
  AND action_url LIKE '%tab=collaborations%';

-- Verify the updates
SELECT 
    id,
    title,
    category,
    action_url,
    created_at
FROM notifications
WHERE category = 'collaboration'
ORDER BY created_at DESC
LIMIT 10;


-- PART 2: Fix the trigger function
-- ================================================================

-- Drop and recreate the function with the correct URL
CREATE OR REPLACE FUNCTION notify_coauthor_invitation_email()
RETURNS TRIGGER AS $$
DECLARE
    user_email_record RECORD;
    template_data JSONB;
    project_title TEXT;
    project_description TEXT;
    inviter_name TEXT;
BEGIN
    -- Get user email and preferences
    SELECT * INTO user_email_record
    FROM get_user_email_with_preferences(NEW.invitee_id);
    
    -- Skip if user has email notifications disabled
    IF NOT user_email_record.email_notifications_enabled THEN
        RETURN NEW;
    END IF;
    
    -- Get project and inviter details
    SELECT p.title, p.description, u.name
    INTO project_title, project_description, inviter_name
    FROM projects p
    JOIN users u ON u.id = p.owner_id
    WHERE p.id = NEW.project_id;
    
    -- Prepare template data with CORRECT tab name
    template_data := jsonb_build_object(
        'projectTitle', COALESCE(project_title, 'Research Project'),
        'projectDescription', COALESCE(project_description, 'No description provided'),
        'inviterName', COALESCE(inviter_name, 'Project owner'),
        'role', 'Collaborator',
        'acceptUrl', current_setting('app.frontend_url', true) || '/dashboard?tab=co-author-invitations&invitation=' || NEW.id,
        'dashboardUrl', current_setting('app.frontend_url', true) || '/dashboard?tab=co-author-invitations'
    );
    
    -- Send email notification
    PERFORM send_email_notification(
        NEW.invitee_id,
        user_email_record.email,
        'coauthor_invitation',
        template_data,
        'collaboration'
    );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- PART 3: Verification
-- ================================================================

-- Verify the function was updated
SELECT 
    proname as function_name,
    pg_get_functiondef(oid) as function_definition
FROM pg_proc 
WHERE proname = 'notify_coauthor_invitation_email';

-- Check updated notifications
SELECT 
    COUNT(*) as total_collaboration_notifications,
    COUNT(CASE WHEN action_url LIKE '%tab=co-author-invitations%' THEN 1 END) as correct_url_count,
    COUNT(CASE WHEN action_url LIKE '%tab=collaborations%' THEN 1 END) as wrong_url_count
FROM notifications
WHERE category = 'collaboration';

-- View sample of recent notifications
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
LIMIT 5;

-- ================================================================
-- SUMMARY
-- ================================================================
-- This script performs the following:
-- 1. Updates all existing collaboration notifications to use 'co-author-invitations' tab
-- 2. Fixes the trigger function to generate correct URLs for new invitations
-- 3. Provides verification queries to confirm the changes
-- 
-- Expected Results:
-- - All collaboration notifications should now point to '/dashboard?tab=co-author-invitations'
-- - New invitations will automatically use the correct URL
-- ================================================================
