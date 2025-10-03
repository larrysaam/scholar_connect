-- Create missing tables for ProjectWorkspace functionality

-- Create project_tasks table for task management
CREATE TABLE IF NOT EXISTS public.project_tasks (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    title text NOT NULL,
    description text,
    assignee uuid REFERENCES public.users(id) ON DELETE SET NULL,
    status text NOT NULL DEFAULT 'todo' CHECK (status IN ('todo', 'in-progress', 'completed', 'overdue')),
    priority text NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
    due_date timestamptz,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    created_by uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE
);

-- Create project_comments table for comments system
CREATE TABLE IF NOT EXISTS public.project_comments (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    content text NOT NULL,
    section text DEFAULT 'general' CHECK (section IN ('general', 'introduction', 'methodology', 'results', 'conclusion')),
    parent_id uuid REFERENCES public.project_comments(id) ON DELETE CASCADE,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

-- Create project_versions table for version history
CREATE TABLE IF NOT EXISTS public.project_versions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    version_number integer NOT NULL,
    title text NOT NULL,
    content jsonb NOT NULL,
    changes_summary text,
    created_by uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    created_at timestamptz NOT NULL DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_project_tasks_project_id ON public.project_tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_project_tasks_assignee ON public.project_tasks(assignee);
CREATE INDEX IF NOT EXISTS idx_project_tasks_status ON public.project_tasks(status);
CREATE INDEX IF NOT EXISTS idx_project_tasks_priority ON public.project_tasks(priority);
CREATE INDEX IF NOT EXISTS idx_project_tasks_due_date ON public.project_tasks(due_date);

CREATE INDEX IF NOT EXISTS idx_project_comments_project_id ON public.project_comments(project_id);
CREATE INDEX IF NOT EXISTS idx_project_comments_user_id ON public.project_comments(user_id);
CREATE INDEX IF NOT EXISTS idx_project_comments_parent_id ON public.project_comments(parent_id);
CREATE INDEX IF NOT EXISTS idx_project_comments_section ON public.project_comments(section);

CREATE INDEX IF NOT EXISTS idx_project_versions_project_id ON public.project_versions(project_id);
CREATE INDEX IF NOT EXISTS idx_project_versions_created_by ON public.project_versions(created_by);

-- Enable Row Level Security
ALTER TABLE public.project_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_versions ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check project membership safely
CREATE OR REPLACE FUNCTION public.user_is_project_member(project_uuid UUID, user_uuid UUID)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.projects 
        WHERE id = project_uuid AND owner_id = user_uuid
    ) OR EXISTS (
        SELECT 1 FROM public.coauthor_memberships 
        WHERE project_id = project_uuid AND user_id = user_uuid
    );
$$;

-- RLS Policies for project_tasks
CREATE POLICY "Project members can view tasks" ON public.project_tasks
    FOR SELECT USING (
        public.user_is_project_member(project_id, auth.uid())
    );

CREATE POLICY "Project members can create tasks" ON public.project_tasks
    FOR INSERT WITH CHECK (
        public.user_is_project_member(project_id, auth.uid()) AND
        auth.uid() = created_by
    );

CREATE POLICY "Project members can update tasks" ON public.project_tasks
    FOR UPDATE USING (
        public.user_is_project_member(project_id, auth.uid())
    );

CREATE POLICY "Project members can delete tasks" ON public.project_tasks
    FOR DELETE USING (
        public.user_is_project_member(project_id, auth.uid())
    );

-- RLS Policies for project_comments
CREATE POLICY "Project members can view comments" ON public.project_comments
    FOR SELECT USING (
        public.user_is_project_member(project_id, auth.uid())
    );

CREATE POLICY "Project members can create comments" ON public.project_comments
    FOR INSERT WITH CHECK (
        public.user_is_project_member(project_id, auth.uid()) AND
        auth.uid() = user_id
    );

CREATE POLICY "Comment authors can update their comments" ON public.project_comments
    FOR UPDATE USING (
        auth.uid() = user_id AND
        public.user_is_project_member(project_id, auth.uid())
    );

CREATE POLICY "Comment authors can delete their comments" ON public.project_comments
    FOR DELETE USING (
        auth.uid() = user_id AND
        public.user_is_project_member(project_id, auth.uid())
    );

-- RLS Policies for project_versions
CREATE POLICY "Project members can view versions" ON public.project_versions
    FOR SELECT USING (
        public.user_is_project_member(project_id, auth.uid())
    );

CREATE POLICY "Project members can create versions" ON public.project_versions
    FOR INSERT WITH CHECK (
        public.user_is_project_member(project_id, auth.uid()) AND
        auth.uid() = created_by
    );

-- Grant necessary permissions
GRANT ALL ON public.project_tasks TO authenticated;
GRANT ALL ON public.project_comments TO authenticated;
GRANT ALL ON public.project_versions TO authenticated;
GRANT EXECUTE ON FUNCTION public.user_is_project_member(UUID, UUID) TO authenticated;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_project_tasks_updated_at
    BEFORE UPDATE ON public.project_tasks
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_project_comments_updated_at
    BEFORE UPDATE ON public.project_comments
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
