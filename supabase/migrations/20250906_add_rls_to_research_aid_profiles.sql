-- Enable RLS and add policies for research_aid_profiles table
DO $$
BEGIN
    ALTER TABLE public.research_aid_profiles ENABLE ROW LEVEL SECURITY;
EXCEPTION
    WHEN OTHERS THEN NULL;
END $$;

DO $$
BEGIN
    CREATE POLICY "Aids can view their own profile" ON public.research_aid_profiles
      FOR SELECT USING (auth.uid() = user_id);
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
    CREATE POLICY "Aids can update their own profile" ON public.research_aid_profiles
      FOR UPDATE USING (auth.uid() = user_id);
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
    CREATE POLICY "Aids can insert their own profile" ON public.research_aid_profiles
      FOR INSERT WITH CHECK (auth.uid() = user_id);
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
    CREATE POLICY "Aids can delete their own profile" ON public.research_aid_profiles
      FOR DELETE USING (auth.uid() = user_id);
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;
