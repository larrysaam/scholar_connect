ALTER TABLE public.researcher_profiles
ADD COLUMN academic_verification_documents JSONB DEFAULT '[]'::jsonb,
ADD COLUMN publication_verification_documents JSONB DEFAULT '[]'::jsonb,
ADD COLUMN institutional_verification_documents JSONB DEFAULT '[]'::jsonb;