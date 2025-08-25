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
import { useJobManagement, Job } from "@/hooks/useJobManagement"; // Import Job interface

const ResearchAidsJobRequests = () => {
  const [filter, setFilter] = useState("all");
  const [selectedJob, setSelectedJob] = useState<Job | null>(null); // Use Job interface
  const [applicationMessage, setApplicationMessage] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const { toast } = useToast();
  const { fetchAllJobsForResearchAids, loading } = useJobManagement(); // Use the hook
  const [allJobs, setAllJobs] = useState<Job[]>([]); // State to store all jobs

  useEffect(() => {
    const getJobs = async () => {
      const jobsData = await fetchAllJobsForResearchAids();
      setAllJobs(jobsData);
    };
    getJobs();
  }, []);

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

  const handleApply = (jobId: string) => { // Job ID is string
    if (!applicationMessage.trim()) {
      toast({
        title: "Error",
        description: "Please write an application message",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Application Submitted",
      description: "Your job application has been submitted successfully"
    });
    setApplicationMessage("");
    setSelectedJob(null);
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Job Requests</h2>
        <div className="flex space-x-2">
          <Button 
            variant={filter === "all" ? "default" : "outline"} 
            onClick={() => setFilter("all")}
          >
            All Jobs
          </Button>
          <Button 
            variant={filter === "active" ? "default" : "outline"} // Filter by "active" status
            onClick={() => setFilter("active")}
          >
            Active
          </Button>
          <Button 
            variant={filter === "paused" ? "default" : "outline"} // Filter by "paused" status
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
              <Card key={job.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <CardTitle className="text-lg">{job.title}</CardTitle>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src="/placeholder-avatar.jpg" alt={job.client?.name || 'Unknown Client'} /> {/* Use client name */}
                          <AvatarFallback>{job.client?.name ? job.client.name.split(' ').map(n => n[0]).join('') : '?'}</AvatarFallback> {/* Use client name initials */}
                        </Avatar>
                        <span>{job.client?.name || 'Unknown Client'}</span> {/* Display client name */}
                        <span>•</span>
                        <span>{new Date(job.created_at).toLocaleDateString()}</span> {/* Format date */}
                      </div>
                    </div>
                    {getStatusBadge(job.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4">{job.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {job.skills_required.map((tag, index) => (
                      <Badge key={index} variant="outline">{tag}</Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <DollarSign className="h-4 w-4" />
                        <span>{job.budget} {job.currency}</span> {/* Display currency */}
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>Due {job.deadline ? new Date(job.deadline).toLocaleDateString() : 'N/A'}</span> {/* Format deadline */}
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" onClick={() => handleViewDetails(job)}>
                            <Eye className="h-4 w-4 mr-1" />
                            View Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>{job.title}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <h4 className="font-semibold mb-2">Full Description</h4>
                              <p className="text-gray-700">{job.description}</p> {/* Use description */}
                            </div>
                            <div>
                              <h4 className="font-semibold mb-2">Requirements</h4>
                              <p className="text-gray-700">{job.skills_required.join(', ')}</p> {/* Use skills_required */}
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <h4 className="font-semibold">Budget</h4>
                                <p>{job.budget} {job.currency}</p>
                              </div>
                              <div>
                                <h4 className="font-semibold">Deadline</h4>
                                <p>{job.deadline ? new Date(job.deadline).toLocaleDateString() : 'N/A'}</p>
                              </div>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>

                      {job.status === "active" && ( // Check for "active" status
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm">Apply Now</Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Apply for Job</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <Label htmlFor="application">Application Message</Label>
                                <Textarea
                                  id="application"
                                  placeholder="Tell the client why you're the right person for this job..."
                                  value={applicationMessage}
                                  onChange={(e) => setApplicationMessage(e.target.value)}
                                  rows={4}
                                />
                              </div>
                              <Button onClick={() => handleApply(job.id)} className="w-full">
                                <Send className="h-4 w-4 mr-2" />
                                Submit Application
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      )}

                      {job.status === "paused" && ( // Check for "paused" status
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm">
                              <MessageSquare className="h-4 w-4 mr-1" />
                              Respond
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Respond to Invitation</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <Label htmlFor="response">Response Message</Label>
                                <Textarea
                                  id="response"
                                  placeholder="Respond to the client's invitation..."
                                  value={responseMessage}
                                  onChange={(e) => setResponseMessage(e.target.value)}
                                  rows={4}
                                />
                              </div>
                              <div className="flex space-x-2">
                                <Button onClick={() => handleRespond(job.id)} className="flex-1">
                                  Accept & Respond
                                </Button>
                                <Button variant="outline" className="flex-1">
                                  Decline
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