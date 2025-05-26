
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Upload, FileText, Check, Clock, X } from "lucide-react";

const VerificationDocumentsTab = () => {
  const [uploadedDocuments, setUploadedDocuments] = useState([
    {
      id: "1",
      name: "PhD Certificate",
      type: "academic",
      status: "verified",
      uploadDate: "2024-01-15",
      fileName: "phd_certificate.pdf"
    },
    {
      id: "2", 
      name: "Publication Record",
      type: "publication",
      status: "pending",
      uploadDate: "2024-01-20",
      fileName: "publications_list.pdf"
    },
    {
      id: "3",
      name: "Employment Verification",
      type: "institutional",
      status: "rejected",
      uploadDate: "2024-01-10",
      fileName: "employment_letter.pdf",
      rejectionReason: "Document quality is poor, please upload a clearer version"
    }
  ]);

  const handleFileUpload = (documentType: string) => {
    console.log("Uploading document for:", documentType);
    // In a real app, this would handle file upload
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf,.doc,.docx,.jpg,.jpeg,.png';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        console.log("File selected:", file.name);
        // Add to uploaded documents list
        const newDoc = {
          id: Date.now().toString(),
          name: documentType,
          type: documentType.toLowerCase(),
          status: "pending" as const,
          uploadDate: new Date().toISOString().split('T')[0],
          fileName: file.name
        };
        setUploadedDocuments(prev => [...prev, newDoc]);
      }
    };
    input.click();
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "verified":
        return <Check className="h-4 w-4 text-green-600" />;
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case "rejected":
        return <X className="h-4 w-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "verified":
        return <Badge className="bg-green-100 text-green-800">Verified</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending Review</Badge>;
      case "rejected":
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      default:
        return null;
    }
  };

  const documentTypes = [
    { key: "academic", label: "Academic Credentials", description: "PhD, Master's, Bachelor's certificates" },
    { key: "publication", label: "Publication Records", description: "List of published research papers" },
    { key: "institutional", label: "Institutional Verification", description: "Employment verification letters" },
    { key: "professional", label: "Professional Licenses", description: "Professional certifications and licenses" },
    { key: "identity", label: "Identity Verification", description: "National ID, Passport" }
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Verification Documents</h2>
        <p className="text-gray-600">
          Upload your credentials and documents for verification. These documents will only be visible to administrators for verification purposes.
        </p>
      </div>

      {/* Document Upload Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {documentTypes.map((docType) => (
          <Card key={docType.key} className="border-dashed border-2 hover:border-blue-300 transition-colors">
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-lg flex items-center justify-center">
                <FileText className="h-5 w-5 mr-2" />
                {docType.label}
              </CardTitle>
              <CardDescription>{docType.description}</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button
                onClick={() => handleFileUpload(docType.label)}
                variant="outline"
                className="w-full"
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload Document
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Uploaded Documents List */}
      <Card>
        <CardHeader>
          <CardTitle>Uploaded Documents</CardTitle>
          <CardDescription>
            Track the status of your uploaded verification documents
          </CardDescription>
        </CardHeader>
        <CardContent>
          {uploadedDocuments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No documents uploaded yet
            </div>
          ) : (
            <div className="space-y-4">
              {uploadedDocuments.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    {getStatusIcon(doc.status)}
                    <div>
                      <h4 className="font-medium">{doc.name}</h4>
                      <p className="text-sm text-gray-600">{doc.fileName}</p>
                      <p className="text-xs text-gray-500">Uploaded: {doc.uploadDate}</p>
                      {doc.rejectionReason && (
                        <p className="text-xs text-red-600 mt-1">{doc.rejectionReason}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    {getStatusBadge(doc.status)}
                    {doc.status === "rejected" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleFileUpload(doc.name)}
                      >
                        Re-upload
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Admin Note */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <div className="flex items-start space-x-2">
          <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center mt-0.5">
            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
          </div>
          <div>
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> All uploaded documents are securely stored and only accessible to authorized administrators for verification purposes. 
              Documents are processed within 2-3 business days.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerificationDocumentsTab;
