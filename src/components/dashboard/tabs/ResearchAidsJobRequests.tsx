
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Clock, DollarSign, FileText, Eye, MessageSquare } from "lucide-react";

const ResearchAidsJobRequests = () => {
  const [filter, setFilter] = useState("all");

  const jobRequests = [
    {
      id: 1,
      title: "Statistical Analysis for Psychology Research",
      client: "Dr. Sarah Johnson",
      description: "Need help with SPSS analysis for a research study on cognitive behavior",
      budget: "25,000 XAF",
      deadline: "2024-02-15",
      status: "pending",
      posted: "2 hours ago",
      tags: ["Statistics", "SPSS", "Psychology"]
    },
    {
      id: 2,
      title: "Literature Review on Climate Change",
      client: "Prof. Michael Chen",
      description: "Comprehensive literature review on climate change impacts in Central Africa",
      budget: "45,000 XAF",
      deadline: "2024-02-20",
      status: "pending",
      posted: "1 day ago",
      tags: ["Literature Review", "Climate", "Environment"]
    },
    {
      id: 3,
      title: "Data Collection and Analysis",
      client: "Dr. Marie Dubois",
      description: "Field data collection and preliminary analysis for agricultural study",
      budget: "60,000 XAF",
      deadline: "2024-03-01",
      status: "invited",
      posted: "3 days ago",
      tags: ["Data Collection", "Agriculture", "Field Work"]
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
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-1" />
                    View Details
                  </Button>
                  {job.status === "pending" && (
                    <Button size="sm">
                      Apply Now
                    </Button>
                  )}
                  {job.status === "invited" && (
                    <Button size="sm">
                      <MessageSquare className="h-4 w-4 mr-1" />
                      Respond
                    </Button>
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
