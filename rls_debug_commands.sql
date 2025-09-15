-- RLS Policy Investigation and Fix Commands
-- Run these commands in your Supabase SQL Editor

-- 1. Check if RLS is enabled on the tables
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename IN ('job_applications', 'jobs', 'users');

-- 2. Check existing policies on job_applications table
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'job_applications';

-- 3. Check existing policies on jobs table
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'jobs';

-- 4. Check existing policies on users table
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'users';

-- 5. Count actual data in tables (bypass RLS temporarily)
-- This will show if data exists at all
SELECT 
    'job_applications' as table_name, 
    COUNT(*) as row_count 
FROM job_applications
UNION ALL
SELECT 
    'jobs' as table_name, 
    COUNT(*) as row_count 
FROM jobs
UNION ALL
SELECT 
    'users' as table_name, 
    COUNT(*) as row_count 
FROM users;

-- 6. TEMPORARY FIX: Create admin policies to allow full access for admins
-- (You may need to adjust these based on your auth system)

-- For job_applications table - allow admin full access
CREATE POLICY "Admin full access job_applications" 
ON job_applications 
FOR ALL 
USING (
    EXISTS (
        SELECT 1 FROM auth.users 
        WHERE auth.users.id = auth.uid() 
        AND auth.users.email ILIKE '%admin%'
    )
    OR 
    auth.jwt() ->> 'role' = 'admin'
    OR
    TRUE -- TEMPORARY: Allow all access for debugging
);

-- For jobs table - allow admin full access
CREATE POLICY "Admin full access jobs" 
ON jobs 
FOR ALL 
USING (
    EXISTS (
        SELECT 1 FROM auth.users 
        WHERE auth.users.id = auth.uid() 
        AND auth.users.email ILIKE '%admin%'
    )
    OR 
    auth.jwt() ->> 'role' = 'admin'
    OR
    TRUE -- TEMPORARY: Allow all access for debugging
);

-- For users table - allow admin full access
CREATE POLICY "Admin full access users" 
ON users 
FOR ALL 
USING (
    EXISTS (
        SELECT 1 FROM auth.users 
        WHERE auth.users.id = auth.uid() 
        AND auth.users.email ILIKE '%admin%'
    )
    OR 
    auth.jwt() ->> 'role' = 'admin'
    OR
    TRUE -- TEMPORARY: Allow all access for debugging
);

-- 7. ALTERNATIVE: Temporarily disable RLS for debugging
-- (ONLY use this on development/staging, NEVER on production)
-- ALTER TABLE job_applications DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE jobs DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- 8. Check what user is currently authenticated
SELECT 
    auth.uid() as current_user_id,
    auth.jwt() as current_jwt,
    auth.email() as current_email;

-- 9. Insert some test data if tables are empty
-- First, let's create some test users
INSERT INTO users (id, name, email, role) VALUES 
    ('550e8400-e29b-41d4-a716-446655440001', 'John Client', 'client@example.com', 'student'),
    ('550e8400-e29b-41d4-a716-446655440002', 'Jane Applicant', 'aide@example.com', 'aid')
ON CONFLICT (id) DO NOTHING;

-- Create a test job
INSERT INTO jobs (id, title, description, category, budget, currency, user_id, status) VALUES 
    ('550e8400-e29b-41d4-a716-446655440010', 'Research Paper Help', 'Need help with research methodology', 'Research', 500000, 'XAF', '550e8400-e29b-41d4-a716-446655440001', 'active')
ON CONFLICT (id) DO NOTHING;

-- Create a test job application
INSERT INTO job_applications (id, job_id, applicant_id, status, cover_letter) VALUES 
    ('550e8400-e29b-41d4-a716-446655440020', '550e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440002', 'pending', 'I am interested in helping with this research project.')
ON CONFLICT (id) DO NOTHING;
