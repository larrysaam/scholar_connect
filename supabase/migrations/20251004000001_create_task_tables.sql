-- Create project team members table
CREATE TABLE IF NOT EXISTS public.project_team_members (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    role text NOT NULL DEFAULT 'member' CHECK (role IN ('member', 'leader', 'admin')),
    joined_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE (project_id, user_id)
);

-- Create tasks table for project tasks and research aid tasks
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

-- Create table for task comments
CREATE TABLE IF NOT EXISTS public.project_task_comments (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id uuid NOT NULL REFERENCES public.project_tasks(id) ON DELETE CASCADE,
    user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    content text NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

-- Create table for task attachments
CREATE TABLE IF NOT EXISTS public.project_task_attachments (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id uuid NOT NULL REFERENCES public.project_tasks(id) ON DELETE CASCADE,
    file_name text NOT NULL,
    file_size bigint NOT NULL,
    file_type text NOT NULL,
    file_url text NOT NULL,
    uploaded_by uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    created_at timestamptz NOT NULL DEFAULT now()
);

-- Create email notifications table
CREATE TABLE IF NOT EXISTS public.email_notifications (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    recipient_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    subject text NOT NULL,
    content text NOT NULL,
    status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
    created_at timestamptz NOT NULL DEFAULT now(),
    sent_at timestamptz
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_project_team_members_project ON public.project_team_members(project_id);
CREATE INDEX IF NOT EXISTS idx_project_team_members_user ON public.project_team_members(user_id);
CREATE INDEX IF NOT EXISTS idx_project_tasks_project_id ON public.project_tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_project_tasks_assignee ON public.project_tasks(assignee);
CREATE INDEX IF NOT EXISTS idx_project_tasks_status ON public.project_tasks(status);
CREATE INDEX IF NOT EXISTS idx_task_comments_task_id ON public.project_task_comments(task_id);
CREATE INDEX IF NOT EXISTS idx_task_attachments_task_id ON public.project_task_attachments(task_id);
CREATE INDEX IF NOT EXISTS idx_email_notifications_recipient ON public.email_notifications(recipient_id);

-- Create trigger function for task assignment notifications
CREATE OR REPLACE FUNCTION notify_task_assignment()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.assignee IS NOT NULL THEN
        INSERT INTO public.email_notifications (recipient_id, subject, content)
        VALUES (
            NEW.assignee,
            'New Task Assignment',
            format('You have been assigned a new task: %s. Due date: %s', NEW.title, COALESCE(to_char(NEW.due_date, 'YYYY-MM-DD'), 'No due date'))
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for task assignment notifications
CREATE TRIGGER task_assignment_notification
AFTER INSERT OR UPDATE OF assignee ON public.project_tasks
FOR EACH ROW
WHEN (NEW.assignee IS NOT NULL)
EXECUTE FUNCTION notify_task_assignment();

-- Create function to update task timestamps
CREATE OR REPLACE FUNCTION update_updated_at_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to automatically update timestamps
CREATE TRIGGER update_project_task_timestamp
    BEFORE UPDATE ON public.project_tasks
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_timestamp();

CREATE TRIGGER update_task_comment_timestamp
    BEFORE UPDATE ON public.project_task_comments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_timestamp();
