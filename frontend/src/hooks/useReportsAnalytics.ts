import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/use-toast';

export interface EngagementMetric {
  metric: string;
  value: string;
  change: string;
  rawValue?: number;
}

export interface TopPerformer {
  id: string;
  name: string;
  sessions?: number;
  tasks?: number;
  rating: number;
  earnings: string;
  rawEarnings: number;
}

export interface PopularTopic {
  topic: string;
  bookings: number;
  percentage: string;
}

export interface UserJourneyDropOff {
  stage: string;
  dropoff: string;
  users: number;
}

export interface ReportsAnalyticsData {
  engagementMetrics: EngagementMetric[];
  topResearchers: TopPerformer[];
  topResearchAids: TopPerformer[];
  popularTopics: PopularTopic[];
  userJourneyDropOffs: UserJourneyDropOff[];
  loading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
}

export const useReportsAnalytics = (): ReportsAnalyticsData => {
  const { user } = useAuth();
  const { toast } = useToast();

  // Check if user is admin
  const isAdmin = useMemo(() => {
    if (!user) return false;
    return user?.user_metadata?.role === 'admin' || 
           user?.role === 'admin' || 
           (user as any)?.app_metadata?.role === 'admin';
  }, [user]);

  const [engagementMetrics, setEngagementMetrics] = useState<EngagementMetric[]>([]);
  const [topResearchers, setTopResearchers] = useState<TopPerformer[]>([]);
  const [topResearchAids, setTopResearchAids] = useState<TopPerformer[]>([]);
  const [popularTopics, setPopularTopics] = useState<PopularTopic[]>([]);
  const [userJourneyDropOffs, setUserJourneyDropOffs] = useState<UserJourneyDropOff[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Helper function to calculate percentage change
  const calculatePercentageChange = (current: number, previous: number): string => {
    if (previous === 0) return current > 0 ? '+100%' : '0%';
    const change = ((current - previous) / previous) * 100;
    return `${change >= 0 ? '+' : ''}${change.toFixed(0)}%`;
  };

  // Helper function to format time ago
  const getTimeAgo = (dateString: string): string => {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  // Fetch engagement metrics
  const fetchEngagementMetrics = async (): Promise<EngagementMetric[]> => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sixtyDaysAgo = new Date(today.getTime() - 60 * 24 * 60 * 60 * 1000);

    // Daily Active Users (users who made bookings or had consultations today vs yesterday)
    const { count: activeUsersToday } = await supabase
      .from('service_bookings')
      .select('client_id', { count: 'exact', head: true })
      .gte('created_at', today.toISOString().split('T')[0])
      .lt('created_at', new Date(today.getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]);

    const { count: activeUsersYesterday } = await supabase
      .from('service_bookings')
      .select('client_id', { count: 'exact', head: true })
      .gte('created_at', yesterday.toISOString().split('T')[0])
      .lt('created_at', today.toISOString().split('T')[0]);

    // Average Session Duration (in minutes, based on completed consultations)
    const { data: completedSessions } = await supabase
      .from('service_bookings')
      .select('duration_minutes')
      .eq('status', 'completed')
      .gte('scheduled_date', thirtyDaysAgo.toISOString().split('T')[0]);

    const avgSessionDuration = completedSessions && completedSessions.length > 0
      ? Math.round(completedSessions.reduce((sum, s) => sum + (s.duration_minutes || 60), 0) / completedSessions.length)
      : 60;

    // Previous month average for comparison
    const { data: prevCompletedSessions } = await supabase
      .from('service_bookings')
      .select('duration_minutes')
      .eq('status', 'completed')
      .gte('scheduled_date', sixtyDaysAgo.toISOString().split('T')[0])
      .lt('scheduled_date', thirtyDaysAgo.toISOString().split('T')[0]);

    const prevAvgSessionDuration = prevCompletedSessions && prevCompletedSessions.length > 0
      ? Math.round(prevCompletedSessions.reduce((sum, s) => sum + (s.duration_minutes || 60), 0) / prevCompletedSessions.length)
      : 60;

    // Consultation Completion Rate (completed vs total scheduled in last 30 days)
    const { count: totalConsultations } = await supabase
      .from('service_bookings')
      .select('id', { count: 'exact', head: true })
      .gte('scheduled_date', thirtyDaysAgo.toISOString().split('T')[0])
      .in('status', ['completed', 'cancelled', 'no_show']);

    const { count: completedConsultations } = await supabase
      .from('service_bookings')
      .select('id', { count: 'exact', head: true })
      .gte('scheduled_date', thirtyDaysAgo.toISOString().split('T')[0])
      .eq('status', 'completed');

    const completionRate = totalConsultations && totalConsultations > 0
      ? Math.round((completedConsultations || 0) / totalConsultations * 100)
      : 0;

    // Previous month completion rate
    const { count: prevTotalConsultations } = await supabase
      .from('service_bookings')
      .select('id', { count: 'exact', head: true })
      .gte('scheduled_date', sixtyDaysAgo.toISOString().split('T')[0])
      .lt('scheduled_date', thirtyDaysAgo.toISOString().split('T')[0])
      .in('status', ['completed', 'cancelled', 'no_show']);

    const { count: prevCompletedConsultations } = await supabase
      .from('service_bookings')
      .select('id', { count: 'exact', head: true })
      .gte('scheduled_date', sixtyDaysAgo.toISOString().split('T')[0])
      .lt('scheduled_date', thirtyDaysAgo.toISOString().split('T')[0])
      .eq('status', 'completed');

    const prevCompletionRate = prevTotalConsultations && prevTotalConsultations > 0
      ? Math.round((prevCompletedConsultations || 0) / prevTotalConsultations * 100)
      : 0;

    // User Retention (users who made bookings in both last 30 days and previous 30 days)
    const { data: recentUsers } = await supabase
      .from('service_bookings')
      .select('client_id')
      .gte('created_at', thirtyDaysAgo.toISOString().split('T')[0]);

    const { data: previousUsers } = await supabase
      .from('service_bookings')
      .select('client_id')
      .gte('created_at', sixtyDaysAgo.toISOString().split('T')[0])
      .lt('created_at', thirtyDaysAgo.toISOString().split('T')[0]);

    const recentUserIds = new Set((recentUsers || []).map(u => u.client_id));
    const previousUserIds = new Set((previousUsers || []).map(u => u.client_id));
    const retainedUsers = [...recentUserIds].filter(id => previousUserIds.has(id)).length;
    const retentionRate = previousUserIds.size > 0
      ? Math.round((retainedUsers / previousUserIds.size) * 100)
      : 0;

    // Calculate retention for two months ago for comparison
    const ninetyDaysAgo = new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000);
    const { data: oldestUsers } = await supabase
      .from('service_bookings')
      .select('client_id')
      .gte('created_at', ninetyDaysAgo.toISOString().split('T')[0])
      .lt('created_at', sixtyDaysAgo.toISOString().split('T')[0]);

    const oldestUserIds = new Set((oldestUsers || []).map(u => u.client_id));
    const prevRetainedUsers = [...previousUserIds].filter(id => oldestUserIds.has(id)).length;
    const prevRetentionRate = oldestUserIds.size > 0
      ? Math.round((prevRetainedUsers / oldestUserIds.size) * 100)
      : 0;

    return [
      {
        metric: "Daily Active Users",
        value: (activeUsersToday || 0).toString(),
        change: calculatePercentageChange(activeUsersToday || 0, activeUsersYesterday || 0),
        rawValue: activeUsersToday || 0
      },
      {
        metric: "Session Duration",
        value: `${avgSessionDuration} min`,
        change: calculatePercentageChange(avgSessionDuration, prevAvgSessionDuration),
        rawValue: avgSessionDuration
      },
      {
        metric: "Consultation Completion Rate",
        value: `${completionRate}%`,
        change: calculatePercentageChange(completionRate, prevCompletionRate),
        rawValue: completionRate
      },
      {
        metric: "User Retention (30-day)",
        value: `${retentionRate}%`,
        change: calculatePercentageChange(retentionRate, prevRetentionRate),
        rawValue: retentionRate
      }
    ];
  };

  // Fetch top performing researchers
  const fetchTopResearchers = async (): Promise<TopPerformer[]> => {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    // Get researchers with their booking stats and earnings from last 30 days
    const { data: bookingsData, error: bookingsError } = await supabase
      .from('service_bookings')
      .select(`
        provider_id,
        total_price,
        status,
        users!service_bookings_provider_id_fkey(name, role)
      `)
      .gte('scheduled_date', thirtyDaysAgo.toISOString().split('T')[0])
      .eq('users.role', 'expert')
      .eq('status', 'completed')
      .eq('payment_status', 'paid');

    if (bookingsError) {
      console.error('Error fetching researcher bookings:', bookingsError);
      return [];
    }

    // Group by researcher and calculate metrics
    const researcherStats = new Map<string, {
      id: string;
      name: string;
      sessions: number;
      earnings: number;
      rating: number;
    }>();

    (bookingsData || []).forEach(booking => {
      if (!booking.provider_id || booking.users?.role !== 'expert') return;
      
      const current = researcherStats.get(booking.provider_id) || {
        id: booking.provider_id,
        name: booking.users?.name || 'Unknown Researcher',
        sessions: 0,
        earnings: 0,
        rating: 0
      };

      current.sessions += 1;
      current.earnings += booking.total_price || 0;
      researcherStats.set(booking.provider_id, current);
    });

    // Get researcher ratings from profiles
    const researcherIds = Array.from(researcherStats.keys());
    const { data: ratingsData } = await supabase
      .from('researcher_profiles')
      .select('user_id, rating')
      .in('user_id', researcherIds);

    // Add ratings
    (ratingsData || []).forEach(profile => {
      const researcher = researcherStats.get(profile.user_id);
      if (researcher) {
        researcher.rating = profile.rating || 0;
      }
    });

    // Convert to array and sort by earnings
    const researchers = Array.from(researcherStats.values())
      .map(researcher => ({
        id: researcher.id,
        name: researcher.name,
        sessions: researcher.sessions,
        rating: researcher.rating,
        earnings: `${researcher.earnings.toLocaleString()} XAF`,
        rawEarnings: researcher.earnings
      }))
      .sort((a, b) => b.rawEarnings - a.rawEarnings)
      .slice(0, 5);

    return researchers;
  };

  // Fetch top performing research aids
  const fetchTopResearchAids = async (): Promise<TopPerformer[]> => {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    // Get research aids with their booking stats and job earnings from last 30 days
    const { data: bookingsData } = await supabase
      .from('service_bookings')
      .select(`
        provider_id,
        total_price,
        status,
        users!service_bookings_provider_id_fkey(name, role)
      `)
      .gte('scheduled_date', thirtyDaysAgo.toISOString().split('T')[0])
      .eq('users.role', 'aid')
      .eq('status', 'completed')
      .eq('payment_status', 'paid');

    // Get job application earnings
    const { data: jobApplications } = await supabase
      .from('job_applications')
      .select(`
        applicant_id,
        status,
        jobs:job_id(budget, status),
        users:applicant_id(name, role)
      `)
      .gte('created_at', thirtyDaysAgo.toISOString())
      .eq('status', 'accepted')
      .eq('users.role', 'aid');

    // Group by research aid and calculate metrics
    const aidStats = new Map<string, {
      id: string;
      name: string;
      tasks: number;
      earnings: number;
      rating: number;
    }>();

    // Add booking earnings
    (bookingsData || []).forEach(booking => {
      if (!booking.provider_id || booking.users?.role !== 'aid') return;
      
      const current = aidStats.get(booking.provider_id) || {
        id: booking.provider_id,
        name: booking.users?.name || 'Unknown Research Aid',
        tasks: 0,
        earnings: 0,
        rating: 0
      };

      current.tasks += 1;
      current.earnings += booking.total_price || 0;
      aidStats.set(booking.provider_id, current);
    });

    // Add job earnings
    (jobApplications || []).forEach(application => {
      if (!application.applicant_id || application.users?.role !== 'aid') return;
      
      const current = aidStats.get(application.applicant_id) || {
        id: application.applicant_id,
        name: application.users?.name || 'Unknown Research Aid',
        tasks: 0,
        earnings: 0,
        rating: 0
      };

      current.tasks += 1;
      if (application.jobs?.status === 'completed') {
        current.earnings += application.jobs?.budget || 0;
      }
      aidStats.set(application.applicant_id, current);
    });

    // Get ratings for research aids from research_aid_profiles
    const aidIds = Array.from(aidStats.keys());
    const { data: ratingsData } = await supabase
      .from('research_aid_profiles')
      .select('user_id, rating')
      .in('user_id', aidIds);

    // Add ratings
    (ratingsData || []).forEach(profile => {
      const aid = aidStats.get(profile.user_id);
      if (aid) {
        aid.rating = profile.rating || 0;
      }
    });

    // Convert to array and sort by earnings
    const aids = Array.from(aidStats.values())
      .map(aid => ({
        id: aid.id,
        name: aid.name,
        tasks: aid.tasks,
        rating: aid.rating,
        earnings: `${aid.earnings.toLocaleString()} XAF`,
        rawEarnings: aid.earnings
      }))
      .sort((a, b) => b.rawEarnings - a.rawEarnings)
      .slice(0, 5);

    return aids;
  };

  // Fetch popular consultation topics
  const fetchPopularTopics = async (): Promise<PopularTopic[]> => {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    // Get consultation services with booking counts
    const { data: bookingsData } = await supabase
      .from('service_bookings')
      .select(`
        service_id,
        consultation_services:service_id(title, category)
      `)
      .gte('scheduled_date', thirtyDaysAgo.toISOString().split('T')[0])
      .in('status', ['confirmed', 'completed']);

    // Group by service category or title
    const topicStats = new Map<string, number>();

    (bookingsData || []).forEach(booking => {
      const service = booking.consultation_services;
      if (!service) return;

      // Use category as the topic, or title if category is generic
      const topic = service.category === 'General Consultation' 
        ? service.title || 'General Consultation'
        : service.category;

      topicStats.set(topic, (topicStats.get(topic) || 0) + 1);
    });

    const totalBookings = Array.from(topicStats.values()).reduce((sum, count) => sum + count, 0);

    // Convert to array and sort by booking count
    const topics = Array.from(topicStats.entries())
      .map(([topic, bookings]) => ({
        topic,
        bookings,
        percentage: totalBookings > 0 
          ? `${Math.round((bookings / totalBookings) * 100)}%`
          : '0%'
      }))
      .sort((a, b) => b.bookings - a.bookings)
      .slice(0, 5);

    return topics;
  };

  // Calculate user journey drop-off points
  const fetchUserJourneyDropOffs = async (): Promise<UserJourneyDropOff[]> => {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    // Get users who registered in the last 30 days
    const { count: newRegistrations } = await supabase
      .from('users')
      .select('id', { count: 'exact', head: true })
      .gte('created_at', thirtyDaysAgo.toISOString())
      .in('role', ['student']);

    // Get users who completed their profiles (have non-null fields)
    const { count: completedProfiles } = await supabase
      .from('users')
      .select('id', { count: 'exact', head: true })
      .gte('created_at', thirtyDaysAgo.toISOString())
      .in('role', ['student'])
      .not('name', 'is', null);

    // Get users who made their first search/booking attempt
    const { data: usersWithBookings } = await supabase
      .from('service_bookings')
      .select('client_id')
      .gte('created_at', thirtyDaysAgo.toISOString());

    const uniqueBookingUsers = new Set((usersWithBookings || []).map(b => b.client_id)).size;

    // Get users who completed actual sessions
    const { data: usersWithCompletedSessions } = await supabase
      .from('service_bookings')
      .select('client_id')
      .gte('created_at', thirtyDaysAgo.toISOString())
      .eq('status', 'completed');

    const uniqueCompletedUsers = new Set((usersWithCompletedSessions || []).map(b => b.client_id)).size;

    // Calculate drop-off rates and numbers
    const profileDropOff = newRegistrations && newRegistrations > 0
      ? Math.round(((newRegistrations - (completedProfiles || 0)) / newRegistrations) * 100)
      : 0;

    const searchDropOff = completedProfiles && completedProfiles > 0
      ? Math.round(((completedProfiles - uniqueBookingUsers) / completedProfiles) * 100)
      : 0;

    const bookingDropOff = uniqueBookingUsers > 0
      ? Math.round(((uniqueBookingUsers - uniqueCompletedUsers) / uniqueBookingUsers) * 100)
      : 0;

    return [
      {
        stage: "Registration to Profile Completion",
        dropoff: `${profileDropOff}%`,
        users: (newRegistrations || 0) - (completedProfiles || 0)
      },
      {
        stage: "Profile to First Search",
        dropoff: `${searchDropOff}%`,
        users: (completedProfiles || 0) - uniqueBookingUsers
      },
      {
        stage: "Search to Booking",
        dropoff: `${Math.max(0, 35)}%`, // Placeholder for actual booking conversion
        users: Math.max(0, Math.round(uniqueBookingUsers * 0.35))
      },
      {
        stage: "Booking to Session",
        dropoff: `${bookingDropOff}%`,
        users: uniqueBookingUsers - uniqueCompletedUsers
      }
    ];
  };

  // Main data fetching function
  const fetchAnalyticsData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [
        engagementData,
        researchers,
        researchAids,
        topics,
        dropOffs
      ] = await Promise.all([
        fetchEngagementMetrics(),
        fetchTopResearchers(),
        fetchTopResearchAids(),
        fetchPopularTopics(),
        fetchUserJourneyDropOffs()
      ]);

      setEngagementMetrics(engagementData);
      setTopResearchers(researchers);
      setTopResearchAids(researchAids);
      setPopularTopics(topics);
      setUserJourneyDropOffs(dropOffs);

    } catch (err: any) {
      console.error('Error fetching analytics data:', err);
      setError(err.message || 'Failed to fetch analytics data');
      toast({
        title: "Error",
        description: "Failed to load analytics data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Refresh function for manual data refresh
  const refreshData = useCallback(async () => {
    await fetchAnalyticsData();
  }, [fetchAnalyticsData]);

  // Initial data fetch
  useEffect(() => {
    if (user && isAdmin) {
      fetchAnalyticsData();
    } else if (user && !isAdmin) {
      setError('Access denied. Admin privileges required.');
      setLoading(false);
    }
  }, [user, isAdmin, fetchAnalyticsData]);

  return {
    engagementMetrics,
    topResearchers,
    topResearchAids,
    popularTopics,
    userJourneyDropOffs,
    loading,
    error,
    refreshData,
  };
};
