
-- First, let's add the role column if it doesn't exist
DO $$
BEGIN
    -- Create the enums first
    DROP TYPE IF EXISTS public.user_role CASCADE;
    CREATE TYPE public.user_role AS ENUM ('student', 'expert', 'aid', 'admin');
    
    DROP TYPE IF EXISTS public.sex_type CASCADE;
    CREATE TYPE public.sex_type AS ENUM ('male', 'female');
    
    DROP TYPE IF EXISTS public.study_level CASCADE;
    CREATE TYPE public.study_level AS ENUM ('hnd', 'state_diploma', 'bachelors', 'masters', 'phd', 'post_doctorate');
    
    -- Check if role column exists and add it if it doesn't
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' 
        AND column_name = 'role' 
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.users ADD COLUMN role user_role DEFAULT 'student'::user_role NOT NULL;
    ELSE
        -- If it exists, just change its type
        ALTER TABLE public.users ALTER COLUMN role TYPE user_role USING 
            CASE 
                WHEN role::text = 'expert' THEN 'expert'::user_role
                WHEN role::text = 'aid' THEN 'aid'::user_role
                WHEN role::text = 'admin' THEN 'admin'::user_role
                ELSE 'student'::user_role
            END;
    END IF;
END $$;

-- Now recreate the trigger function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
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
        COALESCE(NEW.raw_user_meta_data->>'fullName', NEW.email),
        COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'student'::user_role),
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
            WHEN NEW.raw_user_meta_data->>'dateOfBirth' IS NOT NULL AND NEW.raw_user_meta_data->>'dateOfBirth' != ''
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
        RAISE LOG 'Error in handle_new_user: %', SQLERRM;
        RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
