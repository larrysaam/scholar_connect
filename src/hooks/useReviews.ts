import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/supabaseClient'; // Assuming this path is correct

interface Review {
  id: string;
  rating: number;
  comment: string;
  created_at: string;
  reviewer: {
    id: string;
    full_name: string;
    avatar_url: string;
  };
  booking: {
    id: string;
    service: {
      title: string;
    };
    scheduled_date: string;
    scheduled_time: string;
  };
}

export const useReviews = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchReviewsByRevieweeId = useCallback(async (revieweeId: string) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          id,
          rating,
          comment,
          created_at,
          reviewer:reviewer_id(
            id,
            full_name,
            avatar_url
          ),
          booking:booking_id(
            id,
            service:service_id(
              title
            ),
            scheduled_date,
            scheduled_time
          )
        `)
        .eq('reviewee_id', revieweeId);

      if (error) {
        throw error;
      }
      setReviews(data || []);
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    reviews,
    loading,
    error,
    fetchReviewsByRevieweeId,
  };
};
