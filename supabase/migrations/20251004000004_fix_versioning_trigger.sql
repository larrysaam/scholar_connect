-- Fix the automatic versioning trigger to resolve COALESCE type mismatch

-- Drop and recreate the function with fixed types
DROP FUNCTION IF EXISTS public.create_automatic_version() CASCADE;

CREATE OR REPLACE FUNCTION public.create_automatic_version()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    changes_summary text;
    version_number integer;
    content_changed boolean := false;
BEGIN
    -- Only create version if content actually changed
    IF TG_OP = 'UPDATE' THEN
        -- Check if content field changed
        IF OLD.content IS DISTINCT FROM NEW.content THEN
            content_changed := true;
            
            -- Create a simple changes summary
            changes_summary := 'Auto-save: Document updated';
            
            -- Add specific change details
            IF (OLD.content->>'title') IS DISTINCT FROM (NEW.content->>'title') THEN
                changes_summary := changes_summary || ', Title changed';
            END IF;
            
            IF (OLD.content->>'abstract') IS DISTINCT FROM (NEW.content->>'abstract') THEN
                changes_summary := changes_summary || ', Abstract modified';
            END IF;
            
            IF (OLD.content->>'content') IS DISTINCT FROM (NEW.content->>'content') THEN
                changes_summary := changes_summary || ', Content updated';
            END IF;
            
            IF (OLD.content->>'references') IS DISTINCT FROM (NEW.content->>'references') THEN
                changes_summary := changes_summary || ', References updated';
            END IF;
        END IF;
    END IF;

    -- Only create version if content changed and there's a meaningful difference
    IF content_changed THEN
        -- Get the next version number
        SELECT COALESCE(MAX(pv.version_number), 0) + 1 INTO version_number
        FROM public.project_versions pv
        WHERE pv.project_id = NEW.id;

        -- Create the version record
        INSERT INTO public.project_versions (
            project_id,
            version_number,
            title,
            content,
            changes_summary,
            created_by
        ) VALUES (
            NEW.id,
            version_number,
            COALESCE(NEW.content->>'title', NEW.title, 'Untitled Document'),
            NEW.content,
            changes_summary,
            NEW.owner_id
        );
    END IF;

    RETURN NEW;
END;
$$;

-- Recreate the trigger
DROP TRIGGER IF EXISTS trigger_create_automatic_version ON public.projects;
CREATE TRIGGER trigger_create_automatic_version
    AFTER UPDATE ON public.projects
    FOR EACH ROW
    WHEN (OLD.content IS DISTINCT FROM NEW.content)
    EXECUTE FUNCTION public.create_automatic_version();
