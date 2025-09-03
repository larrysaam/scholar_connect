import React, { useEffect, useState } from 'react';
import { JobApplicationService } from '@/services/jobApplicationService';
import { JobApplication } from '@/types/jobs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

const AidCurrentJobsTab = () => {
  const [currentJobs, setCurrentJobs] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const jobApplicationService = new JobApplicationService();

  useEffect(() => {
    const fetchCurrentJobs = async () => {
      setLoading(true);
      try {
        // In a real app, you'd fetch jobs with status 'approved' for the current aid
        // For now, we'll filter from the mock data
        const aidId = "aid_123"; // Replace with actual aidId
        const allApplications = await jobApplicationService.getAidJobApplications(aidId);
        const approvedJobs = allApplications.filter(app => app.status === "approved");
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
                <Button onClick={() => handleShareResource(job.jobId)}>Share Resource</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AidCurrentJobsTab;