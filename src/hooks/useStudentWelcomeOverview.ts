
import { useMemo } from 'react';
import { useConsultationServices } from './useConsultationServices';

export const useStudentWelcomeOverview = () => {
  const { studentBookings, loading } = useConsultationServices();

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
    newMessages: 1, // Placeholder
    researchGoals: 3, // Placeholder
  };

  return {
    loading,
    stats,
    nextSession,
    recentSummaries,
  };
};
