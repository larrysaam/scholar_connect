import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/use-toast';

export interface PlatformMetrics {
  totalUsers: number;
  totalStudents: number;
  totalResearchers: number;
  totalResearchAids: number;
  activeConsultationsToday: number;
  activeConsultationsWeek: number;
  revenueDaily: number;
  revenueWeekly: number;
  revenueMonthly: number;
  newSignupsWeek: number;
  averageDailyConsultations: number;
  userSatisfactionRate: number;
  taskCompletionRate: number;
  paymentSuccessRate: number;
}

export interface SystemAlert {
  type: 'payment' | 'verification' | 'content' | 'security' | 'system';
  message: string;
  severity: 'low' | 'medium' | 'high';
  count?: number;
  actionUrl?: string;
}

export interface RecentActivity {
  id: string;
  user: string;
  action: string;
  time: string;
  type: 'consultation' | 'registration' | 'task' | 'payment' | 'verification';
  timestamp: string;
}

export interface AdminDashboardData {
  platformMetrics: PlatformMetrics;
  systemAlerts: SystemAlert[];
  recentActivity: RecentActivity[];
  loading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
}

export const useAdminDashboard = (): AdminDashboardData => {
  const { user } = useAuth();
  const { toast } = useToast();
    // Check if user is admin - check multiple possible locations for role
  const isAdmin = useMemo(() => {
    if (!user) return false;
    return user?.user_metadata?.role === 'admin' || 
           user?.role === 'admin' || 
           (user as any)?.app_metadata?.role === 'admin';
  }, [user]);
  const [platformMetrics, setPlatformMetrics] = useState<PlatformMetrics>({
    totalUsers: 0,
    totalStudents: 0,
    totalResearchers: 0,
    totalResearchAids: 0,
    activeConsultationsToday: 0,
    activeConsultationsWeek: 0,
    revenueDaily: 0,
    revenueWeekly: 0,
    revenueMonthly: 0,
    newSignupsWeek: 0,
    averageDailyConsultations: 0,
    userSatisfactionRate: 0,
    taskCompletionRate: 0,
    paymentSuccessRate: 0,
  });
  const [systemAlerts, setSystemAlerts] = useState<SystemAlert[]>([]);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Fetch user counts by role
  const fetchUserMetrics = async () => {
    const { data: users, error } = await supabase
      .from('users')
      .select('role, created_at');    if (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
    
    const totalUsers = users?.length || 0;
    const roleBreakdown = (users || []).reduce((acc: Record<string, number>, user) => {
      acc[user.role] = (acc[user.role] || 0) + 1;
      return acc;
    }, {});// Calculate new signups in the last week
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      const newSignupsWeek = (users || []).filter(user => 
      user.created_at && new Date(user.created_at) >= oneWeekAgo
    ).length;

    return {
      totalUsers,
      totalStudents: roleBreakdown.student || 0,
      totalResearchers: roleBreakdown.expert || 0,
      totalResearchAids: roleBreakdown.aid || 0,
      newSignupsWeek,
    };
  };

  // Fetch consultation/booking metrics
  const fetchConsultationMetrics = async () => {
    const today = new Date();
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    // Active consultations today
    const { count: activeConsultationsToday } = await supabase
      .from('service_bookings')
      .select('id', { count: 'exact', head: true })
      .gte('scheduled_date', startOfToday.toISOString().split('T')[0])
      .lt('scheduled_date', new Date(startOfToday.getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0])
      .in('status', ['confirmed', 'completed']);

    // Active consultations this week
    const { count: activeConsultationsWeek } = await supabase
      .from('service_bookings')
      .select('id', { count: 'exact', head: true })
      .gte('scheduled_date', oneWeekAgo.toISOString().split('T')[0])
      .in('status', ['confirmed', 'completed']);

    // Calculate average daily consultations (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { count: consultationsLast30Days } = await supabase
      .from('service_bookings')
      .select('id', { count: 'exact', head: true })
      .gte('scheduled_date', thirtyDaysAgo.toISOString().split('T')[0])
      .in('status', ['confirmed', 'completed']);

    const averageDailyConsultations = Math.round((consultationsLast30Days || 0) / 30 * 10) / 10;

    return {
      activeConsultationsToday: activeConsultationsToday || 0,
      activeConsultationsWeek: activeConsultationsWeek || 0,
      averageDailyConsultations,
    };
  };

  // Fetch revenue metrics
  const fetchRevenueMetrics = async () => {
    const today = new Date();
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    // Revenue from completed service bookings
    const { data: dailyBookings } = await supabase
      .from('service_bookings')
      .select('total_price')
      .gte('scheduled_date', startOfToday.toISOString().split('T')[0])
      .lt('scheduled_date', new Date(startOfToday.getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0])
      .eq('status', 'completed')
      .eq('payment_status', 'paid');

    const { data: weeklyBookings } = await supabase
      .from('service_bookings')
      .select('total_price')
      .gte('scheduled_date', oneWeekAgo.toISOString().split('T')[0])
      .eq('status', 'completed')
      .eq('payment_status', 'paid');

    const { data: monthlyBookings } = await supabase
      .from('service_bookings')
      .select('total_price')
      .gte('scheduled_date', oneMonthAgo.toISOString().split('T')[0])
      .eq('status', 'completed')
      .eq('payment_status', 'paid');    // Revenue from completed jobs (handle both 'completed' status and potential null budgets)
    const { data: dailyJobs } = await supabase
      .from('jobs')
      .select('budget')
      .gte('created_at', startOfToday.toISOString())
      .lt('created_at', new Date(startOfToday.getTime() + 24 * 60 * 60 * 1000).toISOString())
      .in('status', ['completed', 'finished']) // Handle different completion status values
      .not('budget', 'is', null);

    const { data: weeklyJobs } = await supabase
      .from('jobs')
      .select('budget')
      .gte('created_at', oneWeekAgo.toISOString())
      .in('status', ['completed', 'finished'])
      .not('budget', 'is', null);

    const { data: monthlyJobs } = await supabase
      .from('jobs')
      .select('budget')
      .gte('created_at', oneMonthAgo.toISOString())
      .in('status', ['completed', 'finished'])
      .not('budget', 'is', null);

    const revenueDaily = (dailyBookings || []).reduce((sum, b) => sum + (b.total_price || 0), 0) +
                        (dailyJobs || []).reduce((sum, j) => sum + (j.budget || 0), 0);
                        
    const revenueWeekly = (weeklyBookings || []).reduce((sum, b) => sum + (b.total_price || 0), 0) +
                         (weeklyJobs || []).reduce((sum, j) => sum + (j.budget || 0), 0);
                         
    const revenueMonthly = (monthlyBookings || []).reduce((sum, b) => sum + (b.total_price || 0), 0) +
                          (monthlyJobs || []).reduce((sum, j) => sum + (j.budget || 0), 0);

    return {
      revenueDaily,
      revenueWeekly,
      revenueMonthly,
    };
  };

  // Fetch quality metrics
  const fetchQualityMetrics = async () => {
    // User satisfaction from researcher reviews
    const { data: reviews } = await supabase
      .from('researcher_reviews')
      .select('rating')
      .eq('is_public', true);

    const userSatisfactionRate = reviews && reviews.length > 0 
      ? Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length / 5) * 100)
      : 0;

    // Task completion rate
    const { count: totalJobs } = await supabase
      .from('jobs')
      .select('id', { count: 'exact', head: true });

    const { count: completedJobs } = await supabase
      .from('jobs')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'completed');

    const taskCompletionRate = totalJobs && totalJobs > 0 
      ? Math.round(((completedJobs || 0) / totalJobs) * 100)
      : 0;

    // Payment success rate from transactions
    const { count: totalPayments } = await supabase
      .from('service_bookings')
      .select('id', { count: 'exact', head: true })
      .neq('payment_status', 'pending');

    const { count: successfulPayments } = await supabase
      .from('service_bookings')
      .select('id', { count: 'exact', head: true })
      .eq('payment_status', 'paid');

    const paymentSuccessRate = totalPayments && totalPayments > 0
      ? Math.round(((successfulPayments || 0) / totalPayments) * 100)
      : 0;

    return {
      userSatisfactionRate,
      taskCompletionRate,
      paymentSuccessRate,
    };
  };

  // Fetch system alerts
  const fetchSystemAlerts = async () => {
    const alerts: SystemAlert[] = [];

    // Failed payments
    const { count: failedPayments } = await supabase
      .from('service_bookings')
      .select('id', { count: 'exact', head: true })
      .eq('payment_status', 'failed');

    if (failedPayments && failedPayments > 0) {
      alerts.push({
        type: 'payment',
        message: `${failedPayments} failed payments requiring attention`,
        severity: failedPayments > 10 ? 'high' : failedPayments > 5 ? 'medium' : 'low',
        count: failedPayments,
        actionUrl: '/admin?tab=payments'
      });
    }    // Pending researcher verifications
    const { data: verificationData } = await supabase
      .from('researcher_profiles')
      .select('verifications')
      .not('verifications', 'is', null);

    const pendingVerifications = verificationData?.filter(profile => 
      profile.verifications && 
      typeof profile.verifications === 'object' &&
      (profile.verifications as any).academic === 'pending'
    ).length || 0;

    if (pendingVerifications && pendingVerifications > 0) {
      alerts.push({
        type: 'verification',
        message: `${pendingVerifications} researcher profiles pending verification`,
        severity: pendingVerifications > 20 ? 'high' : pendingVerifications > 10 ? 'medium' : 'low',
        count: pendingVerifications,
        actionUrl: '/admin?tab=verification'
      });
    }

    // Flagged content (using a placeholder as no direct flagging system exists)
    const { count: cancelledBookings } = await supabase
      .from('service_bookings')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'cancelled')
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

    if (cancelledBookings && cancelledBookings > 5) {
      alerts.push({
        type: 'content',
        message: `${cancelledBookings} consultation cancellations today requiring review`,
        severity: 'medium',
        count: cancelledBookings,
        actionUrl: '/admin?tab=consultations'
      });
    }

    return alerts;
  };

  // Fetch recent activity
  const fetchRecentActivity = async () => {
    const activities: RecentActivity[] = [];

    // Recent completed consultations
    const { data: recentConsultations } = await supabase
      .from('service_bookings')
      .select(`
        id,
        created_at,
        status,
        client:users!service_bookings_client_id_fkey(name),
        provider:users!service_bookings_provider_id_fkey(name)
      `)
      .eq('status', 'completed')
      .order('created_at', { ascending: false })
      .limit(3);

    recentConsultations?.forEach(consultation => {
      activities.push({
        id: consultation.id,
        user: consultation.provider?.name || 'Unknown Provider',
        action: `Completed consultation with ${consultation.client?.name || 'student'}`,
        time: getTimeAgo(consultation.created_at),
        type: 'consultation',
        timestamp: consultation.created_at
      });
    });

    // Recent user registrations
    const { data: recentUsers } = await supabase
      .from('users')
      .select('id, name, role, created_at')
      .order('created_at', { ascending: false })
      .limit(3);

    recentUsers?.forEach(user => {
      activities.push({
        id: user.id,
        user: user.name || 'New User',
        action: `New ${user.role} registration`,
        time: getTimeAgo(user.created_at),
        type: 'registration',
        timestamp: user.created_at
      });
    });

    // Recent job completions
    const { data: recentJobs } = await supabase
      .from('jobs')
      .select(`
        id,
        title,
        updated_at,
        client:users(name)
      `)
      .eq('status', 'completed')
      .order('updated_at', { ascending: false })
      .limit(2);

    recentJobs?.forEach(job => {
      activities.push({
        id: job.id,
        user: `Research Aid`,
        action: `Completed job: ${job.title}`,
        time: getTimeAgo(job.updated_at),
        type: 'task',
        timestamp: job.updated_at
      });
    });

    // Sort all activities by timestamp and return top 5
    return activities
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 5);
  };

  // Helper function to calculate time ago
  const getTimeAgo = (timestamp: string): string => {
    const now = new Date();
    const past = new Date(timestamp);
    const diffMs = now.getTime() - past.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else {
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      return `${Math.max(1, diffMinutes)} minute${diffMinutes > 1 ? 's' : ''} ago`;
    }
  };

  // Main data fetching function
  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [
        userMetrics,
        consultationMetrics,
        revenueMetrics,
        qualityMetrics,
        alerts,
        activity
      ] = await Promise.all([
        fetchUserMetrics(),
        fetchConsultationMetrics(),
        fetchRevenueMetrics(),
        fetchQualityMetrics(),
        fetchSystemAlerts(),
        fetchRecentActivity()
      ]);

      setPlatformMetrics({
        ...userMetrics,
        ...consultationMetrics,
        ...revenueMetrics,
        ...qualityMetrics,
      });

      setSystemAlerts(alerts);
      setRecentActivity(activity);
    } catch (err: any) {
      console.error('Error fetching admin dashboard data:', err);
      setError(err.message || 'Failed to fetch dashboard data');
      toast({
        title: "Error",
        description: "Failed to load dashboard data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Refresh function for manual data refresh
  const refreshData = useCallback(async () => {
    await fetchDashboardData();
  }, [fetchDashboardData]);
  // Initial data fetch
  useEffect(() => {
    if (user && isAdmin) {
      fetchDashboardData();
    } else if (user && !isAdmin) {
      setError('Access denied. Admin privileges required.');
      setLoading(false);
    }
  }, [user, isAdmin, fetchDashboardData]);

  return {
    platformMetrics,
    systemAlerts,
    recentActivity,
    loading,
    error,
    refreshData,
  };
};
