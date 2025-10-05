-- Add availability column to researcher_profiles table
ALTER TABLE public.researcher_profiles 
ADD COLUMN IF NOT EXISTS availability JSONB DEFAULT '{
  "monday": {"enabled": true, "times": [{"start": "09:00", "end": "17:00"}]},
  "tuesday": {"enabled": true, "times": [{"start": "09:00", "end": "17:00"}]},
  "wednesday": {"enabled": true, "times": [{"start": "09:00", "end": "17:00"}]},
  "thursday": {"enabled": true, "times": [{"start": "09:00", "end": "17:00"}]},
  "friday": {"enabled": true, "times": [{"start": "09:00", "end": "17:00"}]},
  "saturday": {"enabled": false, "times": []},
  "sunday": {"enabled": false, "times": []}
}'::JSONB;

-- Add comment to explain the structure
COMMENT ON COLUMN public.researcher_profiles.availability IS 'JSON object storing weekly availability. Format: {"monday": {"enabled": true, "times": [{"start": "09:00", "end": "17:00"}]}, ...}';

-- Create index for better performance when querying availability
CREATE INDEX IF NOT EXISTS idx_researcher_profiles_availability 
ON public.researcher_profiles USING GIN (availability);
