import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, CheckCircle, AlertTriangle, Upload, FileText, User, GraduationCap, Award, Building, Loader2, XCircle, File, FileImage, FileText as FileTextIcon } from "lucide-react";
import { useAuth } from '@/hooks/useAuth';
import { useResearcherProfile } from '@/hooks/useResearcherProfile';
import { useDocumentUpload } from '@/hooks/useDocumentUpload';
import { useToast } from '@/components/ui/use-toast';
import { verificationService, type VerificationDocument } from '@/services/verificationService';

interface VerificationItem {
  key: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  maxFiles?: number;
  required?: boolean;
}

const VERIFICATION_ITEMS: VerificationItem[] = [
  {
    key: 'identity',
    title: 'Identity Document',
    description: 'A government-issued ID (passport, national ID, or driver\'s license)',
    icon: <User className="h-6 w-6" />,
    maxFiles: 1,
    required: true
  },
  {
    key: 'academic',
    title: 'Academic Credentials',
    description: 'Your highest academic qualification (degree, diploma, or certificate)',
    icon: <GraduationCap className="h-6 w-6" />,
    maxFiles: 3,
    required: true
  },
  {
    key: 'professional',
    title: 'Professional Certifications',
    description: 'Any relevant professional certifications or licenses',
    icon: <Award className="h-6 w-6" />,
    maxFiles: 5
  },
  {
    key: 'employment',
    title: 'Employment',
    description: 'Current or previous employment verification',
    icon: <Building className="h-6 w-6" />
  }
];

const VerificationTab = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { researcher, loading: profileLoading, updateProfile, refetch } = useResearcherProfile(user?.id || '');
  const { uploadDocument, deleteDocument, isUploading } = useDocumentUpload(user?.id || '', 'researcher');
  
  const [loadingStates, setLoadingStates] = useState<{ [key: string]: boolean }>({});
  const [otherEmployment, setOtherEmployment] = useState("");

  useEffect(() => {
    if (researcher?.verifications?.employment?.otherDetails) {
      setOtherEmployment(researcher.verifications.employment.otherDetails);
    }
  }, [researcher]);

  useEffect(() => {
    if (researcher?.verifications) {
      console.log('Researcher verifications:', researcher.verifications);
    }
  }, [researcher]);

  // Check if user is profile owner
  const isProfileOwner = user && researcher && user.id === researcher.id;

  // File upload handler with improved error handling and type validation
  const handleFileUpload = async (categoryKey: string) => {
    if (!user) {
      toast({ title: 'Error', description: 'You must be logged in to upload documents.', variant: 'destructive' });
      return;
    }

    // Create file input
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf,.doc,.docx,.jpg,.jpeg,.png,.webp';
    
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      // Set loading state
      setLoadingStates(prev => ({ ...prev, [categoryKey]: true }));
      
      try {
        // Upload the document
        const result = await uploadDocument(file, categoryKey);
        if (!result) throw new Error('Failed to upload file');

        // Refresh profile data
        await refetch();

        toast({
          title: 'Success',
          description: 'Document uploaded successfully.',
        });
      } catch (error) {
        console.error('Upload error:', error);
        toast({
          title: 'Error',
          description: error instanceof Error ? error.message : 'Failed to upload document',
          variant: 'destructive',
        });
      } finally {
        setLoadingStates(prev => ({ ...prev, [categoryKey]: false }));
      }
    };

    input.click();
  };

  // Document deletion handler
  const handleDeleteDocument = async (categoryKey: string, documentId: string) => {
    if (!user || !researcher) return;

    try {
      // Set loading state
      setLoadingStates(prev => ({ ...prev, [categoryKey]: true }));

      // Delete document
      await deleteDocument(categoryKey, documentId);
      
      // Refresh profile data
      await refetch();

      toast({
        title: 'Success',
        description: 'Document deleted successfully.',
      });
    } catch (error) {
      console.error('Delete error:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to delete document',
        variant: 'destructive',
      });
    } finally {
      setLoadingStates(prev => ({ ...prev, [categoryKey]: false }));
    }
  };

  // Helper to get file preview type with enhanced preview
  const getFilePreview = (fileUrl: string, fileName: string) => {
    console.log('getFilePreview called with:', { fileUrl, fileName });
    
    if (!fileUrl || !fileName) {
      console.warn('Missing URL or filename for preview:', { fileUrl, fileName });
      return null;
    }

    const ext = fileName.split('.').pop()?.toLowerCase();
    if (!ext) {
      console.warn('Could not determine file extension:', fileName);
      return null;
    }
    
    console.log('Attempting to render preview:', { fileUrl, fileName, ext });
    
    // Image files - show thumbnail
    if (["jpg", "jpeg", "png", "gif", "bmp", "webp"].includes(ext)) {
      return (
        <div className="mt-2">
          <img 
            src={fileUrl} 
            alt={fileName} 
            className="max-h-32 max-w-full rounded border cursor-pointer hover:opacity-80 transition-opacity" 
            onClick={() => window.open(fileUrl, '_blank')}
            onError={(e) => {
              console.error('Image load error:', e);
              const img = e.currentTarget;
              console.log('Failed image URL:', img.src);
              img.src = '/placeholder.svg';
            }}
          />
        </div>
      );
    }
    
    // PDF files - show preview
    if (ext === "pdf") {
      return (
        <div className="mt-2">
          <iframe 
            src={`${fileUrl}#toolbar=0`}
            className="w-full h-[200px] border rounded-md"
            title={fileName}
            onLoad={() => console.log('PDF iframe loaded successfully')}
            onError={(e) => console.error('PDF load error:', e)}
          />
        </div>
      );
    }
    
    // Other files - show download link
    return (
      <div className="mt-2 p-2 bg-gray-50 border border-gray-200 rounded">
        <a 
          href={fileUrl} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="flex items-center text-gray-600 hover:text-gray-800 font-medium"
        >
          <FileText className="h-4 w-4 mr-2" />
          Download {fileName}
        </a>
      </div>
    );
  };

  // Helper to get file icon based on extension
  const getFileIcon = (filename: string) => {
    const ext = filename.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'pdf':
        return <FileText className="h-5 w-5 text-red-500" />;
      case 'doc':
      case 'docx':
        return <FileText className="h-5 w-5 text-blue-500" />;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'webp':
        return <FileImage className="h-5 w-5 text-green-500" />;
      default:
        return <File className="h-5 w-5 text-gray-500" />;
    }
  };

  // Helper to get status info for badges
  const getStatusInfo = (status: VerificationDocument['status']) => {
    switch (status) {
      case 'approved':
        return { color: 'bg-green-100 text-green-800', icon: <CheckCircle className="h-4 w-4 text-green-600" /> };
      case 'pending':
        return { color: 'bg-yellow-100 text-yellow-800', icon: <AlertTriangle className="h-4 w-4 text-yellow-600" /> };
      case 'rejected':
        return { color: 'bg-red-100 text-red-800', icon: <AlertTriangle className="h-4 w-4 text-red-600" /> };
      default:
        return { color: 'bg-gray-100 text-gray-800', icon: <Shield className="h-4 w-4 text-gray-500" /> };
    }
  };

  if (profileLoading) {
    return (
      <div className="h-[200px] flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // Render verification items
  return (
    <div className="space-y-6">
      {VERIFICATION_ITEMS.map((item) => {
        const verifications = researcher?.verifications || {};
        const categoryData = verifications[item.key];
        const documents = (categoryData?.documents || []) as VerificationDocument[];

        const statusInfo = getStatusInfo(documents[0]?.status || 'pending');

        return (
          <Card key={item.key} className="relative">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2">
                  {item.icon}
                  <div>
                    <CardTitle>{item.title}</CardTitle>
                    <CardDescription>{item.description}</CardDescription>
                  </div>
                </div>
                <Badge variant="outline" className={statusInfo.color}>
                  <div className="flex items-center space-x-1">
                    {statusInfo.icon}
                    <span>{documents[0]?.status || 'Not uploaded'}</span>
                  </div>
                </Badge>
              </div>
            </CardHeader>

            <CardContent>
              {/* Document List */}
            
              {documents.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {documents.map((doc) => (
                    <Card key={doc.id} className="relative p-4 hover:shadow-lg transition-shadow duration-200">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            {getFileIcon(doc.filename)}
                            <p className="font-semibold text-sm truncate">{doc.filename}</p>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Uploaded {new Date(doc.uploadedAt).toLocaleDateString()}
                          </p>
                          {doc.rejectionReason && (
                            <Badge variant="destructive" className="mt-1 text-xs">
                              Rejected: {doc.rejectionReason}
                            </Badge>
                          )}
                        </div>
                        {isProfileOwner && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteDocument(item.key, doc.id)}
                            disabled={loadingStates[item.key]}
                            className="absolute top-2 right-2 h-8 w-8 p-0 hover:bg-destructive hover:text-destructive-foreground"
                          >
                            {loadingStates[item.key] ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <XCircle className="h-4 w-4" />
                            )}
                          </Button>
                        )}
                      </div>
                      <div className="mt-3">
                        {doc.url ? (
                          <div className="border rounded-md overflow-hidden bg-muted/50">
                            {getFilePreview(doc.url, doc.filename)}
                          </div>
                        ) : (
                          <div className="flex items-center justify-center h-32 bg-muted/50 rounded-md">
                            <p className="text-sm text-muted-foreground">Preview not available</p>
                          </div>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              )}

              {/* Upload Button */}
              {isProfileOwner && (!item.maxFiles || documents.length < item.maxFiles) && (
                <div className="mt-4">
                  <Button
                    variant="outline"
                    onClick={() => handleFileUpload(item.key)}
                    disabled={loadingStates[item.key] || isUploading}
                    className="w-full"
                  >
                    {loadingStates[item.key] || isUploading ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Upload className="h-4 w-4 mr-2" />
                    )}
                    Upload Document
                  </Button>
                  <p className="text-xs text-gray-500 mt-1">
                    Supported formats: PDF, DOC, DOCX, JPG, PNG (max 5MB)
                  </p>
                </div>
              )}

              {/* Other Details Input (for Employment) */}
              {item.key === 'employment' && isProfileOwner && (
                <div className="mt-4">
                  <Label htmlFor="otherEmployment">Other Employment Details</Label>
                  <Input
                    id="otherEmployment"
                    value={otherEmployment}
                    onChange={(e) => setOtherEmployment(e.target.value)}
                    onBlur={async () => {
                      const currentVerifications = researcher?.verifications || {};
                      if (!currentVerifications.employment) {
                        currentVerifications.employment = { documents: [] };
                      }
                      currentVerifications.employment.otherDetails = otherEmployment;
                      await verificationService.uploadDocument(
                        new File([otherEmployment], 'employment-details.txt', { type: 'text/plain' }),
                        'employment',
                        user.id,
                        'researcher'
                      );
                      await refetch();
                    }}
                    placeholder="Enter any other employment details..."
                    className="mt-1"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default VerificationTab;
