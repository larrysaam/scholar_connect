-- Create research_aid_profiles table
CREATE TABLE public.research_aid_profiles (
  id uuid NOT NULL,
  bio text NULL,
  expertise text[] NULL,
  hourly_rate numeric(10, 2) NULL,
  availability jsonb NULL,
  rating numeric(2, 1) NULL,
  total_consultations_completed integer NULL DEFAULT 0,
  is_verified boolean NULL DEFAULT false,
  created_at timestamp with time zone NULL DEFAULT now(),
  updated_at timestamp with time zone NULL DEFAULT now(),
  verifications jsonb NULL,
  title text NULL,
  job_title text NULL,
  location text NULL,
  education_summary text NULL,
  skills text[] NULL,
  educational_background jsonb NULL,
  work_experience jsonb NULL,
  awards jsonb NULL,
  publications jsonb NULL,
  scholarships jsonb NULL,
  affiliations text[] NULL,
  admin_verified boolean NULL DEFAULT false,
  admin_verified_at timestamp with time zone NULL,
  admin_verified_by uuid NULL,
  CONSTRAINT research_aid_profiles_pkey PRIMARY KEY (id),
  CONSTRAINT research_aid_profiles_admin_verified_by_fkey FOREIGN KEY (admin_verified_by) REFERENCES users (id),
  CONSTRAINT research_aid_profiles_id_fkey FOREIGN KEY (id) REFERENCES users (id) ON DELETE CASCADE
) TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS idx_research_aid_profiles_admin_verified ON public.research_aid_profiles USING btree (admin_verified) TABLESPACE pg_default;
