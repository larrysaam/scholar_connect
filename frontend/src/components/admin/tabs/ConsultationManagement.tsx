
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, FileText, AlertTriangle, RefreshCw, Search, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Session {
  id: string;
  student: string;
  researcher: string;
  topic: string;
  datetime: string;
  duration: string;
  status: string;
  amount: string;
}

interface Feedback {
  id: string;
  student: string;
  researcher: string;
  session: string;
  rating: number;
  comment: string;
  flagged: boolean;
  created_at: string;
}

interface ConsultationStats {
  todaysSessions: {
    total: number;
    completed: number;
    upcoming: number;
  };
  averageRating: number;
  completionRate: number;
  totalReviews: number;
}

const ConsultationManagement = () => {
  const [upcomingSessions, setUpcomingSessions] = useState<Session[]>([]);
  const [recentFeedback, setRecentFeedback] = useState<Feedback[]>([]);
  const [stats, setStats] = useState<ConsultationStats>({
    todaysSessions: { total: 0, completed: 0, upcoming: 0 },
    averageRating: 0,
    completionRate: 0,
    totalReviews: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [timePeriodFilter, setTimePeriodFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [feedbackCurrentPage, setFeedbackCurrentPage] = useState(1);
  const itemsPerPage = 7;

  const fetchConsultationStats = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      // Fetch today's sessions
      const { data: todayBookings, error: todayError } = await supabase
        .from('service_bookings')
        .select('status')
        .eq('scheduled_date', today);

      if (todayError) throw todayError;

      const todaysSessions = {
        total: todayBookings?.length || 0,
        completed: todayBookings?.filter(b => b.status === 'completed').length || 0,
        upcoming: todayBookings?.filter(b => ['pending', 'confirmed'].includes(b.status)).length || 0
      };

      // Fetch average rating from researcher reviews
      const { data: ratingsData, error: ratingsError } = await supabase
        .from('researcher_reviews')
        .select('rating')
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()); // Last 7 days

      if (ratingsError) throw ratingsError;

      const averageRating = ratingsData && ratingsData.length > 0 
        ? ratingsData.reduce((sum, r) => sum + r.rating, 0) / ratingsData.length 
        : 0;

      // Fetch completion rate (last 30 days)
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      const { data: recentBookings, error: recentError } = await supabase
        .from('service_bookings')
        .select('status')
        .gte('scheduled_date', thirtyDaysAgo)
        .lte('scheduled_date', today);

      if (recentError) throw recentError;

      const totalRecentBookings = recentBookings?.length || 0;
      const completedBookings = recentBookings?.filter(b => b.status === 'completed').length || 0;
      const completionRate = totalRecentBookings > 0 ? (completedBookings / totalRecentBookings) * 100 : 0;

      setStats({
        todaysSessions,
        averageRating,
        completionRate,
        totalReviews: ratingsData?.length || 0
      });
    } catch (error) {
      console.error('Error fetching consultation stats:', error);
    }
  };

  // Helper function to get date range based on time period filter
  const getDateRange = (period: string) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    switch (period) {
      case 'today':
        return { 
          start: today.toISOString().split('T')[0],
          end: today.toISOString().split('T')[0]
        };
      case 'week':
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - today.getDay()); // Start of week (Sunday)
        return {
          start: weekStart.toISOString().split('T')[0],
          end: today.toISOString().split('T')[0]
        };
      case 'month':
        const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
        return {
          start: monthStart.toISOString().split('T')[0],
          end: today.toISOString().split('T')[0]
        };
      default:
        return null; // No date filter for 'all'
    }
  };

  const fetchData = async (retryCount = 0) => {
    setLoading(true);
    setError(null);
    try {
      // Get date range for filtering
      const dateRange = getDateRange(timePeriodFilter);
      
      // 1. First, test basic connectivity with timeout
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timeout')), 10000)
      );
      
      const testPromise = supabase
        .from('service_bookings')
        .select('id')
        .limit(1);

      const { data: testData, error: testError } = await Promise.race([
        testPromise,
        timeoutPromise
      ]) as any;

      if (testError) {
        console.error('Supabase connectivity test failed:', testError);
        throw new Error(`Database connection failed: ${testError.message}`);
      }

      // 2. Fetch upcoming sessions (bookings) with simplified query
      let bookingsQuery = supabase
        .from('service_bookings')
        .select(`
          id,
          client_id,
          provider_id,
          service_id,
          scheduled_date,
          scheduled_time,
          duration_minutes,
          total_price,
          status,
          created_at
        `)
        .order('scheduled_date', { ascending: false });

      // Apply date range filter if specified
      if (dateRange) {
        bookingsQuery = bookingsQuery
          .gte('scheduled_date', dateRange.start)
          .lte('scheduled_date', dateRange.end);
      }

      // For upcoming sessions, only show pending/confirmed future sessions
      if (timePeriodFilter === 'all') {
        bookingsQuery = bookingsQuery
          .in('status', ['pending', 'confirmed'])
          .gte('scheduled_date', new Date().toISOString().split('T')[0]);
      }

      const { data: bookingsData, error: bookingsError } = await bookingsQuery;

      if (bookingsError) throw bookingsError;

      // 3. Fetch related data separately to avoid complex joins
      const userIds = [...new Set([
        ...(bookingsData || []).map(b => b.client_id),
        ...(bookingsData || []).map(b => b.provider_id)
      ].filter(Boolean))];

      const serviceIds = [...new Set((bookingsData || []).map(b => b.service_id).filter(Boolean))];

      // Fetch users data
      const { data: usersData } = await supabase
        .from('users')
        .select('id, name')
        .in('id', userIds);

      // Fetch services data
      const { data: servicesData } = await supabase
        .from('consultation_services')
        .select('id, title')
        .in('id', serviceIds);

      // Create lookup maps
      const usersMap = new Map((usersData || []).map(user => [user.id, user]));
      const servicesMap = new Map((servicesData || []).map(service => [service.id, service]));

      const sessionsWithDetails = (bookingsData || []).map(booking => ({
        id: booking.id,
        student: usersMap.get(booking.client_id)?.name || 'Unknown Student',
        researcher: usersMap.get(booking.provider_id)?.name || 'Unknown Researcher',
        topic: servicesMap.get(booking.service_id)?.title || 'Unknown Topic',
        datetime: `${booking.scheduled_date} ${booking.scheduled_time}`,
        duration: `${booking.duration_minutes} minutes`,
        status: booking.status,
        amount: `${booking.total_price?.toLocaleString()} XAF`
      }));
      setUpcomingSessions(sessionsWithDetails);

      // 4. Fetch recent feedback from researcher_reviews table (simplified)
      let feedbackQuery = supabase
        .from('researcher_reviews')
        .select(`
          id,
          rating,
          comment,
          created_at,
          reviewer_id,
          researcher_id
        `)
        .order('created_at', { ascending: false });

      // Apply date range filter to feedback if specified
      if (dateRange) {
        feedbackQuery = feedbackQuery
          .gte('created_at', dateRange.start + 'T00:00:00.000Z')
          .lte('created_at', dateRange.end + 'T23:59:59.999Z');
      }

      const { data: feedbackData, error: feedbackError } = await feedbackQuery;

      if (feedbackError) {
        console.warn("Could not fetch feedback data:", feedbackError.message);
        setRecentFeedback([]);
      } else {
        // Get unique user IDs from feedback
        const feedbackUserIds = [...new Set([
          ...(feedbackData || []).map(f => f.reviewer_id),
          ...(feedbackData || []).map(f => f.researcher_id)
        ].filter(Boolean))];

        // Fetch user names for feedback
        const { data: feedbackUsersData } = await supabase
          .from('users')
          .select('id, name')
          .in('id', feedbackUserIds);

        const feedbackUsersMap = new Map((feedbackUsersData || []).map(user => [user.id, user]));

        const feedbackWithDetails = (feedbackData || []).map(feedback => ({
          id: feedback.id,
          student: feedbackUsersMap.get(feedback.reviewer_id)?.name || 'Unknown Student',
          researcher: feedbackUsersMap.get(feedback.researcher_id)?.name || 'Unknown Researcher',
          session: 'General Consultation', // Generic session name since we don't have booking relationship yet
          rating: feedback.rating,
          comment: feedback.comment || 'No comment provided',
          flagged: feedback.rating < 3, // Flag reviews with rating below 3
          created_at: feedback.created_at
        }));
        setRecentFeedback(feedbackWithDetails);
      }

      // 5. Fetch consultation statistics
      await fetchConsultationStats();

    } catch (err: any) {
      console.error("Error fetching consultation data:", err);
      
      // Retry logic for network failures
      if (retryCount < 2 && (err.message.includes('Failed to fetch') || err.message.includes('timeout'))) {
        console.log(`Retrying fetch attempt ${retryCount + 1}/3...`);
        setTimeout(() => fetchData(retryCount + 1), 1000 * (retryCount + 1));
        return;
      }
      
      setError(err.message || 'Failed to fetch consultation data. Please check your internet connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    setCurrentPage(1); // Reset pagination when filters change
    setFeedbackCurrentPage(1);
  }, [timePeriodFilter]);

  useEffect(() => {
    fetchData();
  }, []);

  // Filter sessions based on search term and status
  const filteredSessions = upcomingSessions.filter(session => {
    const matchesSearch = searchTerm === "" || 
      session.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.researcher.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.topic.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || session.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Filter feedback based on search term and rating
  const filteredFeedback = recentFeedback.filter(feedback => {
    const matchesSearch = searchTerm === "" || 
      feedback.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.researcher.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.session.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRating = ratingFilter === "all" || 
      (ratingFilter === "flagged" && feedback.flagged) ||
      (ratingFilter === "high" && feedback.rating >= 4) ||
      (ratingFilter === "low" && feedback.rating <= 2);
    
    return matchesSearch && matchesRating;
  });

  // Pagination calculations
  const totalSessionPages = Math.ceil(filteredSessions.length / itemsPerPage);
  const startSessionIndex = (currentPage - 1) * itemsPerPage;
  const paginatedSessions = filteredSessions.slice(startSessionIndex, startSessionIndex + itemsPerPage);

  const totalFeedbackPages = Math.ceil(filteredFeedback.length / itemsPerPage);
  const startFeedbackIndex = (feedbackCurrentPage - 1) * itemsPerPage;
  const paginatedFeedback = filteredFeedback.slice(startFeedbackIndex, startFeedbackIndex + itemsPerPage);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  useEffect(() => {
    setFeedbackCurrentPage(1);
  }, [searchTerm, ratingFilter]);

  if (loading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Consultation Management</h2>
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Consultation Management</h2>
        <Button 
          variant="outline" 
          onClick={fetchData} 
          disabled={loading}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Search and Filter Controls */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search sessions, students, or researchers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Select value={timePeriodFilter} onValueChange={setTimePeriodFilter}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Time period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          <Select value={ratingFilter} onValueChange={setRatingFilter}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Filter by rating" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Ratings</SelectItem>
              <SelectItem value="high">High (4-5 ⭐)</SelectItem>
              <SelectItem value="low">Low (1-2 ⭐)</SelectItem>
              <SelectItem value="flagged">Flagged</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Upcoming Sessions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="mr-2 h-5 w-5" />
            Upcoming Sessions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Researcher</TableHead>
                <TableHead>Topic</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Amount</TableHead>
              
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedSessions.map((session) => (
                <TableRow key={session.id}>
                  <TableCell>{session.student}</TableCell>
                  <TableCell>{session.researcher}</TableCell>
                  <TableCell>{session.topic}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Clock className="mr-1 h-3 w-3" />
                      {new Date(session.datetime).toLocaleString()}
                    </div>
                  </TableCell>
                  <TableCell>{session.duration}</TableCell>
                  <TableCell>
                    <Badge variant={session.status === "confirmed" ? "default" : "secondary"}>
                      {session.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{session.amount}</TableCell>
                 
                </TableRow>
              ))}
            </TableBody>
            {filteredSessions.length === 0 && upcomingSessions.length > 0 && (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  No sessions match your current filters.
                </TableCell>
              </TableRow>
            )}
            {upcomingSessions.length === 0 && !loading && (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  No upcoming sessions found. Sessions will appear here when students book consultations.
                </TableCell>
              </TableRow>
            )}
          </Table>
          
          {/* Sessions Pagination */}
          {totalSessionPages > 1 && (
            <div className="flex items-center justify-between px-4 py-4 border-t">
              <div className="text-sm text-muted-foreground">
                Showing {startSessionIndex + 1} to {Math.min(startSessionIndex + itemsPerPage, filteredSessions.length)} of {filteredSessions.length} sessions
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="flex items-center gap-1"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <span className="text-sm font-medium px-3 py-1 bg-muted rounded">
                  {currentPage} / {totalSessionPages}
                </span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setCurrentPage(prev => Math.min(totalSessionPages, prev + 1))}
                  disabled={currentPage === totalSessionPages}
                  className="flex items-center gap-1"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quality Assurance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="mr-2 h-5 w-5" />
            Session Feedback & Quality Review
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Researcher</TableHead>
                <TableHead>Session</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Feedback</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedFeedback.map((feedback) => (
                <TableRow key={feedback.id}>
                  <TableCell>{feedback.student}</TableCell>
                  <TableCell>{feedback.researcher}</TableCell>
                  <TableCell>{feedback.session}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {feedback.rating}/5 ⭐
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">{feedback.comment}</TableCell>
                  <TableCell>
                    <Badge variant={feedback.flagged ? "destructive" : "default"}>
                      {feedback.flagged ? "Flagged" : "Normal"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => {
                          // Create a modal or toast with full feedback details
                          alert(`Full feedback from ${feedback.student}:\n\nRating: ${feedback.rating}/5\nComment: ${feedback.comment}\nDate: ${new Date(feedback.created_at).toLocaleString()}`);
                        }}
                      >
                        View Details
                      </Button>
                      {feedback.flagged && (
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => {
                            alert(`Low rating alert!\n\nThis review has a rating of ${feedback.rating}/5 and may need investigation.\n\nStudent: ${feedback.student}\nResearcher: ${feedback.researcher}\nSession: ${feedback.session}`);
                          }}
                        >
                          Investigate
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            {filteredFeedback.length === 0 && recentFeedback.length > 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No feedback matches your current filters.
                </TableCell>
              </TableRow>
            )}
            {recentFeedback.length === 0 && !loading && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No recent feedback found. Feedback will appear here when students rate their consultations.
                </TableCell>
              </TableRow>
            )}
          </Table>
          
          {/* Feedback Pagination */}
          {totalFeedbackPages > 1 && (
            <div className="flex items-center justify-between px-4 py-4 border-t">
              <div className="text-sm text-muted-foreground">
                Showing {startFeedbackIndex + 1} to {Math.min(startFeedbackIndex + itemsPerPage, filteredFeedback.length)} of {filteredFeedback.length} feedback items
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setFeedbackCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={feedbackCurrentPage === 1}
                  className="flex items-center gap-1"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <span className="text-sm font-medium px-3 py-1 bg-muted rounded">
                  {feedbackCurrentPage} / {totalFeedbackPages}
                </span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setFeedbackCurrentPage(prev => Math.min(totalFeedbackPages, prev + 1))}
                  disabled={feedbackCurrentPage === totalFeedbackPages}
                  className="flex items-center gap-1"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Platform Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Today's Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.todaysSessions.total}</div>
            <p className="text-sm text-gray-600">
              {stats.todaysSessions.completed} completed, {stats.todaysSessions.upcoming} upcoming
            </p>
          </CardContent>
        </Card>

        {/* <Card>
          <CardHeader>
            <CardTitle className="text-sm">Average Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.averageRating > 0 ? `${stats.averageRating.toFixed(1)}/5` : 'N/A'}
            </div>
            <p className="text-sm text-gray-600">
              Based on {stats.totalReviews} reviews this week
            </p>
          </CardContent>
        </Card> */}

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Completion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.completionRate > 0 ? `${stats.completionRate.toFixed(1)}%` : 'N/A'}
            </div>
            <p className="text-sm text-gray-600">Sessions completed successfully (last 30 days)</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ConsultationManagement;
