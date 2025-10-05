`-- Add availability column to researcher_profiles table
ALTER TABLE public.researcher_profiles 
ADD COLUMN IF NOT EXISTS availability JSONB DEFAULT '{}';

-- Update the availability column with a default structure if it's empty
UPDATE public.researcher_profiles 
SET availability = '{
  "monday": {"enabled": true, "slots": ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"]},
  "tuesday": {"enabled": true, "slots": ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"]},
  "wednesday": {"enabled": true, "slots": ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"]},
  "thursday": {"enabled": true, "slots": ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"]},
  "friday": {"enabled": true, "slots": ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"]},
  "saturday": {"enabled": false, "slots": []},
  "sunday": {"enabled": false, "slots": []}
}'::jsonb
WHERE availability IS NULL OR availability = '{}'::jsonb;

-- Add comment to explain the structure
COMMENT ON COLUMN public.researcher_profiles.availability IS 'JSON object storing weekly availability schedule with days and time slots';
`