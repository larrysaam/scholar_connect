import { useMemo, useState, useEffect } from 'react';
import { useConsultationServices } from './useConsultationServices';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export const useStudentWelcomeOverview = () => {
  const { studentBookings, loading: bookingsLoading } = useConsultationServices();
  const { user } = useAuth();
  const [researchGoalsCount, setResearchGoalsCount] = useState(0);
  const [newMessagesCount, setNewMessagesCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch research goals count from thesis_information
  useEffect(() => {
    const fetchResearchGoals = async () => {
      if (!user?.id) return;

      try {
        const { data, error } = await supabase
          .from('thesis_information')
          .select('research_objectives')
          .eq('user_id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching thesis information:', error);
          return;
        }

        if (data?.research_objectives && Array.isArray(data.research_objectives)) {
          setResearchGoalsCount(data.research_objectives.length);
        } else {
          setResearchGoalsCount(0);
        }
      } catch (error) {
        console.error('Error fetching research goals:', error);
        setResearchGoalsCount(0);
      } finally {
        setLoading(false);
      }
    };

    fetchResearchGoals();
  }, [user?.id]);

  // Fetch new messages count
  useEffect(() => {
    const fetchNewMessagesCount = async () => {
      if (!user?.id) return;

      try {
        const { count, error } = await supabase
          .from('messages')
          .select('*', { count: 'exact', head: true })
          .eq('recipient_id', user.id)
          .eq('is_read', false);

        if (error) {
          console.error('Error fetching new messages count:', error);
          setNewMessagesCount(0);
        } else {
          setNewMessagesCount(count || 0);
        }
      } catch (error) {
        console.error('Error fetching new messages count:', error);
        setNewMessagesCount(0);
      }
    };

    fetchNewMessagesCount();
  }, [user?.id]);

  const upcomingSessions = useMemo(() => {
    return studentBookings.filter(b => b.status === 'confirmed' && new Date(b.scheduled_date) > new Date());
  }, [studentBookings]);

  const completedSessions = useMemo(() => {
    return studentBookings.filter(b => b.status === 'completed');
  }, [studentBookings]);

  const nextSession = useMemo(() => {
    if (upcomingSessions.length === 0) return null;
    return upcomingSessions[0];
  }, [upcomingSessions]);

  const recentSummaries = useMemo(() => {
    return completedSessions
      .slice(0, 2)
      .map(b => ({
        id: b.id,
        researcher: b.provider?.name || 'N/A',
        topic: b.service?.title || 'N/A',
        date: new Date(b.scheduled_date).toLocaleDateString(),
        notes: b.notes || 'No summary available.',
      }));
  }, [completedSessions]);

  const stats = {
    upcomingSessions: upcomingSessions.length,
    completedSessions: completedSessions.length,
    newMessages: newMessagesCount,
    researchGoals: researchGoalsCount,
  };

  return {
    loading: loading || bookingsLoading,
    stats,
    nextSession,
    recentSummaries,
  };
};
