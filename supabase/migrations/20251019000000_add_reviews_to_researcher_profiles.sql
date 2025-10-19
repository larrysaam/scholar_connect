-- Add reviews and total_reviews columns to researcher_profiles table
ALTER TABLE public.researcher_profiles 
ADD COLUMN reviews jsonb DEFAULT '[]'::jsonb,
ADD COLUMN total_reviews integer DEFAULT 0;
