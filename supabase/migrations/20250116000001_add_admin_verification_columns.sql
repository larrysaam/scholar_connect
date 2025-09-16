-- Add admin verification columns to researcher_profiles and research_aid_profiles tables

-- Add admin_verified column to researcher_profiles
ALTER TABLE public.researcher_profiles 
ADD COLUMN IF NOT EXISTS admin_verified BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS admin_verified_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS admin_verified_by UUID REFERENCES public.users(id);

-- Add admin_verified column to research_aid_profiles  
ALTER TABLE public.research_aid_profiles 
ADD COLUMN IF NOT EXISTS admin_verified BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS admin_verified_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS admin_verified_by UUID REFERENCES public.users(id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_researcher_profiles_admin_verified ON public.researcher_profiles(admin_verified);
CREATE INDEX IF NOT EXISTS idx_research_aid_profiles_admin_verified ON public.research_aid_profiles(admin_verified);

-- Add RLS policies for admin verification
-- Admins can update verification status
DO $$
BEGIN
    CREATE POLICY "Admins can update researcher verification status" ON public.researcher_profiles
        FOR UPDATE USING (
            EXISTS (
                SELECT 1 FROM public.users 
                WHERE id = auth.uid() AND role = 'admin'
            )
        );
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
    CREATE POLICY "Admins can update research aid verification status" ON public.research_aid_profiles
        FOR UPDATE USING (
            EXISTS (
                SELECT 1 FROM public.users 
                WHERE id = auth.uid() AND role = 'admin'
            )
        );
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- Create function to update verification status
CREATE OR REPLACE FUNCTION public.update_admin_verification(
    profile_type TEXT,
    profile_user_id UUID,
    verified_status BOOLEAN
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    result JSONB;
    admin_id UUID;
BEGIN
    -- Check if the caller is an admin
    SELECT id INTO admin_id FROM public.users WHERE id = auth.uid() AND role = 'admin';
    
    IF admin_id IS NULL THEN
        RETURN jsonb_build_object('error', 'Unauthorized: Only admins can update verification status');
    END IF;
    
    -- Update researcher_profiles table
    IF profile_type = 'researcher' THEN
        UPDATE public.researcher_profiles 
        SET 
            admin_verified = verified_status,
            admin_verified_at = CASE WHEN verified_status = true THEN NOW() ELSE NULL END,
            admin_verified_by = CASE WHEN verified_status = true THEN admin_id ELSE NULL END,
            updated_at = NOW()
        WHERE user_id = profile_user_id;
        
        IF FOUND THEN
            result := jsonb_build_object('success', true, 'message', 'Researcher verification status updated');
        ELSE
            result := jsonb_build_object('error', 'Researcher profile not found');
        END IF;
    
    -- Update research_aid_profiles table
    ELSIF profile_type = 'research_aid' THEN
        UPDATE public.research_aid_profiles 
        SET 
            admin_verified = verified_status,
            admin_verified_at = CASE WHEN verified_status = true THEN NOW() ELSE NULL END,
            admin_verified_by = CASE WHEN verified_status = true THEN admin_id ELSE NULL END,
            updated_at = NOW()
        WHERE user_id = profile_user_id;
        
        IF FOUND THEN
            result := jsonb_build_object('success', true, 'message', 'Research aid verification status updated');
        ELSE
            result := jsonb_build_object('error', 'Research aid profile not found');
        END IF;
    
    ELSE
        result := jsonb_build_object('error', 'Invalid profile type. Must be "researcher" or "research_aid"');
    END IF;
    
    RETURN result;
END;
$$;

-- Grant execute permission on the function to authenticated users
GRANT EXECUTE ON FUNCTION public.update_admin_verification(TEXT, UUID, BOOLEAN) TO authenticated;
