import React, { useEffect, useState } from 'react';
import { JobApplicationService } from '@/services/jobApplicationService';
import { JobApplication } from '@/types/jobs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';

const AidCompletedJobsTab = () => {
  const [completedJobs, setCompletedJobs] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const jobApplicationService = new JobApplicationService();

  useEffect(() => {
    const fetchCompletedJobs = async () => {
      setLoading(true);
      try {
        // In a real app, you'd fetch jobs with status 'completed' for the current aid
        // For now, we'll filter from the mock data
        const aidId = "aid_123"; // Replace with actual aidId
        const allApplications = await jobApplicationService.getAidJobApplications(aidId);
        const completed = allApplications.filter(app => app.status === "completed");
        setCompletedJobs(completed);
      } catch (error) {
        console.error("Failed to fetch completed jobs:", error);
        toast({
          title: "Error",
          description: "Failed to load completed jobs.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCompletedJobs();
  }, []);

  if (loading) {
    return <div className="p-4">Loading completed jobs...</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Completed Jobs</h2>
      
      {completedJobs.length === 0 ? (
        <p>No completed jobs found yet.</p>
      ) : (
        <div className="grid gap-4">
          {completedJobs.map((job) => (
            <Card key={job.id}>
              <CardHeader>
                <CardTitle>{job.jobTitle}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-2">Student: {job.studentName}</p>
                <p className="mb-4">Completed Date: {new Date(job.appliedDate).toLocaleDateString()}</p>
                {/* You might add more details or actions for completed jobs here */}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AidCompletedJobsTab;