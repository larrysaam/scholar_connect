import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/components/ui/use-toast';
import { Consultation } from '@/types/consultations';
import { Notification } from '@/types/notifications';

interface ResearchAidProfile {
  id: string;
  bio: string | null;
  expertise: string[] | null;
  hourly_rate: number | null;
  availability: any | null; // Adjust type as per your JSONB structure
  rating: number | null;
  total_consultations_completed: number;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: string;
  // Add other user fields you might need from the public.users table
}

interface ResearchAidDashboardData {
  userProfile: UserProfile | null;
  researchAidProfile: ResearchAidProfile | null;
  assignedConsultations: Consultation[];
  notifications: Notification[];
  loading: boolean;
  error: string | null;
}

export const useResearchAidDashboardData = (): ResearchAidDashboardData => {
  const { user, profile: authProfile } = useAuth(); // Get user from useAuth
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [researchAidProfile, setResearchAidProfile] = useState<ResearchAidProfile | null>(null);
  const [assignedConsultations, setAssignedConsultations] = useState<Consultation[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) {
        setLoading(false);
        setError("User not authenticated.");
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // Fetch user profile from public.users table
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('id, email, name, role')
          .eq('id', user.id)
          .single();

        if (userError) throw userError;
        setUserProfile(userData);

        // Fetch research aid profile
        const { data: aidProfileData, error: aidProfileError } = await supabase
          .from('research_aid_profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (aidProfileError && aidProfileError.code !== 'PGRST116') { // PGRST116 means no rows found
          throw aidProfileError;
        }
        setResearchAidProfile(aidProfileData);

        // Fetch assigned consultations
        const { data: consultationsData, error: consultationsError } = await supabase
          .from('consultations')
          .select('*') // Select all fields, adjust as needed
          .eq('research_aid_id', user.id); // Assuming 'research_aid_id' links consultations to research aids

        if (consultationsError) throw consultationsError;
        setAssignedConsultations(consultationsData);

        // Fetch notifications
        const { data: notificationsData, error: notificationsError } = await supabase
          .from('notifications')
          .select('*') // Select all fields, adjust as needed
          .eq('user_id', user.id); // Assuming 'user_id' links notifications to users

        if (notificationsError) throw notificationsError;
        setNotifications(notificationsData);

      } catch (err: any) {
        console.error("Error fetching dashboard data:", err.message);
        setError(err.message || "Failed to fetch dashboard data.");
        toast({
          title: "Error",
          description: err.message || "Failed to load dashboard data.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.id]); // Re-run when user ID changes

  return { userProfile, researchAidProfile, assignedConsultations, notifications, loading, error };
};