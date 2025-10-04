-- Drop and recreate project_versions table with correct schema
DROP TABLE IF EXISTS project_versions;

CREATE TABLE project_versions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    version_number integer NOT NULL,
    title text NOT NULL,
    content jsonb NOT NULL,
    changes_summary text,
    created_by uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at timestamptz NOT NULL DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_project_versions_project_id ON project_versions(project_id);
CREATE INDEX IF NOT EXISTS idx_project_versions_created_by ON project_versions(created_by);

-- Enable RLS
ALTER TABLE project_versions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Project members can view versions" ON project_versions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM projects 
            WHERE id = project_versions.project_id 
            AND (
                owner_id = auth.uid() 
                OR id IN (
                    SELECT project_id FROM coauthor_memberships 
                    WHERE user_id = auth.uid()
                )
            )
        )
    );

CREATE POLICY "Project members can create versions" ON project_versions
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM projects 
            WHERE id = project_id 
            AND (
                owner_id = auth.uid() 
                OR id IN (
                    SELECT project_id FROM coauthor_memberships 
                    WHERE user_id = auth.uid()
                )
            )
        )
    );

-- Grant necessary permissions
GRANT ALL ON project_versions TO authenticated;

-- Notify pgrest to reload schema cache
NOTIFY pgrst, 'reload schema';
