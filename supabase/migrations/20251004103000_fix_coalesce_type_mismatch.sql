-- Fix type mismatch in COALESCE operations for projects table
BEGIN;

-- Drop existing triggers and functions first
DROP TRIGGER IF EXISTS update_word_count_trigger ON projects;
DROP FUNCTION IF EXISTS update_word_count() CASCADE;
DROP FUNCTION IF EXISTS calculate_word_count(jsonb) CASCADE;

-- Create a function to safely calculate word count from JSONB content
CREATE OR REPLACE FUNCTION calculate_word_count(doc jsonb)
RETURNS integer
LANGUAGE plpgsql
AS $$
DECLARE
    combined_text text;
    word_count integer DEFAULT 0;
BEGIN
    -- Safely extract text fields from jsonb, ensuring we handle nulls
    combined_text := COALESCE(doc->>'title', '') || ' ' ||
                    COALESCE(doc->>'abstract', '') || ' ' ||
                    COALESCE(doc->>'content', '') || ' ' ||
                    COALESCE(doc->>'references', '');
    
    -- Calculate word count by splitting on whitespace and filtering empty strings
    SELECT count(*)::integer INTO word_count
    FROM regexp_split_to_table(trim(combined_text), '\s+') AS words
    WHERE length(trim(words)) > 0;
    
    RETURN word_count;
END;
$$;

-- Create function to update word_count column
CREATE OR REPLACE FUNCTION update_word_count()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    -- Ensure content is valid jsonb, default to empty object if null
    NEW.content := COALESCE(NEW.content, '{}'::jsonb);
    
    -- Calculate and set word_count
    NEW.word_count := COALESCE(calculate_word_count(NEW.content), 0);
    
    RETURN NEW;
END;
$$;

-- Create trigger to update word_count on insert or update
CREATE TRIGGER update_word_count_trigger
    BEFORE INSERT OR UPDATE ON projects
    FOR EACH ROW
    EXECUTE FUNCTION update_word_count();

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION calculate_word_count(jsonb) TO authenticated;
GRANT EXECUTE ON FUNCTION update_word_count() TO authenticated;

-- Update existing records to fix any potential type mismatches
UPDATE projects
SET word_count = calculate_word_count(COALESCE(content, '{}'::jsonb))
WHERE word_count IS NULL OR word_count::text ~ '[^0-9]';

COMMIT;
