
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { 
  Upload, 
  Download, 
  FileText, 
  Image, 
  FileSpreadsheet, 
  File,
  Clock,
  CheckCircle,
  AlertCircle
} from "lucide-react";

const ResearchAidsFilesDeliverables = () => {
  const [activeTab, setActiveTab] = useState("deliverables");

  const deliverables = [
    {
      id: 1,
      project: "Statistical Analysis Project",
      client: "Dr. Sarah Johnson",
      title: "Preliminary Analysis Report",
      description: "Initial statistical findings and data visualization",
      dueDate: "2024-01-30",
      status: "in-progress",
      progress: 75,
      files: [
        { name: "analysis_report_v1.docx", type: "document", size: "2.4 MB", uploadedAt: "2024-01-25" },
        { name: "data_visualizations.xlsx", type: "spreadsheet", size: "1.8 MB", uploadedAt: "2024-01-25" }
      ]
    },
    {
      id: 2,
      project: "Literature Review",
      client: "Prof. Michael Chen",
      title: "Chapter 1: Introduction",
      description: "Literature review introduction and methodology",
      dueDate: "2024-02-05",
      status: "submitted",
      progress: 100,
      submittedAt: "2024-01-28",
      files: [
        { name: "chapter1_final.pdf", type: "document", size: "3.2 MB", uploadedAt: "2024-01-28" }
      ]
    },
    {
      id: 3,
      project: "Agricultural Study",
      client: "Dr. Marie Dubois",
      title: "Data Collection Protocol",
      description: "Detailed methodology for field data collection",
      dueDate: "2024-02-10",
      status: "pending",
      progress: 25,
      files: []
    }
  ];

  const receivedFiles = [
    {
      id: 1,
      project: "Statistical Analysis Project",
      client: "Dr. Sarah Johnson",
      fileName: "raw_dataset.xlsx",
      type: "spreadsheet",
      size: "4.7 MB",
      receivedAt: "2024-01-20",
      description: "Primary dataset for statistical analysis"
    },
    {
      id: 2,
      project: "Literature Review",
      client: "Prof. Michael Chen",
      fileName: "reference_materials.zip",
      type: "archive",
      size: "12.3 MB",
      receivedAt: "2024-01-18",
      description: "Supporting documents and reference materials"
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
      case "overdue":
        return <Badge variant="destructive">Overdue</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case "document":
        return <FileText className="h-5 w-5 text-blue-600" />;
      case "spreadsheet":
        return <FileSpreadsheet className="h-5 w-5 text-green-600" />;
      case "image":
        return <Image className="h-5 w-5 text-purple-600" />;
      default:
        return <File className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "submitted":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "in-progress":
        return <Clock className="h-5 w-5 text-blue-600" />;
      case "overdue":
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Clock className="h-5 w-5 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Files & Deliverables</h2>
        <div className="flex space-x-2">
          <Button 
            variant={activeTab === "deliverables" ? "default" : "outline"} 
            onClick={() => setActiveTab("deliverables")}
          >
            My Deliverables
          </Button>
          <Button 
            variant={activeTab === "received" ? "default" : "outline"} 
            onClick={() => setActiveTab("received")}
          >
            Received Files
          </Button>
        </div>
      </div>

      {activeTab === "deliverables" && (
        <div className="space-y-4">
          {deliverables.map((deliverable) => (
            <Card key={deliverable.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <CardTitle className="text-lg">{deliverable.title}</CardTitle>
                    <p className="text-sm text-gray-600">{deliverable.project} • {deliverable.client}</p>
                    <p className="text-sm text-gray-700">{deliverable.description}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(deliverable.status)}
                    {getStatusBadge(deliverable.status)}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span>Progress: {deliverable.progress}%</span>
                    <span>Due: {deliverable.dueDate}</span>
                  </div>
                  <Progress value={deliverable.progress} className="w-full" />
                  
                  {deliverable.submittedAt && (
                    <p className="text-sm text-green-600">Submitted on {deliverable.submittedAt}</p>
                  )}

                  {deliverable.files.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">Attached Files:</h4>
                      {deliverable.files.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <div className="flex items-center space-x-2">
                            {getFileIcon(file.type)}
                            <div>
                              <p className="text-sm font-medium">{file.name}</p>
                              <p className="text-xs text-gray-500">{file.size} • Uploaded {file.uploadedAt}</p>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Upload className="h-4 w-4 mr-1" />
                      Upload Files
                    </Button>
                    {deliverable.status === "in-progress" && (
                      <Button size="sm">
                        Submit Deliverable
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {activeTab === "received" && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Upload New Files</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-600 mb-2">Drag and drop files here, or click to browse</p>
                <Button variant="outline">Choose Files</Button>
              </div>
            </CardContent>
          </Card>

          {receivedFiles.map((file) => (
            <Card key={file.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getFileIcon(file.type)}
                    <div>
                      <h4 className="font-medium">{file.fileName}</h4>
                      <p className="text-sm text-gray-600">{file.project} • {file.client}</p>
                      <p className="text-sm text-gray-500">{file.description}</p>
                      <p className="text-xs text-gray-400">{file.size} • Received {file.receivedAt}</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ResearchAidsFilesDeliverables;
