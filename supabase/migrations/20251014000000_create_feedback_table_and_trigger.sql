-- Create feedback table for platform feedback
CREATE TABLE IF NOT EXISTS public.feedback (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    user_id UUID NULL,
    rating INTEGER NOT NULL,
    category TEXT NOT NULL,
    text TEXT NULL,
    created_at TIMESTAMP WITH TIME ZONE NULL DEFAULT now(),
    CONSTRAINT feedback_pkey PRIMARY KEY (id),
    CONSTRAINT feedback_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users (id) ON DELETE CASCADE
) TABLESPACE pg_default;

-- Enable Row Level Security
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

-- Create policies for feedback table
CREATE POLICY "Users can view all feedback" ON public.feedback
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert their own feedback" ON public.feedback
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own feedback" ON public.feedback
    FOR UPDATE USING (auth.uid() = user_id);

-- Create function to update platform metrics
CREATE OR REPLACE FUNCTION update_platform_metrics()
RETURNS TRIGGER AS $$
BEGIN
    -- Update platform metrics based on feedback
    -- This function will be called after each feedback insertion
    -- For now, we'll just return NEW to indicate success
    -- The actual metrics calculation will be handled by the usePlatformMetrics hook
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update platform metrics after feedback insertion
CREATE TRIGGER trg_update_platform_metrics
    AFTER INSERT ON public.feedback
    FOR EACH ROW
    EXECUTE FUNCTION update_platform_metrics();

-- Grant necessary permissions
GRANT ALL ON public.feedback TO authenticated;
GRANT ALL ON public.feedback TO anon;
