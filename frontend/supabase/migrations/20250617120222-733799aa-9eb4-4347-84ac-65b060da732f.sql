
-- First, let's check if the enums exist and create them if they don't
DO $$
BEGIN
    -- Create user_role enum if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE public.user_role AS ENUM ('student', 'expert', 'aid', 'admin');
    ELSE
        -- If it exists but doesn't have all values, we need to add them
        IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'expert' AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'user_role')) THEN
            ALTER TYPE public.user_role ADD VALUE 'expert';
        END IF;
        IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'aid' AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'user_role')) THEN
            ALTER TYPE public.user_role ADD VALUE 'aid';
        END IF;
    END IF;

    -- Create sex_type enum if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'sex_type') THEN
        CREATE TYPE public.sex_type AS ENUM ('male', 'female');
    END IF;

    -- Create study_level enum if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'study_level') THEN
        CREATE TYPE public.study_level AS ENUM ('hnd', 'state_diploma', 'bachelors', 'masters', 'phd', 'post_doctorate');
    END IF;
END $$;

-- Update the users table to ensure it has the role column with the correct type
DO $$
BEGIN
    -- Check if role column exists and has correct type
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' 
        AND column_name = 'role' 
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.users ADD COLUMN role user_role DEFAULT 'student'::user_role;
    END IF;
END $$;

-- Ensure all necessary columns exist in users table
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS university_institution text,
ADD COLUMN IF NOT EXISTS field_of_study text,
ADD COLUMN IF NOT EXISTS level_of_study text,
ADD COLUMN IF NOT EXISTS research_topic text,
ADD COLUMN IF NOT EXISTS research_stage text,
ADD COLUMN IF NOT EXISTS academic_rank text,
ADD COLUMN IF NOT EXISTS highest_education text,
ADD COLUMN IF NOT EXISTS linkedin_account text,
ADD COLUMN IF NOT EXISTS researchgate_account text,
ADD COLUMN IF NOT EXISTS academia_edu_account text,
ADD COLUMN IF NOT EXISTS orcid_id text,
ADD COLUMN IF NOT EXISTS preferred_language text,
ADD COLUMN IF NOT EXISTS fields_of_expertise text,
ADD COLUMN IF NOT EXISTS sex sex_type,
ADD COLUMN IF NOT EXISTS date_of_birth date;

-- Create or replace the handle_new_user function with better error handling
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    user_role_value user_role;
    user_sex sex_type;
    user_dob date;
BEGIN
    -- Determine role
    CASE 
        WHEN NEW.raw_user_meta_data->>'role' = 'expert' THEN
            user_role_value := 'expert'::user_role;
        WHEN NEW.raw_user_meta_data->>'role' = 'aid' THEN
            user_role_value := 'aid'::user_role;
        WHEN NEW.raw_user_meta_data->>'role' = 'admin' THEN
            user_role_value := 'admin'::user_role;
        ELSE
            user_role_value := 'student'::user_role;
    END CASE;

    -- Handle sex conversion
    CASE 
        WHEN NEW.raw_user_meta_data->>'sex' = 'male' THEN
            user_sex := 'male'::sex_type;
        WHEN NEW.raw_user_meta_data->>'sex' = 'female' THEN
            user_sex := 'female'::sex_type;
        ELSE
            user_sex := NULL;
    END CASE;

    -- Handle date of birth conversion
    BEGIN
        IF NEW.raw_user_meta_data->>'dateOfBirth' IS NOT NULL AND NEW.raw_user_meta_data->>'dateOfBirth' != '' THEN
            user_dob := (NEW.raw_user_meta_data->>'dateOfBirth')::date;
        ELSE
            user_dob := NULL;
        END IF;
    EXCEPTION
        WHEN OTHERS THEN
            user_dob := NULL;
    END;

    INSERT INTO public.users (
        id, 
        email, 
        name, 
        role,
        phone_number,
        country,
        university_institution,
        field_of_study,
        level_of_study,
        sex,
        date_of_birth,
        research_topic,
        research_stage,
        academic_rank,
        highest_education,
        linkedin_account,
        researchgate_account,
        academia_edu_account,
        orcid_id,
        preferred_language,
        fields_of_expertise
    )
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(
            NEW.raw_user_meta_data->>'fullName', 
            NEW.raw_user_meta_data->>'name', 
            NEW.email
        ),
        user_role_value,
        NEW.raw_user_meta_data->>'phoneNumber',
        NEW.raw_user_meta_data->>'country',
        NEW.raw_user_meta_data->>'universityInstitution',
        NEW.raw_user_meta_data->>'fieldOfStudy',
        NEW.raw_user_meta_data->>'levelOfStudy',
        user_sex,
        user_dob,
        NEW.raw_user_meta_data->>'researchTopic',
        NEW.raw_user_meta_data->>'researchStage',
        NEW.raw_user_meta_data->>'academicRank',
        NEW.raw_user_meta_data->>'highestEducation',
        NEW.raw_user_meta_data->>'linkedinAccount',
        NEW.raw_user_meta_data->>'researchgateAccount',
        NEW.raw_user_meta_data->>'academiaEduAccount',
        NEW.raw_user_meta_data->>'orcidId',
        NEW.raw_user_meta_data->>'preferredLanguage',
        NEW.raw_user_meta_data->>'fieldsOfExpertise'
    );
    
    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        RAISE LOG 'Error in handle_new_user for user %: % - SQLSTATE: %', NEW.id, SQLERRM, SQLSTATE;
        -- Don't block user creation, just log the error
        RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop and recreate the trigger to ensure it's properly set up
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
