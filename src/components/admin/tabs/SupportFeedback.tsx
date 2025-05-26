
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, AlertCircle, TrendingUp, Clock } from "lucide-react";

const SupportFeedback = () => {
  const supportTickets = [
    {
      id: "TICK-001",
      user: "John Doe",
      subject: "Payment issue with consultation booking",
      priority: "high",
      status: "open",
      assignedTo: "Support Team",
      createdDate: "2024-01-20 09:30",
      lastUpdate: "2024-01-20 14:15"
    },
    {
      id: "TICK-002",
      user: "Sarah Wilson",
      subject: "Unable to upload research documents",
      priority: "medium",
      status: "in_progress",
      assignedTo: "Tech Support",
      createdDate: "2024-01-19 16:45",
      lastUpdate: "2024-01-20 10:20"
    },
    {
      id: "TICK-003",
      user: "Dr. Marie Ngono",
      subject: "Profile verification documents rejected",
      priority: "medium",
      status: "resolved",
      assignedTo: "Verification Team",
      createdDate: "2024-01-18 11:20",
      lastUpdate: "2024-01-19 15:30"
    }
  ];

  const feedbackSubmissions = [
    {
      id: 1,
      user: "Alice Johnson",
      type: "Feature Request",
      subject: "Mobile app for easier access",
      rating: null,
      sentiment: "positive",
      status: "under_review",
      submittedDate: "2024-01-19"
    },
    {
      id: 2,
      user: "Bob Smith",
      type: "Complaint",
      subject: "Researcher was unprofessional during session",
      rating: 2,
      sentiment: "negative",
      status: "investigating",
      submittedDate: "2024-01-18"
    },
    {
      id: 3,
      user: "Emma Wilson",
      type: "General Feedback",
      subject: "Great platform, very helpful for my research",
      rating: 5,
      sentiment: "positive",
      status: "acknowledged",
      submittedDate: "2024-01-17"
    }
  ];

  const satisfactionTrends = [
    { period: "This Week", rating: 4.7, responses: 67, change: "+0.2" },
    { period: "Last Week", rating: 4.5, responses: 54, change: "-0.1" },
    { period: "This Month", rating: 4.6, responses: 234, change: "+0.3" },
    { period: "Last Month", rating: 4.3, responses: 198, change: "+0.1" }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Support & Feedback Management</h2>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Tickets</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">3 high priority</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Response Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.3h</div>
            <p className="text-xs text-muted-foreground">-15min from last week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customer Satisfaction</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.7/5</div>
            <p className="text-xs text-muted-foreground">+0.2 this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolution Rate</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94%</div>
            <p className="text-xs text-muted-foreground">Within 24 hours</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="tickets" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="tickets">Support Tickets</TabsTrigger>
          <TabsTrigger value="feedback">User Feedback</TabsTrigger>
          <TabsTrigger value="satisfaction">Satisfaction Trends</TabsTrigger>
        </TabsList>
        
        <TabsContent value="tickets" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertCircle className="mr-2 h-5 w-5" />
                Support Ticket Queue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ticket ID</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Assigned To</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {supportTickets.map((ticket) => (
                    <TableRow key={ticket.id}>
                      <TableCell className="font-mono">{ticket.id}</TableCell>
                      <TableCell>{ticket.user}</TableCell>
                      <TableCell className="max-w-xs truncate">{ticket.subject}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={
                            ticket.priority === "high" ? "destructive" : 
                            ticket.priority === "medium" ? "default" : 
                            "secondary"
                          }
                        >
                          {ticket.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={
                            ticket.status === "open" ? "destructive" : 
                            ticket.status === "in_progress" ? "default" : 
                            "secondary"
                          }
                        >
                          {ticket.status.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>{ticket.assignedTo}</TableCell>
                      <TableCell>{ticket.createdDate}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">View</Button>
                          <Button size="sm" variant="outline">Assign</Button>
                          {ticket.status !== "resolved" && (
                            <Button size="sm">Resolve</Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="feedback" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageSquare className="mr-2 h-5 w-5" />
                User Feedback & Complaints
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Sentiment</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {feedbackSubmissions.map((feedback) => (
                    <TableRow key={feedback.id}>
                      <TableCell>{feedback.user}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{feedback.type}</Badge>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">{feedback.subject}</TableCell>
                      <TableCell>
                        {feedback.rating ? `${feedback.rating}/5 ⭐` : "N/A"}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={
                            feedback.sentiment === "positive" ? "default" : 
                            feedback.sentiment === "negative" ? "destructive" : 
                            "secondary"
                          }
                        >
                          {feedback.sentiment}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{feedback.status.replace('_', ' ')}</Badge>
                      </TableCell>
                      <TableCell>{feedback.submittedDate}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">View</Button>
                          <Button size="sm" variant="outline">Respond</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="satisfaction" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="mr-2 h-5 w-5" />
                Customer Satisfaction Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {satisfactionTrends.map((trend, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <h4 className="font-semibold">{trend.period}</h4>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-2xl font-bold">{trend.rating}/5</span>
                        <Badge 
                          variant={trend.change.startsWith('+') ? "default" : "destructive"}
                        >
                          {trend.change}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{trend.responses} responses</p>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold">Common Complaint Categories</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Payment Issues</span>
                        <span className="font-semibold">28%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Session Quality</span>
                        <span className="font-semibold">22%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Technical Problems</span>
                        <span className="font-semibold">18%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Booking Issues</span>
                        <span className="font-semibold">15%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Other</span>
                        <span className="font-semibold">17%</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold">Positive Feedback Highlights</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Researcher Quality</span>
                        <span className="font-semibold">89%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Platform Ease of Use</span>
                        <span className="font-semibold">84%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Support Response</span>
                        <span className="font-semibold">92%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Value for Money</span>
                        <span className="font-semibold">78%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SupportFeedback;
