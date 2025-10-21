-- Add supervision_details column to researcher_profiles table
ALTER TABLE public.researcher_profiles
ADD COLUMN supervision_details JSONB DEFAULT '[]'::jsonb;
