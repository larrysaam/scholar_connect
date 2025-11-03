
-- Helper function to check if a user has a specific role
CREATE OR REPLACE FUNCTION public.has_role(user_id uuid, role_name text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM user_roles
    WHERE user_roles.user_id = has_role.user_id
      AND user_roles.role = role_name
  );
END;
$$;

-- RLS policy for admins to read all users
CREATE POLICY "Admins can view all users"
ON public.users
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- RLS policy for admins to read all researcher profiles
CREATE POLICY "Admins can view all researcher profiles"
ON public.researcher_profiles
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- RLS policy for admins to update all researcher profiles
CREATE POLICY "Admins can update all researcher profiles"
ON public.researcher_profiles
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));
