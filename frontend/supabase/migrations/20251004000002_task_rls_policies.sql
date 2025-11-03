-- Enable RLS on tables
ALTER TABLE public.project_team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_task_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_task_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_notifications ENABLE ROW LEVEL SECURITY;

-- Project Team Members Policies
CREATE POLICY "Project members and owners can view team members"
    ON public.project_team_members
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.project_team_members ptm
            WHERE ptm.project_id = project_team_members.project_id
            AND ptm.user_id = auth.uid()
        ) OR 
        EXISTS (
            SELECT 1 FROM public.projects p
            WHERE p.id = project_team_members.project_id
            AND p.owner_id = auth.uid()
        )
    );

CREATE POLICY "Project owners and admins can manage team members"
    ON public.project_team_members
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.project_team_members ptm
            WHERE ptm.project_id = project_team_members.project_id
            AND ptm.user_id = auth.uid()
            AND ptm.role = 'admin'
        ) OR 
        EXISTS (
            SELECT 1 FROM public.projects p
            WHERE p.id = project_team_members.project_id
            AND p.owner_id = auth.uid()
        )
    );

-- Project Tasks Policies
CREATE POLICY "Project members can view project tasks"
    ON public.project_tasks
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.project_team_members ptm
            WHERE ptm.project_id = project_tasks.project_id
            AND ptm.user_id = auth.uid()
        ) OR 
        EXISTS (
            SELECT 1 FROM public.projects p
            WHERE p.id = project_tasks.project_id
            AND p.owner_id = auth.uid()
        )
    );

CREATE POLICY "Project owners and team leaders can create tasks"
    ON public.project_tasks
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.project_team_members ptm
            WHERE ptm.project_id = project_tasks.project_id
            AND ptm.user_id = auth.uid()
            AND ptm.role IN ('leader', 'admin')
        ) OR 
        EXISTS (
            SELECT 1 FROM public.projects p
            WHERE p.id = project_tasks.project_id
            AND p.owner_id = auth.uid()
        )
    );

CREATE POLICY "Project owners and assignees can update tasks"
    ON public.project_tasks
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.project_team_members ptm
            WHERE ptm.project_id = project_tasks.project_id
            AND ptm.user_id = auth.uid()
            AND ptm.role IN ('leader', 'admin')
        ) OR 
        EXISTS (
            SELECT 1 FROM public.projects p
            WHERE p.id = project_tasks.project_id
            AND p.owner_id = auth.uid()
        ) OR
        assignee = auth.uid()
    );

CREATE POLICY "Project owners can delete tasks"
    ON public.project_tasks
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.projects p
            WHERE p.id = project_tasks.project_id
            AND p.owner_id = auth.uid()
        )
    );

-- Task Comments Policies
CREATE POLICY "Project members can view task comments"
    ON public.project_task_comments
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.project_tasks pt
            JOIN public.project_team_members ptm ON pt.project_id = ptm.project_id
            WHERE pt.id = project_task_comments.task_id
            AND ptm.user_id = auth.uid()
        )
    );

CREATE POLICY "Project members can add comments"
    ON public.project_task_comments
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.project_tasks pt
            JOIN public.project_team_members ptm ON pt.project_id = ptm.project_id
            WHERE pt.id = project_task_comments.task_id
            AND ptm.user_id = auth.uid()
        ) AND
        auth.uid() = user_id
    );

CREATE POLICY "Users can edit their own comments"
    ON public.project_task_comments
    FOR UPDATE
    USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own comments"
    ON public.project_task_comments
    FOR DELETE
    USING (user_id = auth.uid());

-- Task Attachments Policies
CREATE POLICY "Project members can view task attachments"
    ON public.project_task_attachments
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.project_tasks pt
            JOIN public.project_team_members ptm ON pt.project_id = ptm.project_id
            WHERE pt.id = project_task_attachments.task_id
            AND ptm.user_id = auth.uid()
        )
    );

CREATE POLICY "Project members can add attachments"
    ON public.project_task_attachments
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.project_tasks pt
            JOIN public.project_team_members ptm ON pt.project_id = ptm.project_id
            WHERE pt.id = project_task_attachments.task_id
            AND ptm.user_id = auth.uid()
        ) AND
        auth.uid() = uploaded_by
    );

CREATE POLICY "Users can delete their own attachments"
    ON public.project_task_attachments
    FOR DELETE
    USING (uploaded_by = auth.uid());

-- Email Notifications Policies
CREATE POLICY "Users can only view their own notifications"
    ON public.email_notifications
    FOR SELECT
    USING (recipient_id = auth.uid());

CREATE POLICY "System can create email notifications"
    ON public.email_notifications
    FOR INSERT
    WITH CHECK (true);

CREATE POLICY "System can update email notifications"
    ON public.email_notifications
    FOR UPDATE
    USING (true);
