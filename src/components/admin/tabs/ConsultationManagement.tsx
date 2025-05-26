
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User, FileText } from "lucide-react";

const ConsultationManagement = () => {
  const upcomingSessions = [
    {
      id: 1,
      student: "John Doe",
      researcher: "Dr. Marie Ngono",
      topic: "GIS Data Analysis",
      datetime: "2024-01-20 14:00",
      duration: "2 hours",
      status: "confirmed",
      amount: "15,000 XAF"
    },
    {
      id: 2,
      student: "Sarah Wilson",
      researcher: "Prof. James Akinyemi",
      topic: "Epidemiological Study Design",
      datetime: "2024-01-20 16:00",
      duration: "1.5 hours",
      status: "pending",
      amount: "18,000 XAF"
    }
  ];

  const recentFeedback = [
    {
      id: 1,
      student: "Alice Johnson",
      researcher: "Dr. Fatima Al-Rashid",
      session: "Machine Learning Consultation",
      rating: 5,
      feedback: "Excellent session, very helpful with my research methodology.",
      flagged: false
    },
    {
      id: 2,
      student: "Bob Smith",
      researcher: "Dr. Sarah Osei",
      session: "Economics Research",
      rating: 2,
      feedback: "Session was too short and not very informative.",
      flagged: true
    }
  ];

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
