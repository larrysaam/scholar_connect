-- Fix coauthor invitation trigger function to remove non-existent 'role' field reference

-- Update the trigger function to not reference NEW.role since coauthor_invitations table doesn't have that field
CREATE OR REPLACE FUNCTION notify_coauthor_invitation_email()
RETURNS TRIGGER AS $$
DECLARE
    user_email_record RECORD;
    project_title TEXT;
    project_description TEXT;
    inviter_name TEXT;
    template_data JSONB;
BEGIN
    -- Send email for new invitations
    IF TG_OP = 'INSERT' THEN
        
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
        
        -- Prepare template data (removed NEW.role reference since it doesn't exist in the table)
        template_data := jsonb_build_object(
            'projectTitle', COALESCE(project_title, 'Research Project'),
            'projectDescription', COALESCE(project_description, 'No description provided'),
            'inviterName', COALESCE(inviter_name, 'Project owner'),
            'role', 'Collaborator',
            'acceptUrl', current_setting('app.frontend_url', true) || '/dashboard?tab=collaborations&invitation=' || NEW.id,
            'dashboardUrl', current_setting('app.frontend_url', true) || '/dashboard?tab=collaborations'
        );
        
        -- Send email notification
        PERFORM send_email_notification(
            NEW.invitee_id,
            user_email_record.email,
            'coauthor_invitation',
            template_data,
            'collaboration'
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
