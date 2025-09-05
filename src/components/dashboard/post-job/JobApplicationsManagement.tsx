import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input"; // Added Input
import { Label } from "@/components/ui/label"; // Added Label
import { useToast } from "@/hooks/use-toast";
import { useJobManagement, Job, JobApplication } from "@/hooks/useJobManagement";
import { useAuth } from "@/hooks/useAuth";
import { CheckCircle, XCircle, Info, FileText, Upload } from "lucide-react"; // Added FileText, Upload
import { Chat } from "@/components/Chat";

const JobApplicationsManagement = () => {
  const { user } = useAuth();
  const {
    fetchJobs,
    fetchJobApplications,
    confirmJobApplication,
    handleUploadDeliverableForJobApplication,
    handleDeleteDeliverableForJobApplication,
    loading,
  } = useJobManagement();
  const { toast } = useToast();

  const [studentJobs, setStudentJobs] = useState<Job[]>([]);
  const [jobApplications, setJobApplications] = useState<{ [jobId: string]: JobApplication[] }>({});
  const [selectedApplication, setSelectedApplication] = useState<JobApplication | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const [meetingLink, setMeetingLink] = useState<string | null>(null);
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false); // State to control dialog open/close

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false); // New state for upload modal
  const [fileToUpload, setFileToUpload] = useState<File | null>(null); // New state for file
  const [selectedJobIdForUpload, setSelectedJobIdForUpload] = useState<string | null>(null); // New state for job ID

  useEffect(() => {
    const loadData = async () => {
      if (user) {
        const jobsData = await fetchJobs();
        console.log("Fetched jobs data:", jobsData);
        setStudentJobs(jobsData);

        const applicationsMap: { [jobId: string]: JobApplication[] } = {};
        for (const job of jobsData) {
          const apps = await fetchJobApplications(job.id);
          applicationsMap[job.id] = apps;
        }
        console.log("Fetched applications map:", applicationsMap);
        setJobApplications(applicationsMap);
        console.log("JobApplicationsManagement - jobApplications state after set:", applicationsMap);
      }
    };
    loadData();
  }, [user, fetchJobs, fetchJobApplications]);

  const handleConfirmApplication = async () => {
    if (!selectedApplication || !user) return;

    setIsConfirming(true);
    setMeetingLink(null);
    try {
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


      //  const { success, meetLink, bookingId: newBookingId } = await confirmJobApplication(
      //   selectedApplication.id,
      //   selectedApplication.applicant_id,
      //   job.id,
      //   job.title,
      //   job.description,
      //   job.budget,
      //   job.currency,
      //   job.category,
      //   job.duration,
      //   job.deadline
      // );

      const { success } = await confirmJobApplication(
       selectedApplication.id,
        selectedApplication.applicant_id,
        job.id,
        job.title,
        job.description,
        job.budget,
        job.currency,
        job.category,
        job.duration
      );

      if (success) {
        toast({
          title: "Success",
          description: "Researcher Aid confirmed and booking created!",
        });
        // if (meetLink) {
        //   setMeetingLink(meetLink);
        // }
        // if (newBookingId) {
        //   setBookingId(newBookingId);
        // }
        const jobsData = await fetchJobs();
        setStudentJobs(jobsData);
        const applicationsMap: { [jobId: string]: JobApplication[] } = {};
        for (const j of jobsData) {
          const apps = await fetchJobApplications(j.id);
          applicationsMap[j.id] = apps;
        }
        setJobApplications(applicationsMap);
        setSelectedApplication(prev => prev ? { ...prev, status: 'accepted' } : null);
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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFileToUpload(event.target.files[0]);
    } else {
      setFileToUpload(null);
    }
  };

  const handleUploadClick = (jobId: string) => {
    setSelectedJobIdForUpload(jobId);
    setIsUploadModalOpen(true);
  };

  const handleSubmitUpload = async () => {
    if (fileToUpload && selectedJobIdForUpload) {
      await handleUploadDeliverableForJobApplication(selectedJobIdForUpload, fileToUpload);
      setIsUploadModalOpen(false);
      setFileToUpload(null);
      setSelectedJobIdForUpload(null);
    }
  };

  const handleDeleteDeliverable = async (jobId: string, fileUrl: string) => {
    console.log(`Attempting to delete file: ${fileUrl} for job: ${jobId}`);
    await handleDeleteDeliverableForJobApplication(jobId, fileUrl);
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
                    <Card key={application.id} className="p-3 flex flex-col space-y-3">
                      <div className="flex items-center justify-between">
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
                          {application.status === "accepted" && bookingId && (
                            <Chat
                              bookingId={bookingId}
                              receiverId={application.applicant_id}
                              receiverName={application.applicant.name}
                            />
                          )}
                        </div>
                      </div>

                      {/* Conditional rendering for Deliverables Section and Upload Button */}
                      {console.log("JobApplicationsManagement - Current Application:", application)}
                      {console.log("JobApplicationsManagement - Application Status:", application.status)}
                      {console.log("JobApplicationsManagement - Application Job Object:", application.job)}
                      {application.status === "accepted" && (
                        <>
                          {/* Deliverables Section */}
                          {console.log("JobApplicationsManagement - application.job.file_path:", application.job.file_path)}
                          {application.job.file_path && application.job.file_path.length > 0 && (
                            <div className="mt-4">
                              <h4 className="font-medium mb-2">Deliverables:</h4>
                              <div className="flex flex-wrap gap-2">
                                {application.job.file_path.map((deliverable, idx) => (
                                  <div
                                    key={idx}
                                    className="flex items-center space-x-1 text-sm bg-blue-50 px-2 py-1 rounded hover:bg-blue-100 transition-colors duration-200"
                                  >
                                    <a
                                      href={deliverable.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex items-center space-x-1"
                                    >
                                      <FileText className="h-3 w-3 text-blue-600" />
                                      <span>{deliverable.name}</span>
                                    </a>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-4 w-4"
                                      onClick={() => handleDeleteDeliverable(application.job_id, deliverable.url)}
                                    >
                                      <XCircle className="h-3 w-3 text-red-500" />
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Upload Deliverable Button */}
                          <div className="mt-4">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleUploadClick(application.job_id)}
                            >
                              <Upload className="h-4 w-4 mr-1" />
                              Upload Deliverable
                            </Button>
                          </div>
                        </>
                      )}
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

      {/* Upload Deliverable Modal */}
      <Dialog open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Upload Deliverable</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="file" className="text-right">
                File
              </Label>
              <Input id="file" type="file" className="col-span-3" onChange={handleFileChange} />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleSubmitUpload} disabled={!fileToUpload || loading}>
              <Upload className="h-4 w-4 mr-2" /> Upload
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default JobApplicationsManagement;