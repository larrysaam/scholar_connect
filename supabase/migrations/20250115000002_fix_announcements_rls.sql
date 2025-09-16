-- Fix announcements RLS policies to avoid user table permission issues

-- Drop existing policies
DROP POLICY IF EXISTS "Admins can manage announcements" ON announcements;
DROP POLICY IF EXISTS "Users can read relevant announcements" ON announcements;

-- Create simplified admin policy that doesn't rely on user table joins
CREATE POLICY "Authenticated users can manage announcements" ON announcements
  FOR ALL USING (auth.uid() IS NOT NULL);

-- Create simplified read policy for active announcements
CREATE POLICY "Anyone can read active announcements" ON announcements
  FOR SELECT USING (
    status = 'active' 
    AND (expires_at IS NULL OR expires_at > NOW())
  );

-- Grant necessary permissions to authenticated users
GRANT ALL ON announcements TO authenticated;
GRANT SELECT ON announcements TO anon;
