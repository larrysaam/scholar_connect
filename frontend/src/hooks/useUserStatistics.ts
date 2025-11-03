import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface UserStatistics {
  totalConsultations: number;
  averageRating: number;
  memberSince: string;
  loading: boolean;
}

export const useUserStatistics = (): UserStatistics => {
  const { user, profile } = useAuth();
  const [statistics, setStatistics] = useState<UserStatistics>({
    totalConsultations: 0,
    averageRating: 0,
    memberSince: '',
    loading: true,
  });

  useEffect(() => {
    const fetchUserStatistics = async () => {
      if (!user || !profile?.role) {
        setStatistics(prev => ({ ...prev, loading: false }));
        return;
      }

      try {
        let profileData = null;
        let consultationsCount = 0;

        // Fetch profile data based on role
        if (profile.role === 'expert') {
          const { data, error } = await supabase
            .from('researcher_profiles')
            .select('rating, total_reviews, created_at')
            .eq('user_id', user.id)
            .single();

          if (!error && data) {
            profileData = data;
          }
        } else if (profile.role === 'aid') {
          const { data, error } = await supabase
            .from('research_aid_profiles')
            .select('rating, total_reviews, created_at')
            .eq('id', user.id)
            .single();

          if (!error && data) {
            profileData = data;
          }
        }

        // Fetch total consultations from service_bookings
        const { count: bookingsCount, error: bookingsError } = await supabase
          .from('service_bookings')
          .select('*', { count: 'exact', head: true })
          .eq('provider_id', user.id)
          .eq('status', 'completed');

        if (!bookingsError) {
          consultationsCount = bookingsCount || 0;
        }

        // Calculate member since
        const memberSince = profileData?.created_at
          ? calculateMemberSince(new Date(profileData.created_at))
          : 'N/A';

        setStatistics({
          totalConsultations: consultationsCount,
          averageRating: profileData?.rating || 0,
          memberSince,
          loading: false,
        });
      } catch (error) {
        console.error('Error fetching user statistics:', error);
        setStatistics(prev => ({ ...prev, loading: false }));
      }
    };

    fetchUserStatistics();
  }, [user, profile?.role]);

  return statistics;
};

const calculateMemberSince = (createdDate: Date): string => {
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - createdDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 30) {
    return `${diffDays} days`;
  } else if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return `${months} month${months > 1 ? 's' : ''}`;
  } else {
    const years = Math.floor(diffDays / 365);
    const remainingMonths = Math.floor((diffDays % 365) / 30);
    if (remainingMonths === 0) {
      return `${years} year${years > 1 ? 's' : ''}`;
    } else {
      return `${years}.${remainingMonths} years`;
    }
  }
};
