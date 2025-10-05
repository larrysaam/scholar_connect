
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

  const recentActivity = useMemo(() => {
    const activities = [];
    
    // Add recent bookings as activity
    const recentBookings = bookings
      .filter(b => new Date(b.created_at) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)) // Last 7 days
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 3);

    recentBookings.forEach(booking => {
      activities.push({
        id: `booking-${booking.id}`,
        type: 'booking',
        title: 'New consultation request',
        description: `from ${booking.client?.name || 'Student'}`,
        timestamp: booking.created_at,
        color: 'blue'
      });
    });

    // Add recent payments as activity
    const recentPayments = earnings
      .filter(e => new Date(e.date) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)) // Last 7 days
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 3);

    recentPayments.forEach(payment => {
      activities.push({
        id: `payment-${payment.id}`,
        type: 'payment',
        title: 'Payment received',
        description: `${payment.amount.toLocaleString()} XAF`,
        timestamp: payment.date,
        color: 'green'
      });
    });

    // Sort all activities by timestamp and return top 5
    return activities
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 5);
  }, [bookings, earnings]);

  return {
    loading,
    upcomingConsultationsCount,
    weeklyStats,
    todaysSchedule,
    newMessagesCount: 2, // Placeholder
    recentActivity,
  };
};
