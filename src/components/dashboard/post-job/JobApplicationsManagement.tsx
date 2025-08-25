import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useJobManagement, Job, JobApplication } from "@/hooks/useJobManagement";
import { useAuth } from "@/hooks/useAuth";
import { CheckCircle, XCircle, Info } from "lucide-react";

const JobApplicationsManagement = () => {
  const { user } = useAuth();
  const {
    fetchJobs, // This fetches jobs posted by the current user (student)
    fetchJobApplications, // Corrected function name
    confirmJobApplication,
    loading,
  } = useJobManagement();
  const { toast } = useToast();

  const [studentJobs, setStudentJobs] = useState<Job[]>([]);
  const [jobApplications, setJobApplications] = useState<{ [jobId: string]: JobApplication[] }>({});
  const [selectedApplication, setSelectedApplication] = useState<JobApplication | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const [meetingLink, setMeetingLink] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      if (user) {
        // Fetch jobs posted by the current student
        const jobsData = await fetchJobs(); // This function already filters by user.id
        console.log("Fetched jobs data:", jobsData);
        setStudentJobs(jobsData);

        // Fetch applications for each of the student's jobs
        const applicationsMap: { [jobId: string]: JobApplication[] } = {};
        for (const job of jobsData) {
          const apps = await fetchJobApplications(job.id);
          applicationsMap[job.id] = apps;
        }
        console.log("Fetched applications map:", applicationsMap);
        setJobApplications(applicationsMap); // Update the state with the fetched applications
      }
    };
    loadData();
  }, [user, fetchJobs, fetchJobApplications]);

  const handleConfirmApplication = async () => {
    if (!selectedApplication || !user) return;

    setIsConfirming(true);
    setMeetingLink(null);
    try {
      // Find the job details for the selected application
      const job = studentJobs.find(j => j.id === selectedApplication.job_id);
      if (!job) {
        toast({
          title: "Error",
          description: "Job details not found for this application.",
          variant: "destructive"
        });
        setIsConfirming(false);
        return;
      }

      const { success, meetLink } = await confirmJobApplication(
        selectedApplication.id,
        selectedApplication.applicant_id,
        job.id,
        job.title,
        job.description,
        job.budget,
        job.currency,
        job.category,
        job.duration,
        job.deadline
      );

      if (success) {
        toast({
          title: "Success",
          description: "Researcher Aid confirmed and booking created!",
        });
        if (meetLink) {
          setMeetingLink(meetLink);
        }
        // Refresh data after confirmation
        const jobsData = await fetchJobs();
        setStudentJobs(jobsData);
        const applicationsMap: { [jobId: string]: JobApplication[] } = {};
        for (const j of jobsData) {
          const apps = await fetchJobApplications(j.id);
          applicationsMap[j.id] = apps;
        }
        setJobApplications(applicationsMap);
      } else {
        toast({
          title: "Error",
          description: "Failed to confirm Researcher Aid.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error confirming application:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred during confirmation.",
        variant: "destructive"
      });
    } finally {
      setIsConfirming(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading job applications...</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Your Job Applications</h2>
      {studentJobs.length === 0 ? (
        <p className="text-center text-gray-500">You haven't posted any jobs yet.</p>
      ) : (
        studentJobs.map((job) => (
          <Card key={job.id}>
            <CardHeader>
              <CardTitle className="text-lg flex justify-between items-center">
                <span>Job: {job.title}</span>
                <Badge variant={job.status === "closed" ? "default" : "secondary"}>
                  {job.status === "closed" ? "Closed" : "Active"}
                </Badge>
              </CardTitle>
              <p className="text-sm text-gray-500">{job.description}</p>
            </CardHeader>
            <CardContent>
              <h3 className="font-semibold mb-3">Applications for this Job:</h3>
              {jobApplications[job.id] && jobApplications[job.id].length > 0 ? (
                <div className="space-y-3">
                  {jobApplications[job.id].map((application) => (
                    <Card key={application.id} className="p-3 flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src="/placeholder-avatar.jpg" alt={application.applicant?.name || 'Unknown Applicant'} />
                          <AvatarFallback>{application.applicant?.name ? application.applicant.name.split(' ').map(n => n[0]).join('') : '?'}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{application.applicant?.name || 'Unknown Applicant'}</p>
                          <p className="text-sm text-gray-500">Applied on: {new Date(application.created_at).toLocaleDateString()}</p>
                          {application.cover_letter && (
                            <p className="text-sm text-gray-600 italic">"{application.cover_letter}"</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge
                          className={application.status === "accepted" ? "bg-green-500" : application.status === "rejected" ? "bg-red-500" : "bg-yellow-500"}>
                          {application.status}
                        </Badge>
                        {job.status !== "closed" && application.status === "pending" && (
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setSelectedApplication(application)}>
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Confirm Aid
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Confirm Researcher Aid</DialogTitle>
                                {!meetingLink ? (
                                  <DialogDescription>
                                    Are you sure you want to confirm {selectedApplication?.applicant?.name || 'this applicant'} for "{job.title}"? This will close the job to other applicants and create a booking.
                                  </DialogDescription>
                                ) : (
                                  <DialogDescription>
                                    Researcher Aid confirmed and booking created! You can copy the meeting link below.
                                  </DialogDescription>
                                )}
                              </DialogHeader>
                              {meetingLink ? (
                                <div className="mt-4">
                                  <p className="font-semibold">Meeting Link:</p>
                                  <div className="flex items-center space-x-2 mt-2">
                                    <input type="text" value={meetingLink} readOnly className="w-full p-2 border rounded" />
                                    <Button onClick={() => navigator.clipboard.writeText(meetingLink)}>Copy</Button>
                                  </div>
                                </div>
                              ) : (
                                <div className="flex justify-end space-x-2">
                                  <Button variant="outline" onClick={() => setSelectedApplication(null)}>Cancel</Button>
                                  <Button onClick={handleConfirmApplication} disabled={isConfirming}>
                                    {isConfirming ? "Confirming..." : "Confirm"}
                                  </Button>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No applications for this job yet.</p>
              )}
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};

export default JobApplicationsManagement;