-- ========================================
-- FIX: Account Deletion Trigger Error
-- ========================================
-- Error: "tuple to be deleted was already modified by an operation triggered by the current command"
-- Solution: Change from BEFORE trigger to AFTER trigger
-- ========================================

-- Drop the old BEFORE trigger if it exists
DROP TRIGGER IF EXISTS trigger_delete_auth_user ON public.users;

-- Recreate the function (no changes needed, but good to ensure it's there)
CREATE OR REPLACE FUNCTION delete_auth_user_on_public_user_delete()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Delete the auth user after the public.users record is deleted
  DELETE FROM auth.users WHERE id = OLD.id;
  RETURN OLD;
END;
$$;

-- Create AFTER trigger instead of BEFORE trigger
-- This prevents the "tuple already modified" error
CREATE TRIGGER trigger_delete_auth_user
  AFTER DELETE ON public.users  -- Changed from BEFORE to AFTER
  FOR EACH ROW
  EXECUTE FUNCTION delete_auth_user_on_public_user_delete();

-- Add comment
COMMENT ON FUNCTION delete_auth_user_on_public_user_delete IS 'Automatically deletes auth.users record when public.users record is deleted (AFTER trigger to avoid conflicts)';

-- Verify the trigger was created correctly
SELECT 
    trigger_name,
    event_manipulation,
    event_object_table,
    action_timing,
    action_statement
FROM information_schema.triggers 
WHERE trigger_name = 'trigger_delete_auth_user';

-- Expected output:
-- trigger_name: trigger_delete_auth_user
-- event_manipulation: DELETE
-- event_object_table: users
-- action_timing: AFTER  (this should be AFTER, not BEFORE)
-- action_statement: EXECUTE FUNCTION delete_auth_user_on_public_user_delete()
