
import { useState, useEffect, useMemo } from 'react';
import { useConsultationServices } from './useConsultationServices';
import { usePayments } from './usePayments';

export const useWelcomeOverview = () => {
  const { bookings, loading: consultationsLoading } = useConsultationServices();
  const { earnings, loading: paymentsLoading } = usePayments();

  const loading = consultationsLoading || paymentsLoading;

  const upcomingConsultationsCount = useMemo(() => {
    return bookings.filter(b => b.status === 'confirmed' && new Date(b.scheduled_date) > new Date()).length;
  }, [bookings]);

  const weeklyStats = useMemo(() => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const consultationsThisWeek = bookings.filter(b => new Date(b.scheduled_date) >= oneWeekAgo);
    const earningsThisWeek = earnings.filter(e => new Date(e.date) >= oneWeekAgo);

    const totalHoursThisWeek = consultationsThisWeek.reduce((sum, b) => sum + b.duration_minutes, 0) / 60;
    const totalEarningsThisWeek = earningsThisWeek.reduce((sum, e) => sum + e.amount, 0);

    return {
      consultations: consultationsThisWeek.length,
      earnings: totalEarningsThisWeek,
      hours: totalHoursThisWeek.toFixed(1),
      rating: 4.8, // Placeholder
    };
  }, [bookings, earnings]);

  const todaysSchedule = useMemo(() => {
    const today = new Date().toLocaleDateString();
    return bookings.filter(b => new Date(b.scheduled_date).toLocaleDateString() === today);
  }, [bookings]);

  return {
    loading,
    upcomingConsultationsCount,
    weeklyStats,
    todaysSchedule,
    newMessagesCount: 2, // Placeholder
    recentActivity: [], // Placeholder
  };
};
