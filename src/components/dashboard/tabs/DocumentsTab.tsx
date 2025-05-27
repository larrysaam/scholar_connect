
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, FileText, File, Image } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const DocumentsTab = () => {
  const { toast } = useToast();

  const documents = [
    {
      id: 1,
      name: "Research Paper Template",
      type: "PDF",
      size: "2.3 MB",
      sharedBy: "Dr. Marie Ngono",
      date: "2024-01-28",
      url: "/research-paper-template.pdf",
      icon: FileText
    },
    {
      id: 2,
      name: "Data Analysis Guidelines",
      type: "DOCX",
      size: "1.8 MB", 
      sharedBy: "Dr. Paul Mbarga",
      date: "2024-01-25",
      url: "/data-analysis-guidelines.docx",
      icon: File
    },
    {
      id: 3,
      name: "Bibliography Format Guide",
      type: "PDF",
      size: "0.9 MB",
      sharedBy: "Prof. Sarah Tankou",
      date: "2024-01-20",
      url: "/bibliography-format-guide.pdf",
      icon: FileText
    },
    {
      id: 4,
      name: "Statistical Analysis Results",
      type: "XLSX",
      size: "3.2 MB",
      sharedBy: "Dr. Michael Chen",
      date: "2024-01-18",
      url: "/statistical-analysis-results.xlsx",
      icon: File
    },
    {
      id: 5,
      name: "Research Presentation",
      type: "PPTX",
      size: "5.1 MB",
      sharedBy: "Dr. Sarah Johnson",
      date: "2024-01-15",
      url: "/research-presentation.pptx",
      icon: File
    }
  ];

  const handleDownload = (document: any) => {
    toast({
      title: "Downloading Document",
      description: `Downloading ${document.name}...`
    });

    // In a real app, this would handle the actual file download
    console.log("Downloading document:", document.url);
    
    // Simulate download by creating a temporary link
    const link = document.createElement('a');
    link.href = document.url;
    link.download = document.name;
    link.click();
    
    // Show success message after simulated download
    setTimeout(() => {
      toast({
        title: "Download Complete",
        description: `${document.name} has been downloaded successfully`
      });
    }, 1000);
  };

  const getFileIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'pdf':
        return FileText;
      case 'docx':
      case 'doc':
        return File;
      case 'xlsx':
      case 'xls':
        return File;
      case 'pptx':
      case 'ppt':
        return File;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return Image;
      default:
        return File;
    }
  };

  const getFileTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'pdf':
        return 'bg-red-100 text-red-800';
      case 'docx':
      case 'doc':
        return 'bg-blue-100 text-blue-800';
      case 'xlsx':
      case 'xls':
        return 'bg-green-100 text-green-800';
      case 'pptx':
      case 'ppt':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Documents</h2>
        <Badge variant="secondary">
          {documents.length} Documents
        </Badge>
      </div>
      
      <p className="text-gray-600">Access shared documents and resources from your consultations.</p>

      <div className="space-y-4">
        {documents.map((document) => {
          const IconComponent = getFileIcon(document.type);
          return (
            <Card key={document.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <IconComponent className="h-8 w-8 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{document.name}</h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge className={getFileTypeColor(document.type)}>
                          {document.type}
                        </Badge>
                        <span className="text-sm text-gray-500">{document.size}</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        Shared by {document.sharedBy} • {document.date}
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleDownload(document)}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {documents.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No documents yet</h3>
            <p className="text-gray-500">Documents shared in consultations will appear here.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DocumentsTab;
