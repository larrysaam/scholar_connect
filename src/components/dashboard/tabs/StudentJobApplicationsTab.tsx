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
    <div className="space-y-4 sm:space-y-6 max-w-full overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 sm:gap-0">
        <div className="min-w-0">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold truncate">My Job Applications</h2>
          <p className="text-sm sm:text-base text-gray-600">View the status of your job applications</p>
        </div>
        <Badge variant="secondary" className="text-sm sm:text-lg px-3 py-1 flex-shrink-0 w-fit">
          {applications.length} Applications
        </Badge>
      </div>

      <div className="space-y-3 sm:space-y-4">
        {applications.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8 sm:py-12">
              <p className="text-sm sm:text-base text-gray-500">You haven't applied for any jobs yet.</p>
            </CardContent>
          </Card>
        ) : (
          applications.map((application) => (
            <Card key={application.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="p-4 sm:p-6 pb-3">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-0">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0">
                      <AvatarImage src={"/placeholder-avatar.jpg"} alt={application.job.title} />
                      <AvatarFallback className="text-xs sm:text-sm">
                        {application.job.title.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <CardTitle className="text-sm sm:text-lg truncate">{application.job.title}</CardTitle>
                      <p className="text-xs sm:text-sm text-gray-600">
                        Applied on: {new Date(application.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Badge className="flex-shrink-0 text-xs sm:text-sm w-fit">
                    {application.status.toUpperCase()}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="p-4 sm:p-6 pt-0">
                <div className="space-y-3 sm:space-y-4">
                  <div className="space-y-2">
                    <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">
                      <span className="font-medium">Cover Letter:</span> {application.cover_letter || 'N/A'}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-600">
                      <span className="font-medium">Proposed Budget:</span> ${application.proposed_budget || 'N/A'}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-600">
                      <span className="font-medium">Estimated Duration:</span> {application.estimated_duration || 'N/A'}
                    </p>
                  </div>

                  {/* Actions for student */}
                  <div className="flex flex-col sm:flex-row gap-2 pt-2">
                    {application.status === 'pending' && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => updateApplicationStatus(application.id, 'withdrawn')}
                        className="w-full sm:w-auto text-xs sm:text-sm"
                      >
                        Withdraw Application
                      </Button>
                    )}
                  </div>
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
