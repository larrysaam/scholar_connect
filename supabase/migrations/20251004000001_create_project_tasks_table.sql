-- Create project_tasks table for task management with email notifications

-- Create project_tasks table
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

-- Create email_notifications table for tracking sent emails
CREATE TABLE IF NOT EXISTS public.email_notifications (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    recipient_email text NOT NULL,
    recipient_user_id uuid REFERENCES public.users(id) ON DELETE SET NULL,
    subject text NOT NULL,
    body text NOT NULL,
    notification_type text NOT NULL CHECK (notification_type IN ('task_assigned', 'invitation_sent', 'project_update', 'comment_added')),
    related_id uuid, -- Can reference task_id, project_id, etc.
    sent_at timestamptz DEFAULT now(),
    status text DEFAULT 'sent' CHECK (status IN ('pending', 'sent', 'failed')),
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

CREATE INDEX IF NOT EXISTS idx_email_notifications_recipient ON public.email_notifications(recipient_email);
CREATE INDEX IF NOT EXISTS idx_email_notifications_type ON public.email_notifications(notification_type);
CREATE INDEX IF NOT EXISTS idx_email_notifications_status ON public.email_notifications(status);

-- Enable Row Level Security
ALTER TABLE public.project_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_notifications ENABLE ROW LEVEL SECURITY;

-- Create or replace the security definer function to check project membership safely
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

-- RLS Policies for email_notifications
CREATE POLICY "Users can view their own notifications" ON public.email_notifications
    FOR SELECT USING (
        auth.uid() = recipient_user_id
    );

CREATE POLICY "Service role can manage all notifications" ON public.email_notifications
    FOR ALL USING (
        auth.role() = 'service_role'
    );

-- Function to send task assignment email notification
CREATE OR REPLACE FUNCTION public.send_task_assignment_email()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    assignee_email text;
    assignee_name text;
    project_title text;
    creator_name text;
    email_subject text;
    email_body text;
BEGIN
    -- Only send email for new tasks with assignees
    IF TG_OP = 'INSERT' AND NEW.assignee IS NOT NULL THEN
        -- Get assignee details
        SELECT email, name INTO assignee_email, assignee_name
        FROM public.users 
        WHERE id = NEW.assignee;
        
        -- Get project title
        SELECT title INTO project_title
        FROM public.projects 
        WHERE id = NEW.project_id;
        
        -- Get creator name
        SELECT name INTO creator_name
        FROM public.users 
        WHERE id = NEW.created_by;
        
        -- Create email content
        email_subject := 'New Task Assigned: ' || NEW.title;
        email_body := 'Hello ' || COALESCE(assignee_name, 'there') || ',' || E'\n\n' ||
                     'You have been assigned a new task in the project "' || project_title || '"' || E'\n\n' ||
                     'Task: ' || NEW.title || E'\n' ||
                     CASE WHEN NEW.description IS NOT NULL THEN 'Description: ' || NEW.description || E'\n' ELSE '' END ||
                     'Priority: ' || NEW.priority || E'\n' ||
                     CASE WHEN NEW.due_date IS NOT NULL THEN 'Due Date: ' || NEW.due_date::date || E'\n' ELSE '' END ||
                     'Assigned by: ' || COALESCE(creator_name, 'Unknown') || E'\n\n' ||
                     'Please log in to your workspace to view and manage this task.' || E'\n\n' ||
                     'Best regards,' || E'\n' ||
                     'Scholar Consult Connect Team';
        
        -- Insert email notification record
        INSERT INTO public.email_notifications (
            recipient_email,
            recipient_user_id,
            subject,
            body,
            notification_type,
            related_id,
            status
        ) VALUES (
            assignee_email,
            NEW.assignee,
            email_subject,
            email_body,
            'task_assigned',
            NEW.id,
            'pending'
        );
        
        -- Note: In a real implementation, you would also trigger the actual email sending
        -- This could be done via a webhook, background job, or external service
        
    END IF;
    
    RETURN NEW;
END;
$$;

-- Create trigger for task assignment emails
DROP TRIGGER IF EXISTS trigger_send_task_assignment_email ON public.project_tasks;
CREATE TRIGGER trigger_send_task_assignment_email
    AFTER INSERT ON public.project_tasks
    FOR EACH ROW
    EXECUTE FUNCTION public.send_task_assignment_email();

-- Grant necessary permissions
GRANT ALL ON public.project_tasks TO authenticated;
GRANT ALL ON public.project_comments TO authenticated;
GRANT ALL ON public.project_versions TO authenticated;
GRANT ALL ON public.email_notifications TO authenticated;
GRANT EXECUTE ON FUNCTION public.user_is_project_member(UUID, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.send_task_assignment_email() TO authenticated;

-- Create trigger for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_project_tasks_updated_at
    BEFORE UPDATE ON public.project_tasks
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_project_comments_updated_at
    BEFORE UPDATE ON public.project_comments
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
