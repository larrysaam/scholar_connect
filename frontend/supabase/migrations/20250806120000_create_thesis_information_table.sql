CREATE TABLE IF NOT EXISTS public.thesis_information (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT,
    problem_statement TEXT,
    research_questions TEXT[],
    research_objectives TEXT[],
    research_hypothesis TEXT,
    expected_outcomes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.thesis_information ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own thesis information"
ON public.thesis_information FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own thesis information"
ON public.thesis_information FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own thesis information"
ON public.thesis_information FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own thesis information"
ON public.thesis_information FOR DELETE
USING (auth.uid() = user_id);