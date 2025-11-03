-- Notify pgrest to reload schema cache
NOTIFY pgrst, 'reload schema';

-- Alternative approach if NOTIFY doesn't work
-- Comment this out if using NOTIFY
/*
ALTER TABLE project_versions 
  ALTER COLUMN title TYPE text; -- This is a no-op that forces schema refresh
*/
