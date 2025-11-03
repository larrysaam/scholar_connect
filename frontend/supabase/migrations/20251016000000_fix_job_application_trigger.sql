-- Fix the job application accepted email trigger to remove start_date reference
-- since job_applications table doesn't have start_date column

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
