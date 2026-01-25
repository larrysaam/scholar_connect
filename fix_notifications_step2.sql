-- ================================================================
-- STEP 2: Fix the Trigger Function
-- Run this after Step 1 completes successfully
-- ================================================================

CREATE OR REPLACE FUNCTION notify_coauthor_invitation_email()
RETURNS TRIGGER 
LANGUAGE plpgsql
AS $$
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
$$;

-- Verify the function was updated
SELECT 
    proname as function_name,
    prosrc as function_source
FROM pg_proc 
WHERE proname = 'notify_coauthor_invitation_email';
