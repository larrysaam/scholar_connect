
-- Update the users table to support all the new fields for different user types
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
ADD COLUMN IF NOT EXISTS fields_of_expertise text;

-- Update the user_role enum if it doesn't include all roles
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role' AND typelem = 0) THEN
        CREATE TYPE public.user_role AS ENUM ('student', 'expert', 'aid', 'admin');
    END IF;
END $$;

-- Update the sex_type enum 
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'sex_type' AND typelem = 0) THEN
        CREATE TYPE public.sex_type AS ENUM ('male', 'female');
    END IF;
END $$;

-- Update the study_level enum to include all the options
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'study_level' AND typelem = 0) THEN
        CREATE TYPE public.study_level AS ENUM ('hnd', 'state_diploma', 'bachelors', 'masters', 'phd', 'post_doctorate');
    END IF;
END $$;

-- Ensure the handle_new_user function exists and works properly
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    user_role_value user_role;
BEGIN
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
        CASE 
            WHEN NEW.raw_user_meta_data->>'sex' = 'male' THEN 'male'::sex_type
            WHEN NEW.raw_user_meta_data->>'sex' = 'female' THEN 'female'::sex_type
            ELSE NULL
        END,
        CASE 
            WHEN NEW.raw_user_meta_data->>'dateOfBirth' IS NOT NULL 
            THEN (NEW.raw_user_meta_data->>'dateOfBirth')::date
            ELSE NULL
        END,
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
        RAISE LOG 'Error in handle_new_user: % - SQLSTATE: %', SQLERRM, SQLSTATE;
        RAISE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
