-- Create a function to delete auth.users when public.users is deleted
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

-- Drop the old BEFORE trigger if it exists
DROP TRIGGER IF EXISTS trigger_delete_auth_user ON public.users;

-- Create AFTER trigger on public.users table (changed from BEFORE to AFTER)
CREATE TRIGGER trigger_delete_auth_user
  AFTER DELETE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION delete_auth_user_on_public_user_delete();

-- Add comment
COMMENT ON FUNCTION delete_auth_user_on_public_user_delete IS 'Automatically deletes auth.users record when public.users record is deleted';
