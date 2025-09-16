-- Create announcements table
CREATE TABLE IF NOT EXISTS announcements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  target_audience TEXT NOT NULL CHECK (target_audience IN ('all', 'students', 'researchers', 'research_aids')),
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_announcements_target_audience ON announcements(target_audience);
CREATE INDEX idx_announcements_status ON announcements(status);
CREATE INDEX idx_announcements_created_at ON announcements(created_at);
CREATE INDEX idx_announcements_priority ON announcements(priority);

-- Add RLS policies
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;

-- Policy for admins to manage announcements
CREATE POLICY "Admins can manage announcements" ON announcements
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND (
        auth.users.email ILIKE '%admin%' 
        OR auth.jwt() ->> 'role' = 'admin'
      )
    )
  );

-- Policy for users to read active announcements relevant to them
CREATE POLICY "Users can read relevant announcements" ON announcements
  FOR SELECT USING (
    status = 'active' 
    AND (expires_at IS NULL OR expires_at > NOW())
    AND (
      target_audience = 'all' 
      OR (
        target_audience = 'students' 
        AND EXISTS (
          SELECT 1 FROM users 
          WHERE users.id = auth.uid() 
          AND users.role = 'student'
        )
      )
      OR (
        target_audience = 'researchers' 
        AND EXISTS (
          SELECT 1 FROM users 
          WHERE users.id = auth.uid() 
          AND users.role = 'expert'
        )
      )
      OR (
        target_audience = 'research_aids' 
        AND EXISTS (
          SELECT 1 FROM users 
          WHERE users.id = auth.uid() 
          AND users.role = 'aid'
        )
      )
    )
  );

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_announcements_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_announcements_updated_at
  BEFORE UPDATE ON announcements
  FOR EACH ROW
  EXECUTE FUNCTION update_announcements_updated_at();
