
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { MessageSquare, AlertCircle, TrendingUp, Clock, RefreshCw } from "lucide-react";
import { useSupportFeedback } from "@/hooks/useSupportFeedback";

const SupportFeedback = () => {
  const {
    supportTickets,
    feedbackSubmissions,
    satisfactionTrends,
    complaintCategories,
    positiveFeedbackHighlights,
    supportMetrics,
    loading,
    error,
    refreshData,
    resolveTicket,
    respondToFeedback
  } = useSupportFeedback();
  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Support & Feedback Management</h2>
          <Button onClick={refreshData} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
        <Card>
          <CardContent className="flex items-center justify-center h-32">
            <div className="text-center">
              <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Failed to load support data</p>
              <p className="text-xs text-red-500">{error}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Support & Feedback Management</h2>
        <Button onClick={refreshData} variant="outline" size="sm" disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh Data
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Tickets</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <>
                <Skeleton className="h-8 w-16 mb-1" />
                <Skeleton className="h-4 w-24" />
              </>
            ) : (
              <>
                <div className="text-2xl font-bold">{supportMetrics.openTickets}</div>
                <p className="text-xs text-muted-foreground">
                  {supportMetrics.highPriorityTickets} high priority
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Response Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <>
                <Skeleton className="h-8 w-16 mb-1" />
                <Skeleton className="h-4 w-32" />
              </>
            ) : (
              <>
                <div className="text-2xl font-bold">{supportMetrics.avgResponseTime}</div>
                <p className="text-xs text-muted-foreground">-15min from last week</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customer Satisfaction</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <>
                <Skeleton className="h-8 w-20 mb-1" />
                <Skeleton className="h-4 w-24" />
              </>
            ) : (
              <>
                <div className="text-2xl font-bold">{supportMetrics.customerSatisfaction}/5</div>
                <p className="text-xs text-muted-foreground">{supportMetrics.satisfactionChange} this week</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolution Rate</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <>
                <Skeleton className="h-8 w-16 mb-1" />
                <Skeleton className="h-4 w-28" />
              </>
            ) : (
              <>
                <div className="text-2xl font-bold">{supportMetrics.resolutionRate}%</div>
                <p className="text-xs text-muted-foreground">Within 24 hours</p>
              </>
            )}
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
                </TableHeader>                <TableBody>
                  {loading ? (
                    // Loading skeleton rows
                    Array.from({ length: 3 }).map((_, index) => (
                      <TableRow key={index}>
                        <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Skeleton className="h-8 w-12" />
                            <Skeleton className="h-8 w-16" />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : supportTickets.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8">
                        <div className="text-muted-foreground">
                          <AlertCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                          <p>No support tickets found</p>
                          <p className="text-sm">All issues have been resolved!</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    supportTickets.map((ticket) => (
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
                              <Button 
                                size="sm" 
                                onClick={() => resolveTicket(ticket.id)}
                              >
                                Resolve
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
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
                </TableHeader>                <TableBody>
                  {loading ? (
                    // Loading skeleton rows
                    Array.from({ length: 5 }).map((_, index) => (
                      <TableRow key={index}>
                        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Skeleton className="h-8 w-12" />
                            <Skeleton className="h-8 w-16" />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : feedbackSubmissions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8">
                        <div className="text-muted-foreground">
                          <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                          <p>No feedback submissions found</p>
                          <p className="text-sm">Check back later for user feedback</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    feedbackSubmissions.map((feedback) => (
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
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => respondToFeedback(feedback.id, "Thank you for your feedback!")}
                            >
                              Respond
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
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
            <CardContent>              <div className="space-y-6">
                {loading ? (
                  <>
                    {/* Loading skeleton for satisfaction trends */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {Array.from({ length: 4 }).map((_, index) => (
                        <div key={index} className="p-4 border rounded-lg">
                          <Skeleton className="h-5 w-20 mb-2" />
                          <div className="flex items-center justify-between mt-2">
                            <Skeleton className="h-8 w-16" />
                            <Skeleton className="h-5 w-10" />
                          </div>
                          <Skeleton className="h-4 w-24 mt-2" />
                        </div>
                      ))}
                    </div>
                    
                    {/* Loading skeleton for categories */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <Skeleton className="h-5 w-48" />
                        <div className="space-y-2">
                          {Array.from({ length: 5 }).map((_, index) => (
                            <div key={index} className="flex justify-between">
                              <Skeleton className="h-4 w-32" />
                              <Skeleton className="h-4 w-8" />
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <Skeleton className="h-5 w-48" />
                        <div className="space-y-2">
                          {Array.from({ length: 4 }).map((_, index) => (
                            <div key={index} className="flex justify-between">
                              <Skeleton className="h-4 w-36" />
                              <Skeleton className="h-4 w-8" />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
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
                          {complaintCategories.map((category, index) => (
                            <div key={index} className="flex justify-between">
                              <span>{category.category}</span>
                              <span className="font-semibold">{category.percentage}%</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-semibold">Positive Feedback Highlights</h4>
                        <div className="space-y-2">
                          {positiveFeedbackHighlights.map((highlight, index) => (
                            <div key={index} className="flex justify-between">
                              <span>{highlight.category}</span>
                              <span className="font-semibold">{highlight.percentage}%</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SupportFeedback;
