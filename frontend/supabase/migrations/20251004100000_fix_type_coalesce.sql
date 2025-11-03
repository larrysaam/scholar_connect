-- Fix type mismatch in content and word_count handling
DROP FUNCTION IF EXISTS update_word_count_from_content CASCADE;

-- Function to safely calculate word count from jsonb content
CREATE OR REPLACE FUNCTION calculate_word_count(doc jsonb)
RETURNS integer
LANGUAGE plpgsql
AS $$
DECLARE
    combined_text text;
    word_count integer;
BEGIN
    -- Safely extract text fields from jsonb, ensuring we handle nulls
    combined_text := COALESCE(doc->>'title', '') || ' ' ||
                    COALESCE(doc->>'abstract', '') || ' ' ||
                    COALESCE(doc->>'content', '') || ' ' ||
                    COALESCE(doc->>'references', '');
    
    -- Calculate word count by splitting on whitespace
    SELECT count(*) INTO word_count
    FROM regexp_split_to_table(trim(combined_text), '\s+')
    WHERE length(trim(regexp_split_to_table)) > 0;
    
    RETURN COALESCE(word_count, 0);
END;
$$;

-- Function to update word_count column
CREATE OR REPLACE FUNCTION update_word_count()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    -- Ensure NEW.content is valid jsonb, default to empty object if null
    NEW.content := COALESCE(NEW.content, '{}'::jsonb);
    
    -- Calculate and set word_count
    NEW.word_count := calculate_word_count(NEW.content);
    
    RETURN NEW;
END;
$$;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS word_count_update_trigger ON projects;

-- Create trigger to update word_count on insert or update
CREATE TRIGGER word_count_update_trigger
    BEFORE INSERT OR UPDATE ON projects
    FOR EACH ROW
    EXECUTE FUNCTION update_word_count();

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION calculate_word_count(jsonb) TO authenticated;
GRANT EXECUTE ON FUNCTION update_word_count() TO authenticated;
