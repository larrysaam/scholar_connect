
-- Create the required enums if they don't exist
DO $$
BEGIN
    -- Create user_role enum if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE public.user_role AS ENUM ('student', 'expert', 'aid', 'admin');
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

-- Ensure the users table has the role column with correct type
DO $$
BEGIN
    -- Check if role column exists and add it if it doesn't
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' 
        AND column_name = 'role' 
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.users ADD COLUMN role user_role DEFAULT 'student'::user_role;
    END IF;
END $$;

-- Update the handle_new_user function to use proper error handling
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    user_role_value user_role;
    user_sex sex_type;
    user_dob date;
BEGIN
    -- Determine role with better error handling
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
    EXCEPTION
        WHEN OTHERS THEN
            user_role_value := 'student'::user_role;
    END;

    -- Handle sex conversion with error handling
    BEGIN
        CASE 
            WHEN NEW.raw_user_meta_data->>'sex' = 'male' THEN
                user_sex := 'male'::sex_type;
            WHEN NEW.raw_user_meta_data->>'sex' = 'female' THEN
                user_sex := 'female'::sex_type;
            ELSE
                user_sex := NULL;
        END CASE;
    EXCEPTION
        WHEN OTHERS THEN
            user_sex := NULL;
    END;

    -- Handle date of birth conversion with error handling
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

    -- Insert user with error handling
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

-- Ensure the trigger exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
