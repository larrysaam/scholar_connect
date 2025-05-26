
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { FileText, Upload, Download, Clock, CheckCircle, AlertCircle, RotateCcw } from "lucide-react";

interface Deliverable {
  id: string;
  projectTitle: string;
  studentName: string;
  fileName: string;
  fileType: string;
  fileSize: string;
  status: "draft" | "final" | "awaiting-feedback" | "approved" | "revision-needed";
  uploadDate: string;
  version: number;
  description: string;
}

const mockDeliverables: Deliverable[] = [
  {
    id: "1",
    projectTitle: "Urban Mobility Data Analysis",
    studentName: "Kome Divine",
    fileName: "cleaned_mobility_data.xlsx",
    fileType: "Excel",
    fileSize: "2.3 MB",
    status: "awaiting-feedback",
    uploadDate: "2024-01-24",
    version: 2,
    description: "Cleaned survey data with outliers removed and missing values handled"
  },
  {
    id: "2",
    projectTitle: "Climate Change Thesis",
    studentName: "Sama Njoya",
    fileName: "chapter3_edited.docx",
    fileType: "Word Document",
    fileSize: "1.8 MB",
    status: "final",
    uploadDate: "2024-01-23",
    version: 3,
    description: "Comprehensive editing with APA formatting and grammar corrections"
  },
  {
    id: "3",
    projectTitle: "Land Use Mapping",
    studentName: "Paul Biya Jr.",
    fileName: "land_use_maps.pdf",
    fileType: "PDF",
    fileSize: "5.2 MB",
    status: "draft",
    uploadDate: "2024-01-24",
    version: 1,
    description: "Initial GIS maps showing land use changes over the past decade"
  }
];

const ResearchAidsFilesDeliverables = () => {
  const [deliverables] = useState(mockDeliverables);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft": return "bg-yellow-100 text-yellow-800";
      case "final": return "bg-green-100 text-green-800";
      case "awaiting-feedback": return "bg-blue-100 text-blue-800";
      case "approved": return "bg-green-100 text-green-800";
      case "revision-needed": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "draft": return <Clock className="h-4 w-4" />;
      case "final": return <CheckCircle className="h-4 w-4" />;
      case "awaiting-feedback": return <Clock className="h-4 w-4" />;
      case "approved": return <CheckCircle className="h-4 w-4" />;
      case "revision-needed": return <AlertCircle className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      console.log("File selected:", file.name);
    }
  };

  const handleUploadFile = () => {
    if (selectedFile) {
      console.log("Uploading file:", selectedFile.name);
      setSelectedFile(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Files & Deliverables</h2>
        <p className="text-gray-600">Upload your work and manage project deliverables</p>
      </div>

      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Upload className="h-5 w-5" />
            <span>Upload Final Work</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-lg font-medium mb-2">Upload your deliverable</p>
              <p className="text-gray-600 mb-4">Drag and drop files or click to browse</p>
              <Input
                type="file"
                onChange={handleFileUpload}
                className="max-w-xs mx-auto"
                accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip,.rar"
              />
            </div>
            
            {selectedFile && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{selectedFile.name}</p>
                    <p className="text-sm text-gray-600">{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                  </div>
                  <Button onClick={handleUploadFile}>
                    Upload File
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Deliverables List */}
      <Card>
        <CardHeader>
          <CardTitle>Your Deliverables</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {deliverables.map((deliverable) => (
              <div key={deliverable.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <FileText className="h-5 w-5 text-gray-500" />
                      <h3 className="font-semibold">{deliverable.fileName}</h3>
                      <Badge className={getStatusColor(deliverable.status)}>
                        <div className="flex items-center space-x-1">
                          {getStatusIcon(deliverable.status)}
                          <span>{deliverable.status.replace('-', ' ').toUpperCase()}</span>
                        </div>
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-3">
                      <div>
                        <span className="font-medium">Project:</span> {deliverable.projectTitle}
                      </div>
                      <div>
                        <span className="font-medium">Student:</span> {deliverable.studentName}
                      </div>
                      <div>
                        <span className="font-medium">Version:</span> {deliverable.version}
                      </div>
                      <div>
                        <span className="font-medium">Type:</span> {deliverable.fileType}
                      </div>
                      <div>
                        <span className="font-medium">Size:</span> {deliverable.fileSize}
                      </div>
                      <div>
                        <span className="font-medium">Uploaded:</span> {new Date(deliverable.uploadDate).toLocaleDateString()}
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3">{deliverable.description}</p>
                  </div>
                  
                  <div className="flex space-x-2 ml-4">
                    <Button size="sm" variant="outline">
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                    <Button size="sm" variant="outline">
                      <RotateCcw className="h-4 w-4 mr-1" />
                      New Version
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* File Management Features */}
      <Card>
        <CardHeader>
          <CardTitle>File Management Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <RotateCcw className="h-8 w-8 text-blue-600 mx-auto mb-3" />
              <h4 className="font-medium mb-2">Version History</h4>
              <p className="text-sm text-gray-600">Track and restore previous file versions</p>
            </div>
            <div className="text-center">
              <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-3" />
              <h4 className="font-medium mb-2">Student Review</h4>
              <p className="text-sm text-gray-600">Students can approve or request revisions</p>
            </div>
            <div className="text-center">
              <FileText className="h-8 w-8 text-purple-600 mx-auto mb-3" />
              <h4 className="font-medium mb-2">File Status Tracking</h4>
              <p className="text-sm text-gray-600">Monitor progress from draft to final approval</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResearchAidsFilesDeliverables;
