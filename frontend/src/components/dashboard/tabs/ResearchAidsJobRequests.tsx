import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Clock, DollarSign, FileText, Eye, MessageSquare, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useJobManagement, Job, JobApplication } from "@/hooks/useJobManagement"; // Import Job and JobApplication interfaces
import { useAuth } from "@/hooks/useAuth"; // Import useAuth to get current user ID

const ResearchAidsJobRequests = () => {
  const [filter, setFilter] = useState("all");
  const [selectedJob, setSelectedJob] = useState<Job | null>(null); // Use Job interface
  const [applicationMessage, setApplicationMessage] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const { toast } = useToast();
  const { user } = useAuth(); // Get current user
  const { fetchAllJobsForResearchAids, fetchJobApplicationsByUserId, applyForJob, loading } = useJobManagement(); // Use the hook
  const [allJobs, setAllJobs] = useState<Job[]>([]); // State to store all jobs
  const [userApplications, setUserApplications] = useState<JobApplication[]>([]); // State to store user's applications

  useEffect(() => {
    const fetchData = async () => {
      const jobsData = await fetchAllJobsForResearchAids();
      setAllJobs(jobsData);

      if (user) {
        const applicationsData = await fetchJobApplicationsByUserId(user.id); // Corrected function name
        setUserApplications(applicationsData);
      }
    };
    fetchData();
  }, [user]); // Depend on user to refetch when user changes

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active": // Assuming "active" jobs are "pending" for research aids
        return <Badge variant="secondary">Pending Review</Badge>;
      case "paused":
        return <Badge className="bg-blue-600">Invited to Apply</Badge>; // Map to invited for now
      case "completed":
        return <Badge className="bg-green-600">Completed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const filteredJobs = allJobs.filter(job => 
    filter === "all" || job.status === filter
  );

  const handleViewDetails = (job: Job) => { // Use Job interface
    setSelectedJob(job);
  };

  const handleApply = async (jobId: string) => { // Job ID is string
    if (!applicationMessage.trim()) {
      toast({
        title: "Error",
        description: "Please write an application message",
        variant: "destructive"
      });
      return;
    }

    const success = await applyForJob(jobId, applicationMessage);
    if (success) {
      // Refresh applications after successful submission
      if (user) {
        const applicationsData = await fetchJobApplicationsByUserId(user.id);
        setUserApplications(applicationsData);
      }
      setApplicationMessage("");
      setSelectedJob(null);
    }
  };

  const handleRespond = (jobId: string) => { // Job ID is string
    if (!responseMessage.trim()) {
      toast({
        title: "Error", 
        description: "Please write a response message",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Response Sent",
      description: "Your response has been sent to the client"
    });
    setResponseMessage("");
    setSelectedJob(null);
  };

  if (loading) {
    return <div className="text-center py-8">Loading jobs...</div>;
  }

  return (
    <div className="space-y-4 sm:space-y-6 max-w-full overflow-hidden">
      {/* Header - Responsive Layout */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
        <h2 className="text-xl sm:text-2xl font-bold">Job Requests</h2>
        {/* Filter Buttons - Stack on mobile, inline on larger screens */}
        <div className="flex flex-wrap gap-2 sm:space-x-2">
          <Button 
            variant={filter === "all" ? "default" : "outline"}
            size="sm"
            className="flex-1 sm:flex-initial text-xs sm:text-sm"
            onClick={() => setFilter("all")}
          >
            All Jobs
          </Button>
          <Button 
            variant={filter === "active" ? "default" : "outline"}
            size="sm" 
            className="flex-1 sm:flex-initial text-xs sm:text-sm"
            onClick={() => setFilter("active")}
          >
            Active
          </Button>
          <Button 
            variant={filter === "paused" ? "default" : "outline"}
            size="sm"
            className="flex-1 sm:flex-initial text-xs sm:text-sm"
            onClick={() => setFilter("paused")}
          >
            Paused
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {filteredJobs.length === 0 ? (
          <p className="text-center text-gray-500">No jobs found.</p>
        ) : (
          filteredJobs.map((job) => {
            return (
              <Card key={job.id} className="w-full">
                <CardHeader className="pb-3 sm:pb-6">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start space-y-3 sm:space-y-0">
                    <div className="space-y-2 flex-1 min-w-0">
                      <CardTitle className="text-base sm:text-lg leading-tight pr-2">{job.title}</CardTitle>
                      <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-600">
                        <Avatar className="h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0">
                          <AvatarImage src="/placeholder-avatar.jpg" alt={job.client?.name || 'Unknown Client'} />
                          <AvatarFallback className="text-xs">{job.client?.name ? job.client.name.split(' ').map(n => n[0]).join('') : '?'}</AvatarFallback>
                        </Avatar>
                        <span className="truncate">{job.client?.name || 'Unknown Client'}</span>
                        <span className="hidden sm:inline">•</span>
                        <span className="text-xs text-gray-500 sm:text-sm sm:text-gray-600">{new Date(job.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="self-start sm:self-center flex-shrink-0">
                      {getStatusBadge(job.status)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0 sm:pt-6">
                  <p className="text-sm sm:text-base text-gray-700 mb-3 sm:mb-4 line-clamp-3 sm:line-clamp-none">{job.description}</p>
                  
                  <div className="flex flex-wrap gap-1 sm:gap-2 mb-4">
                    {job.skills_required.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">{tag}</Badge>
                    ))}
                    {job.skills_required.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{job.skills_required.length - 3} more
                      </Badge>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                    {/* Budget and Deadline Info - Stack on mobile */}
                    <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 text-xs sm:text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                        <span className="font-medium">{job.budget} {job.currency}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                        <span>Due {job.deadline ? new Date(job.deadline).toLocaleDateString() : 'N/A'}</span>
                      </div>
                    </div>
                    
                    {/* Action Buttons - Responsive Layout */}
                    <div className="flex flex-col sm:flex-row gap-2 sm:space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" className="w-full sm:w-auto" onClick={() => handleViewDetails(job)}>
                            <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                            <span className="text-xs sm:text-sm">View Details</span>
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl mx-2 sm:mx-auto max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle className="text-lg sm:text-xl pr-6">{job.title}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4 sm:space-y-6">
                            <div>
                              <h4 className="font-semibold mb-2 text-sm sm:text-base">Full Description</h4>
                              <p className="text-gray-700 text-sm sm:text-base leading-relaxed">{job.description}</p>
                            </div>
                            <div>
                              <h4 className="font-semibold mb-2 text-sm sm:text-base">Requirements</h4>
                              <div className="flex flex-wrap gap-1 sm:gap-2">
                                {job.skills_required.map((skill, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {skill}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="bg-gray-50 p-3 rounded-lg">
                                <h4 className="font-semibold text-sm sm:text-base">Budget</h4>
                                <p className="text-lg font-medium text-green-600">{job.budget} {job.currency}</p>
                              </div>
                              <div className="bg-gray-50 p-3 rounded-lg">
                                <h4 className="font-semibold text-sm sm:text-base">Deadline</h4>
                                <p className="text-sm sm:text-base">{job.deadline ? new Date(job.deadline).toLocaleDateString() : 'N/A'}</p>
                              </div>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>

                      {job.status === "active" && ( // Check for "active" status
                        (() => {
                          const userApplication = userApplications.find(app => app.job_id === job.id);

                          if (userApplication) {
                            return (
                              <Badge
                                className={`text-xs w-full sm:w-auto text-center justify-center ${
                                  userApplication.status === "accepted"
                                    ? "bg-green-500 hover:bg-green-500"
                                    : userApplication.status === "rejected"
                                    ? "bg-red-500 hover:bg-red-500"
                                    : "bg-yellow-500 hover:bg-yellow-500"
                                }`}
                              >
                                Application {userApplication.status}
                              </Badge>
                            );
                          } else {
                            return (
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button size="sm" className="w-full sm:w-auto">
                                    <span className="text-xs sm:text-sm">Apply Now</span>
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="mx-2 sm:mx-auto max-h-[90vh] overflow-y-auto">
                                  <DialogHeader>
                                    <DialogTitle className="text-lg sm:text-xl">Apply for Job</DialogTitle>
                                  </DialogHeader>
                                  <div className="space-y-4 sm:space-y-6">
                                    <div>
                                      <Label htmlFor="application" className="text-sm sm:text-base">Application Message</Label>
                                      <Textarea
                                        id="application"
                                        placeholder="Tell the client why you're the right person for this job..."
                                        value={applicationMessage}
                                        onChange={(e) => setApplicationMessage(e.target.value)}
                                        rows={4}
                                        className="mt-2 text-sm sm:text-base"
                                      />
                                    </div>
                                    <Button onClick={() => handleApply(job.id)} className="w-full">
                                      <Send className="h-4 w-4 mr-2" />
                                      <span className="text-sm sm:text-base">Submit Application</span>
                                    </Button>
                                  </div>
                                </DialogContent>
                              </Dialog>
                            );
                          }
                        })()
                      )}

                      {job.status === "paused" && ( // Check for "paused" status
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" className="w-full sm:w-auto">
                              <MessageSquare className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                              <span className="text-xs sm:text-sm">Respond</span>
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="mx-2 sm:mx-auto max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle className="text-lg sm:text-xl">Respond to Invitation</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 sm:space-y-6">
                              <div>
                                <Label htmlFor="response" className="text-sm sm:text-base">Response Message</Label>
                                <Textarea
                                  id="response"
                                  placeholder="Respond to the client's invitation..."
                                  value={responseMessage}
                                  onChange={(e) => setResponseMessage(e.target.value)}
                                  rows={4}
                                  className="mt-2 text-sm sm:text-base"
                                />
                              </div>
                              <div className="flex flex-col sm:flex-row gap-2 sm:space-x-2">
                                <Button onClick={() => handleRespond(job.id)} className="flex-1 order-1">
                                  <span className="text-sm sm:text-base">Accept & Respond</span>
                                </Button>
                                <Button variant="outline" className="flex-1 order-2">
                                  <span className="text-sm sm:text-base">Decline</span>
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ResearchAidsJobRequests;