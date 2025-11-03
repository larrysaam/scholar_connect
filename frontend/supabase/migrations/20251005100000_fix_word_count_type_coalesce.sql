-- Fix type mismatch in projects table content and word_count handling

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS update_word_count_trigger ON projects;
DROP FUNCTION IF EXISTS calculate_word_count;
DROP FUNCTION IF EXISTS update_word_count;

-- Create function to safely calculate word count from jsonb content
CREATE OR REPLACE FUNCTION calculate_word_count(doc jsonb)
RETURNS integer
LANGUAGE plpgsql
AS $$
DECLARE
    combined_text text;
BEGIN
    -- Safely extract text fields from jsonb, ensuring we handle nulls
    combined_text := 
        COALESCE(doc->>'title', '') || ' ' ||
        COALESCE(doc->>'abstract', '') || ' ' ||
        COALESCE(doc->>'content', '') || ' ' ||
        COALESCE(doc->>'references', '');
    
    -- Return word count by splitting on whitespace
    RETURN array_length(
        regexp_split_to_array(
            trim(regexp_replace(combined_text, '\s+', ' ', 'g')),
            '\s+'
        ),
        1
    );
EXCEPTION
    WHEN OTHERS THEN
        -- Return 0 if any error occurs
        RETURN 0;
END;
$$;

-- Create trigger function to update word_count
CREATE OR REPLACE FUNCTION update_word_count()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
    -- Ensure content is valid jsonb
    NEW.content := COALESCE(NEW.content, '{}'::jsonb);
    
    -- Calculate and set word_count
    NEW.word_count := calculate_word_count(NEW.content);
    
    RETURN NEW;
END;
$$;

-- Create the trigger
CREATE TRIGGER update_word_count_trigger
    BEFORE INSERT OR UPDATE ON projects
    FOR EACH ROW
    EXECUTE FUNCTION update_word_count();

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION calculate_word_count(jsonb) TO authenticated;
GRANT EXECUTE ON FUNCTION update_word_count() TO authenticated;
