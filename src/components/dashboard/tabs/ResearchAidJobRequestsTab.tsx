import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FileText, Clock, DollarSign, MessageSquare, User, CheckCircle, XCircle } from "lucide-react";
import { useMyApplications, JobApplication } from "@/hooks/useMyApplications";
import { Chat } from "@/components/Chat";

const ResearchAidJobRequestsTab = () => {
  const { applications, loading, updateApplicationStatus } = useMyApplications();
  const [selectedApplication, setSelectedApplication] = useState<JobApplication | null>(null);

  const handleAcceptJob = async (applicationId: string) => {
    await updateApplicationStatus(applicationId, 'accepted');
  };

  const handleDeclineJob = async (applicationId: string) => {
    await updateApplicationStatus(applicationId, 'rejected');
  };

  if (loading) {
    return <div className="text-center py-8">Loading job requests...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Job Requests</h2>
          <p className="text-gray-600">Review and respond to new job opportunities</p>
        </div>
        <Badge variant="secondary" className="text-lg px-3 py-1">
          {applications.length} New Requests
        </Badge>
      </div>

      <div className="space-y-4">
        {applications.map((application) => (
          <Card key={application.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={"/placeholder-avatar.jpg"} alt={application.job.title} />
                    <AvatarFallback>
                      {application.job.title.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{application.job.title}</CardTitle>
                    <p className="text-sm text-gray-600">{new Date(application.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                <Badge>
                  {application.status.toUpperCase()}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">{application.cover_letter}</p>
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  {application.status === 'pending' && (
                    <>
                      <Button 
                        size="sm" 
                        onClick={() => handleAcceptJob(application.id)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Accept
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => handleDeclineJob(application.id)}
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Decline
                      </Button>
                    </>
                  )}
                  {application.status === 'accepted' && (
                    <Chat
                        bookingId={application.job_id}
                        receiverId={application.job.client.id}
                        receiverName={application.job.client.name}
                    />
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

export default ResearchAidJobRequestsTab;