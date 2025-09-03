import React, { useEffect, useState } from 'react';
import { JobApplicationService } from '@/services/jobApplicationService';
import { JobApplication } from '@/types/jobs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';

const AidJobApplicationsTab = () => {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const jobApplicationService = new JobApplicationService();

  useEffect(() => {
    const fetchApplications = async () => {
      setLoading(true);
      try {
        // Replace with actual aidId from auth context
        const aidId = "aid_123"; 
        const data = await jobApplicationService.getAidJobApplications(aidId);
        setApplications(data);
      } catch (error) {
        console.error("Failed to fetch job applications:", error);
        toast({
          title: "Error",
          description: "Failed to load job applications.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const handleStatusUpdate = async (applicationId: string, status: "approved" | "rejected") => {
    try {
      const success = await jobApplicationService.updateJobApplicationStatus(applicationId, status);
      if (success) {
        setApplications(prevApps => 
          prevApps.map(app => 
            app.id === applicationId ? { ...app, status } : app
          )
        );
        toast({
          title: "Success",
          description: `Application ${status} successfully.`, 
        });
      } else {
        toast({
          title: "Error",
          description: `Failed to ${status} application.`, 
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error(`Failed to update application status to ${status}:`, error);
      toast({
        title: "Error",
        description: `An error occurred while updating application status.`, 
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div className="p-4">Loading job applications...</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Job Applications Status</h2>
      
      {applications.length === 0 ? (
        <p>No job applications found.</p>
      ) : (
        <div className="grid gap-4">
          {applications.map((app) => (
            <Card key={app.id}>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>{app.jobTitle}</span>
                  <Badge 
                    variant={app.status === "approved" ? "default" : app.status === "rejected" ? "destructive" : "secondary"}
                  >
                    {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-2">Applied by: {app.studentName} on {new Date(app.appliedDate).toLocaleDateString()}</p>
                <p className="mb-4"><strong>Cover Letter:</strong> {app.coverLetter}</p>
                
                {app.status === "pending" && (
                  <div className="flex space-x-2">
                    <Button onClick={() => handleStatusUpdate(app.id, "approved")}>Approve</Button>
                    <Button variant="outline" onClick={() => handleStatusUpdate(app.id, "rejected")}>Reject</Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AidJobApplicationsTab;