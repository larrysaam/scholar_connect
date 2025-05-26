
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FileText, Clock, DollarSign, MessageSquare, User, CheckCircle, XCircle } from "lucide-react";

interface JobRequest {
  id: string;
  studentName: string;
  studentAvatar?: string;
  requestType: string;
  projectTitle: string;
  description: string;
  filesAttached: number;
  deadline: string;
  priceOffered: number;
  currency: string;
  urgency: "low" | "medium" | "high";
  postedAt: string;
}

const mockJobRequests: JobRequest[] = [
  {
    id: "1",
    studentName: "Kome Divine",
    requestType: "Quantitative Data Cleaning",
    projectTitle: "Gendered Impacts of Urban Mobility in Yaoundé",
    description: "I need help cleaning my survey data collected from 500 respondents. The data includes demographic information and mobility patterns. Some inconsistencies need to be addressed.",
    filesAttached: 3,
    deadline: "5 Days Left",
    priceOffered: 7500,
    currency: "XAF",
    urgency: "medium",
    postedAt: "2 hours ago"
  },
  {
    id: "2",
    studentName: "Sama Njoya",
    requestType: "Academic Editing",
    projectTitle: "Climate Change Adaptation in Cameroon Agriculture",
    description: "Looking for comprehensive editing of my thesis chapter focusing on grammar, structure, and APA formatting. The document is approximately 8,000 words.",
    filesAttached: 1,
    deadline: "3 Days Left",
    priceOffered: 12000,
    currency: "XAF",
    urgency: "high",
    postedAt: "5 hours ago"
  },
  {
    id: "3",
    studentName: "Paul Biya Jr.",
    requestType: "GIS Mapping",
    projectTitle: "Land Use Changes in Central Africa",
    description: "Need assistance creating detailed maps showing land use changes over the past decade. Satellite imagery analysis and map production required.",
    filesAttached: 5,
    deadline: "1 Week Left",
    priceOffered: 18000,
    currency: "XAF",
    urgency: "low",
    postedAt: "1 day ago"
  }
];

const ResearchAidJobRequestsTab = () => {
  const [selectedJob, setSelectedJob] = useState<JobRequest | null>(null);

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "high": return "bg-red-100 text-red-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const handleAcceptJob = (jobId: string) => {
    console.log("Accepting job:", jobId);
    // Here you would integrate with your backend
  };

  const handleDeclineJob = (jobId: string) => {
    console.log("Declining job:", jobId);
    // Here you would integrate with your backend
  };

  const handleMessageStudent = (jobId: string) => {
    console.log("Messaging student for job:", jobId);
    // Here you would open the messaging interface
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Job Requests</h2>
          <p className="text-gray-600">Review and respond to new job opportunities</p>
        </div>
        <Badge variant="secondary" className="text-lg px-3 py-1">
          {mockJobRequests.length} New Requests
        </Badge>
      </div>

      <div className="space-y-4">
        {mockJobRequests.map((job) => (
          <Card key={job.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={job.studentAvatar} alt={job.studentName} />
                    <AvatarFallback>
                      {job.studentName.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{job.studentName}</CardTitle>
                    <p className="text-sm text-gray-600">{job.postedAt}</p>
                  </div>
                </div>
                <Badge className={getUrgencyColor(job.urgency)}>
                  {job.urgency.toUpperCase()} PRIORITY
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-blue-600">{job.requestType}</h3>
                  <h4 className="font-medium text-gray-900 mt-1">{job.projectTitle}</h4>
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">{job.description}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 py-3 border-t border-gray-100">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{job.filesAttached} Files</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{job.deadline}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium">{job.priceOffered.toLocaleString()} {job.currency}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">1-on-1 Project</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        size="sm" 
                        onClick={() => setSelectedJob(job)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Accept
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Accept Job Request</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <p>Are you sure you want to accept this job from <strong>{job.studentName}</strong>?</p>
                        <div className="flex space-x-2">
                          <Button 
                            onClick={() => handleAcceptJob(job.id)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            Confirm Accept
                          </Button>
                          <Button variant="outline">Cancel</Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleMessageStudent(job.id)}
                  >
                    <MessageSquare className="h-4 w-4 mr-1" />
                    Message
                  </Button>

                  <Button 
                    size="sm" 
                    variant="destructive"
                    onClick={() => handleDeclineJob(job.id)}
                  >
                    <XCircle className="h-4 w-4 mr-1" />
                    Decline
                  </Button>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => setSelectedJob(job)}
                      >
                        View Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>{job.projectTitle}</DialogTitle>
                      </DialogHeader>
                      {selectedJob && (
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-medium mb-2">Request Type</h4>
                            <p className="text-sm text-gray-600">{selectedJob.requestType}</p>
                          </div>
                          <div>
                            <h4 className="font-medium mb-2">Full Description</h4>
                            <p className="text-sm text-gray-600">{selectedJob.description}</p>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-medium mb-1">Deadline</h4>
                              <p className="text-sm text-gray-600">{selectedJob.deadline}</p>
                            </div>
                            <div>
                              <h4 className="font-medium mb-1">Budget</h4>
                              <p className="text-sm text-gray-600">{selectedJob.priceOffered.toLocaleString()} {selectedJob.currency}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ResearchAidJobRequestsTab;
