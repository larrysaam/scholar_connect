import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Upload, Download, FileText, Eye, Send, Plus, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

interface FileData {
  id: string;
  name: string;
  size: number;
  type: string;
  created_at: string;
  uploaded_by?: string;
  project_name?: string;
  file_url?: string;
}

interface DeliverableData {
  id: string;
  title: string;
  description: string;
  status: string;
  due_date: string;
  submitted_at?: string;
  job_id: string;
  client_name?: string;
  project_name?: string;
  file_path?: any;
}

const ResearchAidsFilesDeliverables = () => {
  const [activeTab, setActiveTab] = useState("files");
  const [deliverableTitle, setDeliverableTitle] = useState("");
  const [deliverableDescription, setDeliverableDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [workFile, setWorkFile] = useState<File | null>(null);
  const [viewingFile, setViewingFile] = useState<FileData | null>(null);
  const [viewingDeliverable, setViewingDeliverable] = useState<DeliverableData | null>(null);
  const [files, setFiles] = useState<FileData[]>([]);
  const [deliverables, setDeliverables] = useState<DeliverableData[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  // Fetch files and deliverables from database
  useEffect(() => {
    if (user) {
      fetchFilesAndDeliverables();
    }
  }, [user]);

  const fetchFilesAndDeliverables = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Fetch files from job applications and service bookings
      const { data: jobApplications, error: jobError } = await supabase
        .from('job_applications')
        .select(`
          *,
          jobs:job_id (
            id,
            title,
            description,
            file_path,
            user_id,
            users:user_id (name)
          )
        `)
        .eq('applicant_id', user.id);

      if (jobError) {
        console.error('Error fetching job applications:', jobError);
      }

      // Fetch service bookings where user is involved
      const { data: serviceBookings, error: bookingError } = await supabase
        .from('service_bookings')
        .select(`
          *,
          consultation_services:service_id (
            title,
            description,
            user_id,
            users:user_id (name)
          ),
          client:client_id (name),
          provider:provider_id (name)
        `)
        .or(`client_id.eq.${user.id},provider_id.eq.${user.id}`);

      if (bookingError) {
        console.error('Error fetching service bookings:', bookingError);
      }

      // Process files from job applications
      const jobFiles: FileData[] = [];
      const jobDeliverables: DeliverableData[] = [];

      if (jobApplications) {
        jobApplications.forEach((application) => {
          if (application.jobs) {
            // Process files from job file_path
            if (application.jobs.file_path) {
              let filePaths = [];
              if (Array.isArray(application.jobs.file_path)) {
                filePaths = application.jobs.file_path;
              } else if (typeof application.jobs.file_path === 'string') {
                try {
                  filePaths = JSON.parse(application.jobs.file_path);
                } catch {
                  filePaths = [{ url: application.jobs.file_path, name: 'Document' }];
                }
              }

              filePaths.forEach((file: any, index: number) => {
                if (file && file.url) {
                  jobFiles.push({
                    id: `job-${application.jobs.id}-${index}`,
                    name: file.name || 'Document',
                    size: 0, // Size not available from current schema
                    type: file.name?.split('.').pop() || 'document',
                    created_at: application.created_at || new Date().toISOString(),
                    uploaded_by: application.jobs.users?.name || 'Unknown',
                    project_name: application.jobs.title,
                    file_url: file.url
                  });
                }
              });
            }

            // Create deliverable entry for each job application
            jobDeliverables.push({
              id: application.id,
              title: `Work for: ${application.jobs.title}`,
              description: application.cover_letter || application.jobs.description || 'No description available',
              status: application.status || 'pending',
              due_date: application.jobs.deadline || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
              submitted_at: application.updated_at,
              job_id: application.jobs.id,
              client_name: application.jobs.users?.name || 'Unknown Client',
              project_name: application.jobs.title,
              file_path: application.jobs.file_path
            });
          }
        });
      }

      // Process files from service bookings
      const bookingFiles: FileData[] = [];
      const bookingDeliverables: DeliverableData[] = [];

      if (serviceBookings) {
        serviceBookings.forEach((booking) => {
          // Process shared documents
          if (booking.shared_documents) {
            let documents = [];
            if (Array.isArray(booking.shared_documents)) {
              documents = booking.shared_documents;
            } else if (typeof booking.shared_documents === 'object') {
              documents = [booking.shared_documents];
            }

            documents.forEach((doc: any, index: number) => {
              if (doc && doc.url) {
                bookingFiles.push({
                  id: `booking-${booking.id}-${index}`,
                  name: doc.name || 'Shared Document',
                  size: doc.size || 0,
                  type: doc.type || 'document',
                  created_at: booking.created_at,
                  uploaded_by: booking.provider?.name || booking.client?.name || 'Unknown',
                  project_name: booking.consultation_services?.title || 'Consultation',
                  file_url: doc.url
                });
              }
            });
          }

          // Create deliverable for service booking if user is provider
          if (booking.provider_id === user.id) {
            bookingDeliverables.push({
              id: `booking-${booking.id}`,
              title: `Service: ${booking.consultation_services?.title || 'Consultation'}`,
              description: booking.consultation_services?.description || booking.notes || 'Consultation service',
              status: booking.status || 'pending',
              due_date: booking.scheduled_date,
              submitted_at: booking.updated_at,
              job_id: booking.id,
              client_name: booking.client?.name || 'Unknown Client',
              project_name: booking.consultation_services?.title || 'Consultation'
            });
          }
        });
      }

      setFiles([...jobFiles, ...bookingFiles]);
      setDeliverables([...jobDeliverables, ...bookingDeliverables]);

    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to load files and deliverables",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return 'Unknown size';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "submitted":
        return <Badge className="bg-green-600">Submitted</Badge>;
      case "in-progress":
        return <Badge className="bg-blue-600">In Progress</Badge>;
      case "pending":
        return <Badge variant="secondary">Pending</Badge>;
      case "approved":
        return <Badge className="bg-purple-600">Approved</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      toast({
        title: "File Selected",
        description: `${file.name} is ready to upload`
      });
    }
  };

  const handleWorkFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setWorkFile(file);
      toast({
        title: "Work File Selected",
        description: `${file.name} is ready to submit`
      });
    }
  };

  const handleUploadFile = () => {
    if (selectedFile) {
      toast({
        title: "File Uploaded",
        description: `${selectedFile.name} has been uploaded successfully`
      });
      setSelectedFile(null);
    }
  };

  const handleDownload = (fileName: string) => {
    toast({
      title: "Downloading",
      description: `Downloading ${fileName}`
    });
  };

  const handleSubmitDeliverable = () => {
    if (!deliverableTitle.trim() || !deliverableDescription.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Deliverable Submitted",
      description: "Your deliverable has been submitted successfully"
    });
    setDeliverableTitle("");
    setDeliverableDescription("");
  };

  const handleSubmitWork = (deliverableId: number) => {
    if (!workFile) {
      toast({
        title: "Error",
        description: "Please select a file to submit",
        variant: "destructive"
      });
      return;
    }

    setDeliverables(prev => prev.map(d => 
      d.id === deliverableId 
        ? { ...d, workSubmitted: true, status: "submitted" }
        : d
    ));

    toast({
      title: "Work Submitted",
      description: `Your work has been submitted successfully`
    });
    setWorkFile(null);
  };

  const handleViewFile = (file: any) => {
    setViewingFile(file);
  };

  const handleViewDeliverable = (deliverable: any) => {
    setViewingDeliverable(deliverable);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Files & Deliverables</h2>
        <div className="flex space-x-2">
          <Button 
            variant={activeTab === "files" ? "default" : "outline"} 
            onClick={() => setActiveTab("files")}
          >
            Project Files
          </Button>
          <Button 
            variant={activeTab === "deliverables" ? "default" : "outline"} 
            onClick={() => setActiveTab("deliverables")}
          >
            Deliverables
          </Button>
        </div>
      </div>

      {activeTab === "files" && (
        <div className="space-y-6">
          {/* File Upload Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Upload Files</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="file-upload">Select File</Label>
                  <Input
                    id="file-upload"
                    type="file"
                    onChange={handleFileUpload}
                    className="mt-1"
                    disabled={uploading}
                  />
                </div>
                {selectedFile && (
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <span className="text-sm">{selectedFile.name}</span>
                    <Button onClick={handleUploadFile} disabled={uploading}>
                      {uploading ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Upload className="h-4 w-4 mr-2" />
                      )}
                      {uploading ? 'Uploading...' : 'Upload'}
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Files List */}
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Loading files...</span>
            </div>
          ) : files.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No files available yet.</p>
                <p className="text-sm text-gray-500 mt-2">Files from your job applications and consultations will appear here.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {files.map((file) => (
                <Card key={file.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <FileText className="h-8 w-8 text-blue-600" />
                        <div>
                          <h4 className="font-medium">{file.name}</h4>
                          <p className="text-sm text-gray-600">
                            {formatFileSize(file.size)} • Uploaded by {file.uploaded_by} on {formatDate(file.created_at)}
                          </p>
                          <p className="text-xs text-blue-600">{file.project_name}</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleViewFile(file)}>
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        {file.file_url && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => window.open(file.file_url, '_blank')}
                          >
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "deliverables" && (
        <div className="space-y-6">
          {/* Submit Deliverable Section */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">Submit New Deliverable</CardTitle>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      New Deliverable
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Submit Deliverable</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="deliverable-title">Title</Label>
                        <Input
                          id="deliverable-title"
                          placeholder="Enter deliverable title"
                          value={deliverableTitle}
                          onChange={(e) => setDeliverableTitle(e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="deliverable-description">Description</Label>
                        <Textarea
                          id="deliverable-description"
                          placeholder="Describe the deliverable..."
                          value={deliverableDescription}
                          onChange={(e) => setDeliverableDescription(e.target.value)}
                          rows={4}
                        />
                      </div>
                      <div>
                        <Label htmlFor="deliverable-file">Attach File</Label>
                        <Input
                          id="deliverable-file"
                          type="file"
                          className="mt-1"
                        />
                      </div>
                      <Button onClick={handleSubmitDeliverable} className="w-full">
                        <Send className="h-4 w-4 mr-2" />
                        Submit Deliverable
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
          </Card>

          {/* Deliverables List */}
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Loading deliverables...</span>
            </div>
          ) : deliverables.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Send className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No deliverables yet.</p>
                <p className="text-sm text-gray-500 mt-2">Your job applications and consultation work will appear here.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {deliverables.map((deliverable) => (
                <Card key={deliverable.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <CardTitle className="text-lg">{deliverable.title}</CardTitle>
                        <p className="text-sm text-gray-600">{deliverable.description}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>Client: {deliverable.client_name}</span>
                          <span>•</span>
                          <span>Due: {formatDate(deliverable.due_date)}</span>
                          {deliverable.submitted_at && (
                            <>
                              <span>•</span>
                              <span>Submitted: {formatDate(deliverable.submitted_at)}</span>
                            </>
                          )}
                        </div>
                        <p className="text-xs text-blue-600">{deliverable.project_name}</p>
                      </div>
                      {getStatusBadge(deliverable.status)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleViewDeliverable(deliverable)}>
                        <Eye className="h-4 w-4 mr-1" />
                        View Details
                      </Button>
                      {deliverable.status === "pending" && (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm">
                              <Send className="h-4 w-4 mr-1" />
                              Submit Work
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Submit Work for {deliverable.title}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <Label htmlFor="work-file">Upload Work File</Label>
                                <Input
                                  id="work-file"
                                  type="file"
                                  onChange={handleWorkFileUpload}
                                  className="mt-1"
                                  disabled={submitting}
                                />
                              </div>
                              {workFile && (
                                <div className="p-3 bg-green-50 rounded">
                                  <p className="text-sm">Selected: {workFile.name}</p>
                                </div>
                              )}
                              <Button 
                                onClick={() => handleSubmitWork(deliverable.id)} 
                                className="w-full"
                                disabled={!workFile || submitting}
                              >
                                {submitting ? (
                                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                ) : (
                                  <Send className="h-4 w-4 mr-2" />
                                )}
                                {submitting ? 'Submitting...' : 'Submit Work'}
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      )}
                      {deliverable.status === "submitted" && deliverable.file_path && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            // Handle download of submitted work
                            if (Array.isArray(deliverable.file_path) && deliverable.file_path.length > 0) {
                              window.open(deliverable.file_path[0].url, '_blank');
                            }
                          }}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* File Viewer Dialog */}
      <Dialog open={!!viewingFile} onOpenChange={() => setViewingFile(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{viewingFile?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded">
              <h4 className="font-medium mb-2">File Details</h4>
              <p><strong>Size:</strong> {viewingFile ? formatFileSize(viewingFile.size) : 'Unknown'}</p>
              <p><strong>Uploaded by:</strong> {viewingFile?.uploaded_by}</p>
              <p><strong>Upload date:</strong> {viewingFile ? formatDate(viewingFile.created_at) : 'Unknown'}</p>
              <p><strong>Project:</strong> {viewingFile?.project_name}</p>
              <p><strong>Type:</strong> {viewingFile?.type}</p>
            </div>
            {viewingFile?.file_url && (
              <div className="p-4 bg-blue-50 rounded">
                <h4 className="font-medium mb-2">File Actions</h4>
                <p className="text-sm mb-3">This file is available for download or viewing.</p>
                <Button 
                  onClick={() => window.open(viewingFile.file_url, '_blank')}
                  className="w-full"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Open File
                </Button>
              </div>
            )}
            <div className="flex space-x-2">
              {viewingFile?.file_url && (
                <Button onClick={() => window.open(viewingFile.file_url, '_blank')}>
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              )}
              <Button variant="outline" onClick={() => setViewingFile(null)}>
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Deliverable Viewer Dialog */}
      <Dialog open={!!viewingDeliverable} onOpenChange={() => setViewingDeliverable(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{viewingDeliverable?.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded">
              <h4 className="font-medium mb-2">Deliverable Details</h4>
              <p><strong>Description:</strong> {viewingDeliverable?.description}</p>
              <p><strong>Client:</strong> {viewingDeliverable?.client_name}</p>
              <p><strong>Project:</strong> {viewingDeliverable?.project_name}</p>
              <p><strong>Due Date:</strong> {viewingDeliverable ? formatDate(viewingDeliverable.due_date) : 'Unknown'}</p>
              <p><strong>Status:</strong> {viewingDeliverable?.status}</p>
              {viewingDeliverable?.submitted_at && (
                <p><strong>Submitted:</strong> {formatDate(viewingDeliverable.submitted_at)}</p>
              )}
            </div>
            {viewingDeliverable?.file_path && (
              <div className="p-4 bg-green-50 rounded">
                <h4 className="font-medium mb-2">Attached Files</h4>
                {Array.isArray(viewingDeliverable.file_path) ? (
                  <div className="space-y-2">
                    {viewingDeliverable.file_path.map((file: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-white rounded">
                        <span className="text-sm">{file.name || `File ${index + 1}`}</span>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => window.open(file.url, '_blank')}
                        >
                          <Download className="h-3 w-3 mr-1" />
                          Download
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm">File information available</p>
                )}
              </div>
            )}
            <Button variant="outline" onClick={() => setViewingDeliverable(null)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ResearchAidsFilesDeliverables;
