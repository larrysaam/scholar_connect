-- Enable RLS and create policies for coauthor_memberships table

-- Enable Row Level Security
ALTER TABLE public.coauthor_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coauthor_invitations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for coauthor_memberships
CREATE POLICY "Users can view their own memberships" ON public.coauthor_memberships
    FOR SELECT USING (
        auth.uid() = user_id
    );

CREATE POLICY "Project owners can view all memberships" ON public.coauthor_memberships
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.projects 
            WHERE id = project_id AND owner_id = auth.uid()
        )
    );

CREATE POLICY "Project owners can manage memberships" ON public.coauthor_memberships
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.projects 
            WHERE id = project_id AND owner_id = auth.uid()
        )
    );

CREATE POLICY "Users can leave projects" ON public.coauthor_memberships
    FOR DELETE USING (
        auth.uid() = user_id
    );

-- RLS Policies for coauthor_invitations
CREATE POLICY "Users can view their own invitations" ON public.coauthor_invitations
    FOR SELECT USING (
        auth.uid() = invitee_id OR auth.uid() = inviter_id
    );

CREATE POLICY "Project owners can manage invitations" ON public.coauthor_invitations
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.projects 
            WHERE id = project_id AND owner_id = auth.uid()
        )
    );

CREATE POLICY "Invitees can respond to invitations" ON public.coauthor_invitations
    FOR UPDATE USING (
        auth.uid() = invitee_id
    );

-- Grant necessary permissions
GRANT ALL ON public.coauthor_memberships TO authenticated;
GRANT ALL ON public.coauthor_invitations TO authenticated;
