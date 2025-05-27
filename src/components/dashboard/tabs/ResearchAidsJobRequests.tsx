
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Clock, DollarSign, FileText, Eye, MessageSquare, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ResearchAidsJobRequests = () => {
  const [filter, setFilter] = useState("all");
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [applicationMessage, setApplicationMessage] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const { toast } = useToast();

  const jobRequests = [
    {
      id: 1,
      title: "Statistical Analysis for Psychology Research",
      client: "Dr. Sarah Johnson",
      description: "Need help with SPSS analysis for a research study on cognitive behavior",
      fullDescription: "I am conducting a comprehensive research study on cognitive behavior patterns in university students. The study involves analyzing survey data from 500 participants using SPSS. I need assistance with descriptive statistics, correlation analysis, and multiple regression analysis. The deadline is flexible but I would prefer to have preliminary results within 2 weeks.",
      budget: "25,000 XAF",
      deadline: "2024-02-15",
      status: "pending",
      posted: "2 hours ago",
      tags: ["Statistics", "SPSS", "Psychology"],
      requirements: "Experience with SPSS, statistical analysis, psychology research background preferred"
    },
    {
      id: 2,
      title: "Literature Review on Climate Change",
      client: "Prof. Michael Chen",
      description: "Comprehensive literature review on climate change impacts in Central Africa",
      fullDescription: "This project involves conducting a systematic literature review on climate change impacts specifically in Central African regions. The review should cover the period from 2010-2024 and include peer-reviewed articles from major databases. Expected deliverables include a comprehensive report with citations and a summary of key findings.",
      budget: "45,000 XAF",
      deadline: "2024-02-20",
      status: "pending",
      posted: "1 day ago",
      tags: ["Literature Review", "Climate", "Environment"],
      requirements: "Access to academic databases, experience with systematic reviews, environmental science background"
    },
    {
      id: 3,
      title: "Data Collection and Analysis",
      client: "Dr. Marie Dubois",
      description: "Field data collection and preliminary analysis for agricultural study",
      fullDescription: "We need assistance with collecting field data for an agricultural productivity study in rural areas. This involves traveling to farming communities, conducting surveys, and performing preliminary data analysis. The work includes both fieldwork and desk analysis components.",
      budget: "60,000 XAF",
      deadline: "2024-03-01",
      status: "invited",
      posted: "3 days ago",
      tags: ["Data Collection", "Agriculture", "Field Work"],
      requirements: "Ability to travel, experience with agricultural research, data analysis skills"
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary">Pending Review</Badge>;
      case "invited":
        return <Badge className="bg-blue-600">Invited to Apply</Badge>;
      case "applied":
        return <Badge className="bg-green-600">Applied</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const filteredJobs = jobRequests.filter(job => 
    filter === "all" || job.status === filter
  );

  const handleViewDetails = (job: any) => {
    setSelectedJob(job);
  };

  const handleApply = (jobId: number) => {
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

  const handleRespond = (jobId: number) => {
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
            variant={filter === "pending" ? "default" : "outline"} 
            onClick={() => setFilter("pending")}
          >
            Pending
          </Button>
          <Button 
            variant={filter === "invited" ? "default" : "outline"} 
            onClick={() => setFilter("invited")}
          >
            Invited
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {filteredJobs.map((job) => (
          <Card key={job.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <CardTitle className="text-lg">{job.title}</CardTitle>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src="/placeholder-avatar.jpg" alt={job.client} />
                      <AvatarFallback>{job.client.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <span>{job.client}</span>
                    <span>•</span>
                    <span>{job.posted}</span>
                  </div>
                </div>
                {getStatusBadge(job.status)}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">{job.description}</p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {job.tags.map((tag, index) => (
                  <Badge key={index} variant="outline">{tag}</Badge>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <DollarSign className="h-4 w-4" />
                    <span>{job.budget}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>Due {job.deadline}</span>
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
                          <p className="text-gray-700">{job.fullDescription}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Requirements</h4>
                          <p className="text-gray-700">{job.requirements}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-semibold">Budget</h4>
                            <p>{job.budget}</p>
                          </div>
                          <div>
                            <h4 className="font-semibold">Deadline</h4>
                            <p>{job.deadline}</p>
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>

                  {job.status === "pending" && (
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

                  {job.status === "invited" && (
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
        ))}
      </div>
    </div>
  );
};

export default ResearchAidsJobRequests;
