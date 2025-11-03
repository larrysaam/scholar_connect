CREATE OR REPLACE FUNCTION create_notification(
    p_user_id UUID,
    p_title TEXT,
    p_message TEXT,
    p_type TEXT DEFAULT 'info',
    p_category TEXT DEFAULT 'system',
    p_action_url TEXT DEFAULT NULL,
    p_action_label TEXT DEFAULT NULL,
    p_metadata JSONB DEFAULT '{}',
    p_expires_at TIMESTAMP WITH TIME ZONE DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    notification_id UUID;
BEGIN
    SET ROLE TO 'service_role';
    INSERT INTO public.notifications (
        user_id, title, message, type, category,
        action_url, action_label, metadata, expires_at
    )
    VALUES (
        p_user_id, p_title, p_message, p_type, p_category,
        p_action_url, p_action_label, p_metadata, p_expires_at
    )
    RETURNING id INTO notification_id;
    RESET ROLE;
    RETURN notification_id;
END;
$$ LANGUAGE plpgsql;