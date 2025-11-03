-- Fix infinite recursion in projects RLS policies
-- The issue is circular reference between projects and coauthor_memberships policies

-- First, drop the problematic policies
DROP POLICY IF EXISTS "Coauthor members can access projects" ON public.projects;
DROP POLICY IF EXISTS "Coauthor members can update projects" ON public.projects;
DROP POLICY IF EXISTS "Users can view projects they are members of" ON public.projects;
DROP POLICY IF EXISTS "Project members can view project memberships" ON public.coauthor_memberships;
DROP POLICY IF EXISTS "Users can view project memberships" ON public.coauthor_memberships;

-- Simple, non-recursive policies for projects table
-- Project owners can always access their projects
CREATE POLICY "Project owners can manage their projects" ON public.projects
    FOR ALL USING (auth.uid() = owner_id);

-- Public projects are viewable by everyone (no recursion)
CREATE POLICY "Public projects are viewable" ON public.projects
    FOR SELECT USING (visibility = 'Public');

-- Simple policies for coauthor_memberships table
-- Users can view their own memberships (no recursion)
CREATE POLICY "Users can view their own memberships" ON public.coauthor_memberships
    FOR SELECT USING (user_id = auth.uid());

-- Project owners can view and manage all memberships for their projects
CREATE POLICY "Project owners can manage memberships" ON public.coauthor_memberships
    FOR ALL USING (
        project_id IN (
            SELECT id FROM public.projects WHERE owner_id = auth.uid()
        )
    );

-- Users can insert their own memberships (for accepting invitations)
CREATE POLICY "Users can create their own memberships" ON public.coauthor_memberships
    FOR INSERT WITH CHECK (user_id = auth.uid());

-- Create a security definer function to check project membership without recursion
CREATE OR REPLACE FUNCTION public.user_is_project_member(project_uuid UUID, user_uuid UUID)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.coauthor_memberships
        WHERE project_id = project_uuid
        AND user_id = user_uuid
    );
$$;

-- Now create a safe policy for project access by members using the function
CREATE POLICY "Project members can access projects" ON public.projects
    FOR SELECT USING (
        auth.uid() = owner_id OR 
        visibility = 'Public' OR
        public.user_is_project_member(id, auth.uid())
    );

CREATE POLICY "Project members can update projects" ON public.projects
    FOR UPDATE USING (
        auth.uid() = owner_id OR
        public.user_is_project_member(id, auth.uid())
    );

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION public.user_is_project_member(UUID, UUID) TO authenticated;
