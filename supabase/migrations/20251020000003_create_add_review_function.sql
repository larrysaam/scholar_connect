-- Function to add a review to a provider's profile
-- This function runs with security definer to bypass RLS
CREATE OR REPLACE FUNCTION add_provider_review(
  p_provider_id UUID,
  p_reviewer_id UUID,
  p_booking_id UUID,
  p_rating INTEGER,
  p_comment TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_current_rating DECIMAL(3,2);
  v_current_total_reviews INTEGER;
  v_new_rating DECIMAL(3,2);
  v_new_total_reviews INTEGER;
  v_reviews JSONB;
  v_new_review JSONB;
  v_rows_affected INTEGER;
  v_provider_role TEXT;
BEGIN
  -- Prepare the new review
  v_new_review := jsonb_build_object(
    'booking_id', p_booking_id,
    'reviewer_id', p_reviewer_id,
    'rating', p_rating,
    'comment', p_comment,
    'created_at', NOW()
  );

  -- Check provider's role to determine which profile table to use
  SELECT role INTO v_provider_role
  FROM users
  WHERE id = p_provider_id;

  IF v_provider_role = 'aid' THEN
    -- Handle research_aid_profiles
    SELECT rating, total_reviews, reviews
    INTO v_current_rating, v_current_total_reviews, v_reviews
    FROM research_aid_profiles
    WHERE id = p_provider_id;

    IF NOT FOUND THEN
      -- Create basic profile if it doesn't exist
      INSERT INTO research_aid_profiles (id, rating, total_reviews, reviews, created_at, updated_at)
      VALUES (p_provider_id, 0, 0, '[]'::jsonb, NOW(), NOW());
      
      v_current_rating := 0;
      v_current_total_reviews := 0;
      v_reviews := '[]'::jsonb;
    END IF;

    -- Update research_aid_profiles
    v_new_total_reviews := v_current_total_reviews + 1;
    v_new_rating := ROUND(((v_current_rating * v_current_total_reviews) + p_rating)::DECIMAL / v_new_total_reviews, 2);

    UPDATE research_aid_profiles
    SET
      rating = v_new_rating,
      total_reviews = v_new_total_reviews,
      reviews = v_reviews || v_new_review,
      updated_at = NOW()
    WHERE id = p_provider_id;

    GET DIAGNOSTICS v_rows_affected = ROW_COUNT;
    IF v_rows_affected > 0 THEN
      RETURN TRUE;
    END IF;

  ELSIF v_provider_role = 'expert' THEN
    -- Handle researcher_profiles
    SELECT rating, total_reviews, reviews
    INTO v_current_rating, v_current_total_reviews, v_reviews
    FROM researcher_profiles
    WHERE user_id = p_provider_id
    ORDER BY created_at DESC
    LIMIT 1;

    IF NOT FOUND THEN
      -- Create basic profile if it doesn't exist
      INSERT INTO researcher_profiles (user_id, rating, total_reviews, reviews, created_at, updated_at)
      VALUES (p_provider_id, 0, 0, '[]'::jsonb, NOW(), NOW());
      
      v_current_rating := 0;
      v_current_total_reviews := 0;
      v_reviews := '[]'::jsonb;
    END IF;

    -- Update researcher_profiles
    v_new_total_reviews := v_current_total_reviews + 1;
    v_new_rating := ROUND(((v_current_rating * v_current_total_reviews) + p_rating)::DECIMAL / v_new_total_reviews, 2);

    UPDATE researcher_profiles
    SET
      rating = v_new_rating,
      total_reviews = v_new_total_reviews,
      reviews = v_reviews || v_new_review,
      updated_at = NOW()
    WHERE user_id = p_provider_id;

    GET DIAGNOSTICS v_rows_affected = ROW_COUNT;
    IF v_rows_affected > 0 THEN
      RETURN TRUE;
    END IF;
  END IF;

  -- No valid role found or update failed
  RETURN FALSE;
END;
$$;
