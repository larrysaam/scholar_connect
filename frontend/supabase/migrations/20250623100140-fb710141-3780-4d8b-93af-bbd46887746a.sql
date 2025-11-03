
-- Fix critical RLS policy issues

-- 1. Fix users table RLS policies - remove overly permissive policy and add proper user-specific policies
DROP POLICY IF EXISTS "Enable read access for all users" ON public.users;

-- Create proper user-specific policies for users table
DO $$
BEGIN
    CREATE POLICY "Users can view own profile" ON public.users
      FOR SELECT USING (auth.uid() = id);
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
    CREATE POLICY "Users can update own profile" ON public.users
      FOR UPDATE USING (auth.uid() = id);
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
    CREATE POLICY "Admins can view all users" ON public.users
      FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- 2. Ensure content_metadata has proper authentication requirements
DO $$
BEGIN
    ALTER TABLE public.content_metadata ENABLE ROW LEVEL SECURITY;
EXCEPTION
    WHEN OTHERS THEN NULL;
END $$;

-- Add missing policies for content_metadata
DO $$
BEGIN
    CREATE POLICY "Authenticated users can view public content" ON public.content_metadata
      FOR SELECT USING (auth.role() = 'authenticated');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
    CREATE POLICY "Content owners can manage their content" ON public.content_metadata
      FOR ALL USING (auth.uid()::text = author_name);
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- 3. Add audit logging trigger for sensitive operations
CREATE OR REPLACE FUNCTION public.audit_trigger()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    INSERT INTO public.audit_logs (
        user_id,
        action,
        table_name,
        record_id,
        old_values,
        new_values,
        created_at
    ) VALUES (
        auth.uid(),
        TG_OP,
        TG_TABLE_NAME,
        COALESCE(NEW.id, OLD.id),
        CASE WHEN TG_OP = 'DELETE' OR TG_OP = 'UPDATE' THEN to_jsonb(OLD) ELSE NULL END,
        CASE WHEN TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN to_jsonb(NEW) ELSE NULL END,
        now()
    );
    
    RETURN COALESCE(NEW, OLD);
END;
$$;

-- Add audit triggers to sensitive tables
DO $$
BEGIN
    DROP TRIGGER IF EXISTS audit_users_trigger ON public.users;
    CREATE TRIGGER audit_users_trigger
        AFTER INSERT OR UPDATE OR DELETE ON public.users
        FOR EACH ROW EXECUTE FUNCTION public.audit_trigger();
EXCEPTION
    WHEN OTHERS THEN NULL;
END $$;

DO $$
BEGIN
    DROP TRIGGER IF EXISTS audit_payments_trigger ON public.payments;
    CREATE TRIGGER audit_payments_trigger
        AFTER INSERT OR UPDATE OR DELETE ON public.payments
        FOR EACH ROW EXECUTE FUNCTION public.audit_trigger();
EXCEPTION
    WHEN OTHERS THEN NULL;
END $$;

DO $$
BEGIN
    DROP TRIGGER IF EXISTS audit_withdrawals_trigger ON public.withdrawals;
    CREATE TRIGGER audit_withdrawals_trigger
        AFTER INSERT OR UPDATE OR DELETE ON public.withdrawals
        FOR EACH ROW EXECUTE FUNCTION public.audit_trigger();
EXCEPTION
    WHEN OTHERS THEN NULL;
END $$;

-- 4. Create a function to validate file uploads
CREATE OR REPLACE FUNCTION public.validate_file_upload(
    file_name TEXT,
    file_size BIGINT,
    content_type TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    max_size CONSTANT BIGINT := 10 * 1024 * 1024; -- 10MB
    allowed_types TEXT[] := ARRAY['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'text/plain', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
BEGIN
    -- Check file size
    IF file_size > max_size THEN
        RAISE EXCEPTION 'File size exceeds maximum allowed size of 10MB';
    END IF;
    
    -- Check content type
    IF NOT (content_type = ANY(allowed_types)) THEN
        RAISE EXCEPTION 'File type not allowed. Allowed types: %', array_to_string(allowed_types, ', ');
    END IF;
    
    -- Check filename for malicious patterns
    IF file_name ~* '\.(exe|bat|cmd|scr|pif|com)$' THEN
        RAISE EXCEPTION 'Executable files are not allowed';
    END IF;
    
    RETURN TRUE;
END;
$$;

-- 5. Create session management function for timeout
CREATE OR REPLACE FUNCTION public.is_session_valid(session_created_at TIMESTAMP WITH TIME ZONE)
RETURNS BOOLEAN
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
    session_timeout INTERVAL := '24 hours';
BEGIN
    RETURN session_created_at + session_timeout > now();
END;
$$;
