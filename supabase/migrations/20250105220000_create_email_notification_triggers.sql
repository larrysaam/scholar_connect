-- Function to send email notifications via Edge Function
CREATE OR REPLACE FUNCTION send_email_notification(
    p_user_id UUID,
    p_email TEXT,
    p_template TEXT,
    p_template_data JSONB DEFAULT '{}'::jsonb,
    p_notification_type TEXT DEFAULT 'system'
) RETURNS BOOLEAN AS $$
DECLARE
    result BOOLEAN := FALSE;
BEGIN
    -- Call the Edge Function to send email
    PERFORM net.http_post(
        url := current_setting('app.edge_functions_url') || '/send-email-notification',
        headers := jsonb_build_object(
            'Content-Type', 'application/json',
            'Authorization', 'Bearer ' || current_setting('app.service_role_key')
        ),
        body := jsonb_build_object(
            'to', p_email,
            'template', p_template,
            'templateData', p_template_data,
            'userId', p_user_id,
            'notificationType', p_notification_type
        )
    );
    
    result := TRUE;
    RETURN result;
EXCEPTION
    WHEN OTHERS THEN
        -- Log error but don't fail the main transaction
        INSERT INTO email_logs (user_id, email, subject, notification_type, status, error_message)
        VALUES (p_user_id, p_email, 'Failed to send', p_notification_type, 'failed', SQLERRM);
        RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user email and check preferences
CREATE OR REPLACE FUNCTION get_user_email_with_preferences(p_user_id UUID)
RETURNS TABLE(email TEXT, email_notifications_enabled BOOLEAN) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        u.email,
        COALESCE(np.email_notifications, TRUE) as email_notifications_enabled
    FROM users u
    LEFT JOIN notification_preferences np ON np.user_id = u.id
    WHERE u.id = p_user_id;
END;
$$ LANGUAGE plpgsql;

-- Trigger function for consultation booking confirmations
CREATE OR REPLACE FUNCTION notify_consultation_confirmed_email()
RETURNS TRIGGER AS $$
DECLARE
    user_email_record RECORD;
    researcher_name TEXT;
    service_name TEXT;
    template_data JSONB;
BEGIN
    -- Only send email when booking is confirmed
    IF NEW.status = 'confirmed' AND (OLD.status IS NULL OR OLD.status != 'confirmed') THEN
        
        -- Get user email and preferences
        SELECT * INTO user_email_record 
        FROM get_user_email_with_preferences(NEW.client_id);
        
        -- Skip if user has email notifications disabled
        IF NOT user_email_record.email_notifications_enabled THEN
            RETURN NEW;
        END IF;
        
        -- Get researcher name
        SELECT name INTO researcher_name
        FROM users 
        WHERE id = NEW.provider_id;
        
        -- Get service name
        SELECT title INTO service_name
        FROM consultation_services 
        WHERE id = NEW.service_id;
        
        -- Prepare template data
        template_data := jsonb_build_object(
            'date', NEW.scheduled_date,
            'time', NEW.scheduled_time,
            'researcherName', COALESCE(researcher_name, 'Your researcher'),
            'serviceName', COALESCE(service_name, 'Consultation'),
            'meetingLink', NEW.meeting_link,
            'dashboardUrl', current_setting('app.frontend_url', true) || '/dashboard?tab=my-bookings'
        );
        
        -- Send email notification
        PERFORM send_email_notification(
            NEW.client_id,
            user_email_record.email,
            'consultation_confirmed',
            template_data,
            'consultation'
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for consultation confirmations
DROP TRIGGER IF EXISTS consultation_confirmed_email_trigger ON service_bookings;
CREATE TRIGGER consultation_confirmed_email_trigger
    AFTER INSERT OR UPDATE ON service_bookings
    FOR EACH ROW
    EXECUTE FUNCTION notify_consultation_confirmed_email();

-- Trigger function for payment confirmations
CREATE OR REPLACE FUNCTION notify_payment_received_email()
RETURNS TRIGGER AS $$
DECLARE
    user_email_record RECORD;
    service_name TEXT;
    template_data JSONB;
BEGIN
    -- Only send email when payment is confirmed
    IF NEW.status = 'paid' AND (OLD.status IS NULL OR OLD.status != 'paid') THEN
        
        -- Get user email and preferences
        SELECT * INTO user_email_record 
        FROM get_user_email_with_preferences(NEW.user_id);
        
        -- Skip if user has email notifications disabled
        IF NOT user_email_record.email_notifications_enabled THEN
            RETURN NEW;
        END IF;
        
        -- Get service name if it's a consultation payment
        IF NEW.type = 'consultation' THEN
            SELECT cs.title INTO service_name
            FROM service_bookings sb
            JOIN consultation_services cs ON cs.id = sb.service_id
            WHERE sb.payment_id = NEW.payment_id
            LIMIT 1;
        END IF;
        
        -- Prepare template data
        template_data := jsonb_build_object(
            'amount', NEW.amount,
            'currency', NEW.currency,
            'transactionId', NEW.payment_id,
            'date', NEW.created_at::date,
            'serviceName', COALESCE(service_name, 'Service'),
            'dashboardUrl', current_setting('app.frontend_url', true) || '/dashboard?tab=payments'
        );
        
        -- Send email notification
        PERFORM send_email_notification(
            NEW.user_id,
            user_email_record.email,
            'payment_received',
            template_data,
            'payment'
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for payment confirmations
DROP TRIGGER IF EXISTS payment_received_email_trigger ON transactions;
CREATE TRIGGER payment_received_email_trigger
    AFTER INSERT OR UPDATE ON transactions
    FOR EACH ROW
    EXECUTE FUNCTION notify_payment_received_email();

-- Trigger function for job application acceptances
CREATE OR REPLACE FUNCTION notify_job_application_accepted_email()
RETURNS TRIGGER AS $$
DECLARE
    user_email_record RECORD;
    job_title TEXT;
    client_name TEXT;
    job_budget DECIMAL;
    job_currency TEXT;
    template_data JSONB;
BEGIN
    -- Only send email when application is accepted
    IF NEW.status = 'accepted' AND (OLD.status IS NULL OR OLD.status != 'accepted') THEN
        
        -- Get user email and preferences
        SELECT * INTO user_email_record 
        FROM get_user_email_with_preferences(NEW.applicant_id);
        
        -- Skip if user has email notifications disabled
        IF NOT user_email_record.email_notifications_enabled THEN
            RETURN NEW;
        END IF;
        
        -- Get job details
        SELECT j.title, j.budget, j.currency, u.name
        INTO job_title, job_budget, job_currency, client_name
        FROM jobs j
        JOIN users u ON u.id = j.user_id
        WHERE j.id = NEW.job_id;
        
        -- Prepare template data
        template_data := jsonb_build_object(
            'jobTitle', COALESCE(job_title, 'Job'),
            'clientName', COALESCE(client_name, 'Client'),
            'budget', job_budget,
            'currency', COALESCE(job_currency, 'XAF'),
            'startDate', COALESCE(NEW.start_date, 'To be determined'),
            'dashboardUrl', current_setting('app.frontend_url', true) || '/dashboard?tab=my-jobs'
        );
        
        -- Send email notification
        PERFORM send_email_notification(
            NEW.applicant_id,
            user_email_record.email,
            'job_application_accepted',
            template_data,
            'application'
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for job application acceptances
DROP TRIGGER IF EXISTS job_application_accepted_email_trigger ON job_applications;
CREATE TRIGGER job_application_accepted_email_trigger
    AFTER INSERT OR UPDATE ON job_applications
    FOR EACH ROW
    EXECUTE FUNCTION notify_job_application_accepted_email();

-- Trigger function for coauthor invitations
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
          -- Prepare template data
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

-- Create trigger for coauthor invitations
DROP TRIGGER IF EXISTS coauthor_invitation_email_trigger ON coauthor_invitations;
CREATE TRIGGER coauthor_invitation_email_trigger
    AFTER INSERT ON coauthor_invitations
    FOR EACH ROW
    EXECUTE FUNCTION notify_coauthor_invitation_email();

-- Function to send booking reminders (to be called by cron job)
CREATE OR REPLACE FUNCTION send_booking_reminders()
RETURNS INTEGER AS $$
DECLARE
    booking_record RECORD;
    user_email_record RECORD;
    researcher_name TEXT;
    service_name TEXT;
    template_data JSONB;
    reminder_count INTEGER := 0;
BEGIN
    -- Get bookings that need reminders (24 hours before and 1 hour before)
    FOR booking_record IN
        SELECT sb.*, 
               sb.scheduled_date + sb.scheduled_time::time as scheduled_datetime
        FROM service_bookings sb
        WHERE sb.status = 'confirmed'
        AND (
            -- 24 hours before (if not already sent)
            (sb.scheduled_date + sb.scheduled_time::time - INTERVAL '24 hours' <= NOW() 
             AND sb.scheduled_date + sb.scheduled_time::time - INTERVAL '23 hours' > NOW()
             AND NOT EXISTS (
                 SELECT 1 FROM email_logs 
                 WHERE user_id = sb.client_id 
                 AND notification_type = 'booking_reminder_24h'
                 AND sent_at > NOW() - INTERVAL '25 hours'
             ))
            OR
            -- 1 hour before (if not already sent)
            (sb.scheduled_date + sb.scheduled_time::time - INTERVAL '1 hour' <= NOW() 
             AND sb.scheduled_date + sb.scheduled_time::time > NOW()
             AND NOT EXISTS (
                 SELECT 1 FROM email_logs 
                 WHERE user_id = sb.client_id 
                 AND notification_type = 'booking_reminder_1h'
                 AND sent_at > NOW() - INTERVAL '2 hours'
             ))
        )
    LOOP
        -- Get user email and preferences
        SELECT * INTO user_email_record 
        FROM get_user_email_with_preferences(booking_record.client_id);
        
        -- Skip if user has email notifications disabled
        IF NOT user_email_record.email_notifications_enabled THEN
            CONTINUE;
        END IF;
        
        -- Get researcher name
        SELECT name INTO researcher_name
        FROM users 
        WHERE id = booking_record.provider_id;
        
        -- Get service name
        SELECT title INTO service_name
        FROM consultation_services 
        WHERE id = booking_record.service_id;
        
        -- Determine time until booking
        DECLARE
            time_until TEXT;
            reminder_type TEXT;
        BEGIN
            IF booking_record.scheduled_datetime - NOW() > INTERVAL '12 hours' THEN
                time_until := 'tomorrow';
                reminder_type := 'booking_reminder_24h';
            ELSE
                time_until := '1 hour';
                reminder_type := 'booking_reminder_1h';
            END IF;
            
            -- Prepare template data
            template_data := jsonb_build_object(
                'date', booking_record.scheduled_date,
                'time', booking_record.scheduled_time,
                'timeUntil', time_until,
                'researcherName', COALESCE(researcher_name, 'Your researcher'),
                'serviceName', COALESCE(service_name, 'Consultation'),
                'meetingLink', booking_record.meeting_link,
                'dashboardUrl', current_setting('app.frontend_url', true) || '/dashboard?tab=my-bookings'
            );
            
            -- Send email notification
            PERFORM send_email_notification(
                booking_record.client_id,
                user_email_record.email,
                'booking_reminder',
                template_data,
                reminder_type
            );
            
            reminder_count := reminder_count + 1;
        END;
    END LOOP;
    
    RETURN reminder_count;
END;
$$ LANGUAGE plpgsql;

-- Create configuration for Edge Function URL (to be set by admin)
-- Run these commands in Supabase SQL editor after deployment:
/*
ALTER DATABASE postgres SET app.edge_functions_url = 'https://your-project-ref.supabase.co/functions/v1';
ALTER DATABASE postgres SET app.service_role_key = 'your-service-role-key';
ALTER DATABASE postgres SET app.frontend_url = 'https://your-frontend-domain.com';
*/
