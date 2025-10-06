-- Fix type mismatch in projects table content and word_count handling

-- First create a function to safely calculate word count from content
CREATE OR REPLACE FUNCTION calculate_word_count(doc jsonb)
RETURNS integer
LANGUAGE plpgsql
AS $$
DECLARE
    combined_text text;
    word_count integer;
BEGIN
    -- Combine all relevant text fields
    combined_text := COALESCE(doc->>'title', '') || ' ' ||
                    COALESCE(doc->>'abstract', '') || ' ' ||
                    COALESCE(doc->>'content', '') || ' ' ||
                    COALESCE(doc->>'references', '');
    
    -- Calculate word count by splitting on whitespace
    SELECT count(*) INTO word_count
    FROM regexp_split_to_table(combined_text, '\s+')
    WHERE length(trim(regexp_split_to_table)) > 0;
    
    RETURN COALESCE(word_count, 0);
END;
$$;

-- Create a trigger to automatically update word_count on content changes
CREATE OR REPLACE FUNCTION update_word_count()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    -- Always calculate word_count for new or updated content
    -- This ensures word_count is set even for new records
    NEW.word_count := calculate_word_count(COALESCE(NEW.content, '{}'::jsonb));
    RETURN NEW;
END;
$$;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS update_word_count_trigger ON public.projects;

-- Create the trigger for both INSERT and UPDATE
CREATE TRIGGER update_word_count_trigger
    BEFORE INSERT OR UPDATE ON public.projects
    FOR EACH ROW
    EXECUTE FUNCTION update_word_count();

-- Add explicit type cast functions for safety
CREATE OR REPLACE FUNCTION safe_to_jsonb(text)
RETURNS jsonb
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN COALESCE(($1)::jsonb, '{}'::jsonb);
EXCEPTION
    WHEN others THEN
        RETURN '{}'::jsonb;
END;
$$;

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION calculate_word_count(jsonb) TO authenticated;
GRANT EXECUTE ON FUNCTION update_word_count() TO authenticated;
GRANT EXECUTE ON FUNCTION safe_to_jsonb(text) TO authenticated;
