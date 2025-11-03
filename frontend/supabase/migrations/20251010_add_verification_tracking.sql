-- Add verifications tracking and necessary security policies
-- Ensure the verifications column exists in researcher_profiles
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'researcher_profiles' 
        AND column_name = 'verifications'
    ) THEN
        ALTER TABLE researcher_profiles
        ADD COLUMN verifications JSONB DEFAULT '{}'::jsonb;
    END IF;
END $$;

-- Create storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('lovable-uploads', 'lovable-uploads', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies
-- Allow users to upload their own verification documents
CREATE POLICY "Users can upload their own documents"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'lovable-uploads' 
    AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow users to update their own documents
CREATE POLICY "Users can update their own documents"
ON storage.objects FOR UPDATE
TO authenticated
USING (
    bucket_id = 'lovable-uploads' 
    AND (storage.foldername(name))[1] = auth.uid()::text
)
WITH CHECK (
    bucket_id = 'lovable-uploads' 
    AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow users to delete their own documents
CREATE POLICY "Users can delete their own documents"
ON storage.objects FOR DELETE
TO authenticated
USING (
    bucket_id = 'lovable-uploads' 
    AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow public read access to verification documents
CREATE POLICY "Public read access for verification documents"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'lovable-uploads');

-- Create or update RLS policies for researcher_profiles table
CREATE POLICY "Users can update their own verifications"
ON public.researcher_profiles
FOR UPDATE
TO authenticated
USING (id::text = auth.uid())
WITH CHECK (id::text = auth.uid());

-- Allow admins to verify documents
CREATE POLICY "Admins can update verifications"
ON public.researcher_profiles
FOR UPDATE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM auth.users
        WHERE auth.uid() = auth.users.id
        AND auth.users.raw_app_meta_data->>'role' = 'admin'
    )
);
