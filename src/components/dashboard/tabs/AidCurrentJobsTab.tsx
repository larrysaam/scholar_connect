import React, { useEffect, useState } from 'react';
import { JobApplicationService } from '@/services/jobApplicationService';
import { JobApplication } from '@/types/jobs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"; // Import Dialog components

const AidCurrentJobsTab = () => {
  const [currentJobs, setCurrentJobs] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false); // State for preview modal
  const [previewUrl, setPreviewUrl] = useState(""); // State for preview URL
  const [previewFileName, setPreviewFileName] = useState(""); // State for preview file name
  const jobApplicationService = new JobApplicationService();

  useEffect(() => {
    const fetchCurrentJobs = async () => {
      setLoading(true);
      try {
        const aidId = "aid_123"; // Replace with actual aidId
        const allApplications = await jobApplicationService.getAidJobApplications(aidId);
        const approvedJobs = allApplications.filter(app => app.status === "approved" || app.status === "completed"); // Also show completed jobs
        setCurrentJobs(approvedJobs);
      } catch (error) {
        console.error("Failed to fetch current jobs:", error);
        toast({
          title: "Error",
          description: "Failed to load current jobs.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentJobs();
  }, []);

  const handlePreviewDeliverable = (url: string, name: string) => {
    setPreviewUrl(url);
    setPreviewFileName(name);
    setIsPreviewModalOpen(true);
  };

  const handleShareResource = (jobId: string) => {
    // Placeholder for file sharing logic
    toast({
      title: "Feature Coming Soon",
      description: `File sharing for job ${jobId} will be implemented here.`, 
    });
    console.log(`Share resource for job: ${jobId}`);
  };

  if (loading) {
    return <div className="p-4">Loading current jobs...</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Current Jobs</h2>
      
      {currentJobs.length === 0 ? (
        <p>No current jobs found. Approved applications will appear here.</p>
      ) : (
        <div className="grid gap-4">
          {currentJobs.map((job) => (
            <Card key={job.id}>
              <CardHeader>
                <CardTitle>{job.jobTitle}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-2">Student: {job.studentName}</p>
                <p className="mb-4">Application Date: {new Date(job.appliedDate).toLocaleDateString()}</p>
                {job.file_path && (
                  <Button 
                    onClick={() => handlePreviewDeliverable(job.file_path!, `Deliverable for ${job.jobTitle}`)}
                    className="mr-2"
                  >
                    View Deliverable
                  </Button>
                )}
                <Button onClick={() => handleShareResource(job.jobId)}>Share Resource</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isPreviewModalOpen} onOpenChange={setIsPreviewModalOpen}>
        <DialogContent className="sm:max-w-[800px] h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Preview: {previewFileName}</DialogTitle>
          </DialogHeader>
          <div className="flex-grow overflow-hidden">
            {previewUrl && (
              <iframe
                src={previewUrl}
                title={previewFileName}
                className="w-full h-full border-0"
                allowFullScreen
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AidCurrentJobsTab;