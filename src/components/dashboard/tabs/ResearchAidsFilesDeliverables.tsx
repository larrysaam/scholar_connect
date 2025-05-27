
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Upload, Download, FileText, Eye, Send, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ResearchAidsFilesDeliverables = () => {
  const [activeTab, setActiveTab] = useState("files");
  const [deliverableTitle, setDeliverableTitle] = useState("");
  const [deliverableDescription, setDeliverableDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();

  const files = [
    {
      id: 1,
      name: "Research_Data_Analysis.xlsx",
      type: "spreadsheet",
      size: "2.5 MB",
      uploadedBy: "Dr. Sarah Johnson",
      uploadDate: "2024-01-25",
      project: "Statistical Analysis Project"
    },
    {
      id: 2,
      name: "Literature_Sources.pdf",
      type: "document",
      size: "1.8 MB",
      uploadedBy: "Prof. Michael Chen",
      uploadDate: "2024-01-24",
      project: "Climate Change Review"
    },
    {
      id: 3,
      name: "Survey_Questions.docx",
      type: "document",
      size: "456 KB",
      uploadedBy: "Dr. Marie Dubois",
      uploadDate: "2024-01-23",
      project: "Agricultural Study"
    }
  ];

  const deliverables = [
    {
      id: 1,
      title: "Statistical Analysis Report",
      description: "Complete analysis with findings and recommendations",
      status: "submitted",
      dueDate: "2024-01-30",
      submittedDate: "2024-01-28",
      project: "Statistical Analysis Project",
      client: "Dr. Sarah Johnson"
    },
    {
      id: 2,
      title: "Literature Review Draft",
      description: "First draft of comprehensive literature review",
      status: "in-progress",
      dueDate: "2024-02-05",
      project: "Climate Change Review",
      client: "Prof. Michael Chen"
    },
    {
      id: 3,
      title: "Data Collection Plan",
      description: "Detailed methodology and timeline for field work",
      status: "pending",
      dueDate: "2024-02-10",
      project: "Agricultural Study",
      client: "Dr. Marie Dubois"
    }
  ];

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
                  />
                </div>
                {selectedFile && (
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <span className="text-sm">{selectedFile.name}</span>
                    <Button onClick={handleUploadFile}>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Files List */}
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
                          {file.size} • Uploaded by {file.uploadedBy} on {file.uploadDate}
                        </p>
                        <p className="text-xs text-blue-600">{file.project}</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDownload(file.name)}>
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
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
          <div className="space-y-4">
            {deliverables.map((deliverable) => (
              <Card key={deliverable.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <CardTitle className="text-lg">{deliverable.title}</CardTitle>
                      <p className="text-sm text-gray-600">{deliverable.description}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>Client: {deliverable.client}</span>
                        <span>•</span>
                        <span>Due: {deliverable.dueDate}</span>
                        {deliverable.submittedDate && (
                          <>
                            <span>•</span>
                            <span>Submitted: {deliverable.submittedDate}</span>
                          </>
                        )}
                      </div>
                      <p className="text-xs text-blue-600">{deliverable.project}</p>
                    </div>
                    {getStatusBadge(deliverable.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      View Details
                    </Button>
                    {deliverable.status === "pending" && (
                      <Button size="sm">
                        <Send className="h-4 w-4 mr-1" />
                        Submit Work
                      </Button>
                    )}
                    {deliverable.status === "submitted" && (
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResearchAidsFilesDeliverables;
