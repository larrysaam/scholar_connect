-- Fix COALESCE type mismatch and add safe type casting functions

-- Create function to safely calculate word count from JSONB content
CREATE OR REPLACE FUNCTION public.calculate_word_count(content jsonb)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    word_count integer := 0;
    title text;
    abstract text;
    main_content text;
    references text;
BEGIN
    -- Extract text fields from JSONB content
    title := content->>'title';
    abstract := content->>'abstract';
    main_content := content->>'content';
    references := content->>'references';
    
    -- Count words in each section (null safe)
    word_count := word_count + array_length(regexp_split_to_array(COALESCE(title, ''), '\s+'), 1);
    word_count := word_count + array_length(regexp_split_to_array(COALESCE(abstract, ''), '\s+'), 1);
    word_count := word_count + array_length(regexp_split_to_array(COALESCE(main_content, ''), '\s+'), 1);
    word_count := word_count + array_length(regexp_split_to_array(COALESCE(references, ''), '\s+'), 1);
    
    -- Handle edge case where all content is empty or null
    RETURN COALESCE(word_count, 0);
END;
$$;

-- Create trigger function to update word count on content change
CREATE OR REPLACE FUNCTION public.update_word_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Only update word count if content has changed
    IF TG_OP = 'INSERT' OR OLD.content IS DISTINCT FROM NEW.content THEN
        NEW.word_count := public.calculate_word_count(NEW.content);
    END IF;
    RETURN NEW;
END;
$$;

-- Create trigger to automatically update word count
DROP TRIGGER IF EXISTS update_project_word_count ON public.projects;
CREATE TRIGGER update_project_word_count
    BEFORE INSERT OR UPDATE ON public.projects
    FOR EACH ROW
    EXECUTE FUNCTION public.update_word_count();

-- Create a function to safely cast any value to JSONB
CREATE OR REPLACE FUNCTION public.safe_to_jsonb(input anyelement)
RETURNS jsonb
LANGUAGE plpgsql
IMMUTABLE
AS $$
BEGIN
    -- For null values, return empty JSONB object
    IF input IS NULL THEN
        RETURN '{}'::jsonb;
    END IF;
    
    -- Try to cast to JSONB, if fails return empty object
    BEGIN
        RETURN to_jsonb(input);
    EXCEPTION WHEN OTHERS THEN
        RETURN '{}'::jsonb;
    END;
END;
$$;

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION public.calculate_word_count(jsonb) TO authenticated;
GRANT EXECUTE ON FUNCTION public.safe_to_jsonb(anyelement) TO authenticated;
