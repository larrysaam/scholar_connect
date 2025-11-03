-- Add booking_id to researcher_reviews and modify constraints

-- Step 1: Drop the existing unique constraint
ALTER TABLE public.researcher_reviews
DROP CONSTRAINT IF EXISTS researcher_reviews_researcher_id_reviewer_id_key;

-- Step 2: Add the booking_id column
ALTER TABLE public.researcher_reviews
ADD COLUMN IF NOT EXISTS booking_id UUID REFERENCES public.service_bookings(id) ON DELETE CASCADE;

-- Step 3: Add a unique constraint to the booking_id column
ALTER TABLE public.researcher_reviews
ADD CONSTRAINT researcher_reviews_booking_id_key UNIQUE (booking_id);

-- Step 4: Add has_review to service_bookings to prevent duplicate reviews
ALTER TABLE public.service_bookings
ADD COLUMN IF NOT EXISTS has_review BOOLEAN DEFAULT false;

-- Step 5: Update the update_researcher_rating function to use the new structure
-- The function is already designed to handle this, but we will re-apply it to be safe.
CREATE OR REPLACE FUNCTION update_researcher_rating()
RETURNS TRIGGER AS $$
BEGIN
    -- Update the researcher's rating in researcher_profiles
    UPDATE researcher_profiles 
    SET 
        rating = (
            SELECT COALESCE(AVG(rating), 0)
            FROM researcher_reviews 
            WHERE researcher_id = COALESCE(NEW.researcher_id, OLD.researcher_id)
            AND is_public = true
        ),
        total_reviews = (
            SELECT COUNT(*)
            FROM researcher_reviews 
            WHERE researcher_id = COALESCE(NEW.researcher_id, OLD.researcher_id)
            AND is_public = true
        ),
        updated_at = NOW()
    WHERE user_id = COALESCE(NEW.researcher_id, OLD.researcher_id);
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;
