
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Upload, File, Download, Trash2, Eye } from "lucide-react";

interface FileManagerProps {
  projectId: string;
  permissions: {
    canUpload?: boolean;
    canDelete?: boolean;
  };
}

const FileManager = ({ projectId, permissions }: FileManagerProps) => {
  const [files] = useState([
    {
      id: 1,
      name: "research_data.xlsx",
      type: "spreadsheet",
      size: "2.4 MB",
      uploadedBy: "Dr. Sarah Johnson",
      uploadDate: "2024-01-15T10:30:00Z",
      downloads: 3
    },
    {
      id: 2,
      name: "literature_review.pdf",
      type: "document",
      size: "1.8 MB",
      uploadedBy: "Prof. Michael Chen",
      uploadDate: "2024-01-14T16:20:00Z",
      downloads: 7
    },
    {
      id: 3,
      name: "survey_responses.csv",
      type: "data",
      size: "856 KB",
      uploadedBy: "Dr. Emily Rodriguez",
      uploadDate: "2024-01-13T09:15:00Z",
      downloads: 2
    }
  ]);

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'document':
      case 'spreadsheet':
      case 'data':
      default:
        return File;
    }
  };

  const getFileTypeColor = (type: string) => {
    switch (type) {
      case 'document': return 'bg-red-100 text-red-800';
      case 'spreadsheet': return 'bg-green-100 text-green-800';
      case 'data': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleFileUpload = () => {
    // In real app, this would handle file upload
    console.log("File upload initiated");
  };

  const handleDownload = (fileId: number) => {
    console.log("Downloading file:", fileId);
  };

  const handleDelete = (fileId: number) => {
    console.log("Deleting file:", fileId);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              File Manager
            </CardTitle>
            
            {permissions.canUpload && (
              <Button onClick={handleFileUpload}>
                <Upload className="h-4 w-4 mr-2" />
                Upload File
              </Button>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {files.map((file) => {
            const FileIcon = getFileIcon(file.type);
            
            return (
              <div key={file.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <FileIcon className="h-8 w-8 text-gray-500" />
                    
                    <div className="flex-1">
                      <h4 className="font-medium">{file.name}</h4>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                        <span>{file.size}</span>
                        <span>•</span>
                        <span>by {file.uploadedBy}</span>
                        <span>•</span>
                        <span>{formatDate(file.uploadDate)}</span>
                        <span>•</span>
                        <span>{file.downloads} downloads</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge className={getFileTypeColor(file.type)}>
                      {file.type}
                    </Badge>
                    
                    <div className="flex gap-1">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDownload(file.id)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      
                      {permissions.canDelete && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDelete(file.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          
          {files.length === 0 && (
            <div className="text-center py-8">
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No files uploaded</h3>
              <p className="text-gray-600 mb-4">Upload files to share with your collaborators</p>
              {permissions.canUpload && (
                <Button onClick={handleFileUpload}>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload First File
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FileManager;
