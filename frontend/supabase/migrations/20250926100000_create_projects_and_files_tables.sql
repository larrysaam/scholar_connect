-- Create projects and project_files tables for coauthor collaboration

-- Create projects table
CREATE TABLE IF NOT EXISTS public.projects (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title text NOT NULL,
    description text,
    type text DEFAULT 'Journal Article' CHECK (type IN ('Journal Article', 'Conference Paper', 'Book Chapter', 'Thesis', 'Research Proposal', 'Grant Application', 'Other')),
    visibility text DEFAULT 'Private' CHECK (visibility IN ('Private', 'Public', 'Institution')),
    status text DEFAULT 'In Progress' CHECK (status IN ('Draft', 'In Progress', 'Review', 'Completed', 'Archived')),
    owner_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    
    -- Document content (stored as JSON for flexibility)
    content jsonb DEFAULT '{}'::jsonb,
    
    -- Metadata
    tags text[] DEFAULT '{}',
    word_count integer DEFAULT 0,
    page_count integer DEFAULT 0
);

-- Create project_files table for file management
CREATE TABLE IF NOT EXISTS public.project_files (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    name text NOT NULL,
    original_name text NOT NULL,
    file_path text NOT NULL, -- Path in Supabase storage
    file_url text, -- Public URL if needed
    file_size bigint NOT NULL,
    mime_type text NOT NULL,
    uploaded_by uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    
    -- File metadata
    description text,
    category text DEFAULT 'general' CHECK (category IN ('general', 'research', 'data', 'images', 'documents', 'references')),
    is_public boolean DEFAULT false,
    
    -- Download tracking
    download_count integer DEFAULT 0
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_projects_owner_id ON public.projects(owner_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON public.projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_visibility ON public.projects(visibility);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON public.projects(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_project_files_project_id ON public.project_files(project_id);
CREATE INDEX IF NOT EXISTS idx_project_files_uploaded_by ON public.project_files(uploaded_by);
CREATE INDEX IF NOT EXISTS idx_project_files_category ON public.project_files(category);
CREATE INDEX IF NOT EXISTS idx_project_files_created_at ON public.project_files(created_at DESC);

-- Enable Row Level Security
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_files ENABLE ROW LEVEL SECURITY;

-- RLS Policies for projects table

-- Project owners can manage their projects
CREATE POLICY "Project owners can manage their projects" ON public.projects
    FOR ALL USING (auth.uid() = owner_id);

-- Coauthor members can view and edit projects they're part of
CREATE POLICY "Coauthor members can access projects" ON public.projects
    FOR SELECT USING (
        auth.uid() = owner_id OR 
        id IN (
            SELECT project_id FROM public.coauthor_memberships 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Coauthor members can update projects" ON public.projects
    FOR UPDATE USING (
        auth.uid() = owner_id OR 
        id IN (
            SELECT project_id FROM public.coauthor_memberships 
            WHERE user_id = auth.uid()
        )
    );

-- Public projects are viewable by everyone
CREATE POLICY "Public projects are viewable" ON public.projects
    FOR SELECT USING (visibility = 'Public');

-- RLS Policies for project_files table

-- Project members can manage files
CREATE POLICY "Project members can view files" ON public.project_files
    FOR SELECT USING (
        project_id IN (
            SELECT id FROM public.projects 
            WHERE owner_id = auth.uid() 
            OR id IN (
                SELECT project_id FROM public.coauthor_memberships 
                WHERE user_id = auth.uid()
            )
        )
    );

CREATE POLICY "Project members can upload files" ON public.project_files
    FOR INSERT WITH CHECK (
        auth.uid() = uploaded_by AND
        project_id IN (
            SELECT id FROM public.projects 
            WHERE owner_id = auth.uid() 
            OR id IN (
                SELECT project_id FROM public.coauthor_memberships 
                WHERE user_id = auth.uid()
            )
        )
    );

CREATE POLICY "File uploaders and project owners can delete files" ON public.project_files
    FOR DELETE USING (
        auth.uid() = uploaded_by OR
        project_id IN (
            SELECT id FROM public.projects 
            WHERE owner_id = auth.uid()
        )
    );

CREATE POLICY "Project members can update files" ON public.project_files
    FOR UPDATE USING (
        project_id IN (
            SELECT id FROM public.projects 
            WHERE owner_id = auth.uid() 
            OR id IN (
                SELECT project_id FROM public.coauthor_memberships 
                WHERE user_id = auth.uid()
            )
        )
    );

-- Admin policies
CREATE POLICY "Admins can manage all projects" ON public.projects
    FOR ALL USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage all project files" ON public.project_files
    FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_projects_updated_at
    BEFORE UPDATE ON public.projects
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_project_files_updated_at
    BEFORE UPDATE ON public.project_files
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Grant necessary permissions
GRANT ALL ON public.projects TO authenticated;
GRANT ALL ON public.project_files TO authenticated;
