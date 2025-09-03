import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FileText, Clock, DollarSign, MessageSquare, User, CheckCircle, XCircle, Download } from "lucide-react";
import { useMyApplications, JobApplication } from "@/hooks/useMyApplications";
import { Chat } from "@/components/Chat";

const StudentJobApplicationsTab = () => {
  const { applications, loading, updateApplicationStatus } = useMyApplications();
  const [selectedApplication, setSelectedApplication] = useState<JobApplication | null>(null);

  if (loading) {
    return <div className="text-center py-8">Loading your job applications...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">My Job Applications</h2>
          <p className="text-gray-600">View the status of your job applications</p>
        </div>
        <Badge variant="secondary" className="text-lg px-3 py-1">
          {applications.length} Applications
        </Badge>
      </div>

      <div className="space-y-4">
        {applications.length === 0 ? (
          <p className="text-center text-gray-500">You haven't applied for any jobs yet.</p>
        ) : (
          applications.map((application) => (
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
                      <p className="text-sm text-gray-600">Applied on: {new Date(application.created_at).toLocaleDateString()}</p>
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
                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">Cover Letter: {application.cover_letter || 'N/A'}</p>
                    <p className="text-sm text-gray-600">Proposed Budget: ${application.proposed_budget || 'N/A'}</p>
                    <p className="text-sm text-gray-600">Estimated Duration: {application.estimated_duration || 'N/A'}</p>
                  </div>

                  {/* Display shared files (deliverables) */}
                  {application.job.file_path && (
                    <div className="mt-4">
                      <h4 className="text-md font-semibold mb-2">Shared Files:</h4>
                      <a 
                        href={application.job.file_path} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-blue-600 hover:underline"
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Download Deliverable
                      </a>
                    </div>
                  )}

                  {/* Actions for student (e.g., withdraw application) */}
                  {application.status === 'pending' && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => updateApplicationStatus(application.id, 'withdrawn')}
                    >
                      Withdraw Application
                    </Button>
                  )}
                  {application.status === 'accepted' && (
                    <Chat
                        bookingId={application.job_id} // Assuming job_id can be used as bookingId
                        receiverId={application.job.client.id}
                        receiverName={application.job.client.name}
                    />
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default StudentJobApplicationsTab;
