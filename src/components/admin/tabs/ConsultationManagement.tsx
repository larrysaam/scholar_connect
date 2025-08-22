
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, FileText, AlertTriangle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

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
  id: number;
  student: string;
  researcher: string;
  session: string;
  rating: number;
  feedback: string;
  flagged: boolean;
}

const ConsultationManagement = () => {
  const [upcomingSessions, setUpcomingSessions] = useState<Session[]>([]);
  const [recentFeedback, setRecentFeedback] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // 1. Fetch upcoming sessions (bookings)
        const { data: bookingsData, error: bookingsError } = await supabase
          .from('service_bookings')
          .select('*')
          .in('status', ['pending', 'confirmed'])
          .gte('scheduled_date', new Date().toISOString().split('T')[0])
          .order('scheduled_date', { ascending: true });

          console.log("Bookings Data:", bookingsData);
          console.log("Bookings Error:", bookingsError);

        if (bookingsError) throw bookingsError;

        const sessionsWithDetails = await Promise.all(
          (bookingsData || []).map(async (booking) => {
            const [
              { data: studentData },
              { data: researcherData },
              { data: serviceData }
            ] = await Promise.all([
              supabase.from('users').select('name').eq('id', booking.user_id).single(),
              supabase.from('users').select('name').eq('id', booking.provider_id).single(),
              supabase.from('consultation_services').select('title').eq('id', booking.service_id).single()
            ]);

            return {
              id: booking.id,
              student: studentData?.name || 'Unknown Student',
              researcher: researcherData?.name || 'Unknown Researcher',
              topic: serviceData?.title || 'Unknown Topic',
              datetime: `${booking.scheduled_date} ${booking.scheduled_time}`,
              duration: `${booking.duration_minutes} minutes`,
              status: booking.status,
              amount: `${booking.total_price.toLocaleString()} XAF`
            };
          })
        );
        setUpcomingSessions(sessionsWithDetails);

        // 2. Fetch recent feedback (assuming a 'session_feedback' table)
        const { data: feedbackData, error: feedbackError } = await supabase
          .from('session_feedback')
          .select('*, service_bookings(*)')
          .order('created_at', { ascending: false })
          .limit(5);

        if (feedbackError) {
          console.warn("Could not fetch feedback data. This may be expected if the table doesn't exist or is empty.", feedbackError.message);
          setRecentFeedback([]);
        } else {
          const feedbackWithDetails = await Promise.all(
            (feedbackData || []).map(async (feedback) => {
              if (!feedback.service_bookings) return null;

              const { data: studentData } = await supabase.from('users').select('name').eq('id', feedback.service_bookings.user_id).single();
              const { data: researcherData } = await supabase.from('users').select('name').eq('id', feedback.service_bookings.provider_id).single();
              const { data: serviceData } = await supabase.from('consultation_services').select('title').eq('id', feedback.service_bookings.service_id).single();

              return {
                id: feedback.id,
                student: studentData?.name || 'Unknown Student',
                researcher: researcherData?.name || 'Unknown Researcher',
                session: serviceData?.title || 'Unknown Session',
                rating: feedback.rating,
                feedback: feedback.comment,
                flagged: feedback.is_flagged || false
              };
            })
          );
          setRecentFeedback(feedbackWithDetails.filter((item): item is Feedback => item !== null));
        }
      } catch (err: any) {
        setError(err.message);
        console.error("Error fetching consultation data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
      <h2 className="text-2xl font-bold">Consultation Management</h2>

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
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {upcomingSessions.map((session) => (
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
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">View</Button>
                      <Button size="sm" variant="outline">Reschedule</Button>
                      <Button size="sm" variant="destructive">Cancel</Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            {upcomingSessions.length === 0 && !loading && (
              <TableBody>
                <TableRow><TableCell colSpan={8} className="text-center">No upcoming sessions.</TableCell></TableRow>
              </TableBody>
            )}
          </Table>
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
              {recentFeedback.map((feedback) => (
                <TableRow key={feedback.id}>
                  <TableCell>{feedback.student}</TableCell>
                  <TableCell>{feedback.researcher}</TableCell>
                  <TableCell>{feedback.session}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {feedback.rating}/5 ⭐
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">{feedback.feedback}</TableCell>
                  <TableCell>
                    <Badge variant={feedback.flagged ? "destructive" : "default"}>
                      {feedback.flagged ? "Flagged" : "Normal"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">Review</Button>
                      {feedback.flagged && (
                        <Button size="sm" variant="outline">Investigate</Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            {recentFeedback.length === 0 && !loading && (
              <TableBody>
                <TableRow><TableCell colSpan={7} className="text-center">No recent feedback.</TableCell></TableRow>
              </TableBody>
            )}
          </Table>
        </CardContent>
      </Card>

      {/* Platform Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Today's Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-sm text-gray-600">8 completed, 15 upcoming</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Average Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.7/5</div>
            <p className="text-sm text-gray-600">Based on 156 reviews this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Completion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">96.2%</div>
            <p className="text-sm text-gray-600">Sessions completed successfully</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ConsultationManagement;
