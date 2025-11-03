-- Add reviews and total_reviews columns to research_aid_profiles table
ALTER TABLE research_aid_profiles 
ADD COLUMN reviews jsonb DEFAULT '[]'::jsonb,
ADD COLUMN total_reviews integer DEFAULT 0;
