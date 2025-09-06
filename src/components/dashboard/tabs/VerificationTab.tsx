import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, CheckCircle, AlertTriangle, Upload, FileText, User, GraduationCap, Award, Building, Loader2, XCircle } from "lucide-react";
import { useAuth } from '@/hooks/useAuth';
import { useResearcherProfile } from '@/hooks/useResearcherProfile';
import { useDocumentUpload } from '@/hooks/useDocumentUpload';
import { useToast } from '@/components/ui/use-toast';

// Define the structure for a single verification document
interface VerificationDocument {
  documentType: string;
  status: 'verified' | 'pending' | 'rejected' | 'not_started';
  fileUrl?: string;
  fileName?: string;
  uploadedAt?: string;
  rejectionReason?: string;
}

// Define the structure for a verification category
interface VerificationCategory {
  documents: VerificationDocument[];
  otherDetails?: string;
}

// Define the overall verifications structure
interface Verifications {
  [key: string]: VerificationCategory;
}

const VerificationTab = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { researcher, loading: profileLoading, updateProfile, refetch } = useResearcherProfile(user?.id || '');
  const { uploadDocument } = useDocumentUpload();

  const [loadingStates, setLoadingStates] = useState<{ [key: string]: boolean }>({});
  const [otherEmployment, setOtherEmployment] = useState("");

  useEffect(() => {
    if (researcher?.verifications?.employment?.otherDetails) {
      setOtherEmployment(researcher.verifications.employment.otherDetails);
    }
  }, [researcher]);

  // Helper to always get verifications as an object
  function getCurrentVerifications(verifications: any): Verifications {
    if (typeof verifications === 'string') {
      try {
        return JSON.parse(verifications);
      } catch {
        return {};
      }
    } else if (typeof verifications === 'object' && verifications !== null) {
      return { ...verifications };
    }
    return {};
  }

  // Helper to get file preview type
  function getFilePreview(fileUrl: string, fileName?: string) {
    const ext = (fileName || fileUrl).split('.').pop()?.toLowerCase();
    if (!ext) return null;
    if (["jpg", "jpeg", "png", "gif", "bmp", "webp"].includes(ext)) {
      return <img src={fileUrl} alt={fileName} className="max-h-32 max-w-xs rounded border" />;
    }
    if (["pdf"].includes(ext)) {
      return (
        <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="block text-blue-600 underline">
          PDF Preview
        </a>
      );
    }
    // For doc, docx, etc.
    return (
      <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="block text-blue-600 underline">
        Download {fileName || 'File'}
      </a>
    );
  }

  const aidVerificationItems = [
    {
      key: 'identity',
      title: "Identity Verification",
      description: "Government-issued ID verification",
      icon: User,
      documents: ["Passport", "Driver's License", "National ID Card"]
    },
    {
      key: 'education',
      title: "Educational Background",
      description: "Academic credentials and degrees (e.g., BSc, MSc, PhD)",
      icon: GraduationCap,
      documents: ["Degree Certificate", "Academic Transcript"]
    },
    {
      key: 'employment',
      title: "Employment Verification",
      description: "Current or previous institutional affiliation (if any)",
      icon: Building,
      documents: ["Employment Letter", "Institutional ID"],
      hasOtherField: true
    },
    {
      key: 'skills',
      title: "Skills & Certifications",
      description: "Professional certifications or proof of skills",
      icon: Award,
      documents: ["Certification Document", "Reference Letter"]
    }
  ];

  const verificationItems = aidVerificationItems;

  const getStatusInfo = (status: VerificationDocument['status']) => {
    switch (status) {
      case 'verified':
        return { color: 'bg-green-100 text-green-800', icon: <CheckCircle className="h-4 w-4 text-green-600" /> };
      case 'pending':
        return { color: 'bg-yellow-100 text-yellow-800', icon: <AlertTriangle className="h-4 w-4 text-yellow-600" /> };
      case 'rejected':
        return { color: 'bg-red-100 text-red-800', icon: <AlertTriangle className="h-4 w-4 text-red-600" /> };
      default:
        return { color: 'bg-gray-100 text-gray-800', icon: <AlertTriangle className="h-4 w-4 text-gray-500" /> };
    }
  };

  // Defensive: Only allow actions if user is profile owner
  const isProfileOwner = user && researcher && user.id === researcher.id;

  // Improved file upload with error handling and owner check
  const handleFileUpload = async (categoryKey: string, documentType: string) => {
    if (!isProfileOwner) {
      toast({ title: 'Permission Denied', description: 'You can only upload documents for your own profile.', variant: 'destructive' });
      return;
    }
    const loadingKey = `${categoryKey}-${documentType}`;
    setLoadingStates(prev => ({ ...prev, [loadingKey]: true }));
    try {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.pdf,.doc,.docx,.jpg,.jpeg,.png';
      input.onchange = async (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file && user) {
          try {
            const path = `public/${user.id}/${file.name}`;
            const fileUrl = await uploadDocument(file, 'lovable-uploads', path);
            if (fileUrl && researcher) {
              let currentVerifications: Verifications = getCurrentVerifications(researcher.verifications);
              if (!currentVerifications[categoryKey]) {
                currentVerifications[categoryKey] = { documents: [] };
              }
              const docIndex = currentVerifications[categoryKey].documents.findIndex(d => d.documentType === documentType);
              const newDocument: VerificationDocument = {
                documentType,
                status: 'pending',
                fileUrl,
                fileName: file.name,
                uploadedAt: new Date().toISOString(),
              };
              if (docIndex > -1) {
                currentVerifications[categoryKey].documents[docIndex] = newDocument;
              } else {
                currentVerifications[categoryKey].documents.push(newDocument);
              }
              await updateProfile({ verifications: currentVerifications });
              refetch();
            }
          } catch (err: any) {
            toast({ title: 'Upload Failed', description: err?.message || 'An error occurred during upload.', variant: 'destructive' });
          }
        }
        setLoadingStates(prev => ({ ...prev, [loadingKey]: false }));
      };
      input.click();
      input.oncancel = () => {
        setLoadingStates(prev => ({ ...prev, [loadingKey]: false }));
      };
    } catch (err: any) {
      setLoadingStates(prev => ({ ...prev, [loadingKey]: false }));
      toast({ title: 'Upload Error', description: err?.message || 'An error occurred.', variant: 'destructive' });
    }
  };

  // Improved remove file with error handling and owner check
  const handleRemoveFile = async (categoryKey: string, documentType: string) => {
    if (!isProfileOwner) {
      toast({ title: 'Permission Denied', description: 'You can only remove documents from your own profile.', variant: 'destructive' });
      return;
    }
    try {
      if (!researcher) return;
      let currentVerifications: Verifications = getCurrentVerifications(researcher.verifications);
      if (!currentVerifications[categoryKey]) return;
      currentVerifications[categoryKey].documents = currentVerifications[categoryKey].documents.filter(
        d => d.documentType !== documentType
      );
      await updateProfile({ verifications: currentVerifications });
      refetch();
    } catch (err: any) {
      toast({ title: 'Remove Failed', description: err?.message || 'An error occurred while removing the file.', variant: 'destructive' });
    }
  };

  const handleSaveOtherEmployment = async () => {
    if (!researcher) return;
    let currentVerifications: Verifications = getCurrentVerifications(researcher.verifications);
    if (!currentVerifications.employment) {
      currentVerifications.employment = { documents: [] };
    }
    currentVerifications.employment.otherDetails = otherEmployment;
    await updateProfile({ verifications: currentVerifications });
    toast({ title: "Success", description: "Employment details saved." });
  };

  if (profileLoading) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  // Use parsed verifications for progress calculation
  const parsedVerifications: Verifications = getCurrentVerifications(researcher?.verifications);
  const totalRequiredDocs = verificationItems.flatMap(item => item.documents).length;
  const totalVerifiedDocs = Object.values(parsedVerifications)
    .flatMap((c: any) => Array.isArray(c.documents) ? c.documents : [])
    .filter((d: any) => d.status === 'verified').length;
  const verificationProgress = totalRequiredDocs > 0 ? (totalVerifiedDocs / totalRequiredDocs) * 100 : 0;

  // Calculate overall verification status (all required docs must be verified)
  const allCategoriesVerified = totalVerifiedDocs === totalRequiredDocs && totalRequiredDocs > 0;

  // Use parsedVerifications for category status
  const getCategoryStatus = (categoryKey: string): VerificationDocument['status'] => {
    const category = parsedVerifications?.[categoryKey];
    if (!category || !Array.isArray(category.documents) || category.documents.length === 0) return 'not_started';
    if (category.documents.some(d => d.status === 'verified')) return 'verified';
    if (category.documents.some(d => d.status === 'pending')) return 'pending';
    if (category.documents.some(d => d.status === 'rejected')) return 'rejected';
    return 'not_started';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-blue-600" />
            <span>Verification Status</span>
          </CardTitle>
          <CardDescription>
            Complete your verification to build trust with students and enhance your profile visibility.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Overall Progress</span>
                <span>{verificationProgress.toFixed(0)}% Complete</span>
              </div>
              <Progress value={verificationProgress} className="h-3" aria-valuenow={verificationProgress} aria-valuemin={0} aria-valuemax={100} aria-label="Verification Progress" />
            </div>
            <div className="flex items-center justify-between mt-4">
              <span className="font-medium">Verification Status</span>
              <Badge className={allCategoriesVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                {allCategoriesVerified ? 'VERIFIED' : 'INCOMPLETE'}
              </Badge>
            </div>
            <Progress value={allCategoriesVerified ? 100 : 0} className="h-2 mt-2" aria-valuenow={allCategoriesVerified ? 100 : 0} aria-valuemin={0} aria-valuemax={100} aria-label="Overall Verification Status" />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {verificationItems.map((item) => {
          const categoryStatus = getCategoryStatus(item.key);
          const { color, icon } = getStatusInfo(categoryStatus);

          return (
            <Card key={item.key}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <item.icon className="h-5 w-5" />
                    <span>{item.title}</span>
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    {icon}
                    <Badge className={color}>
                      {categoryStatus.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </div>
                </div>
                <CardDescription>{item.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {item.hasOtherField && (
                    <div className="space-y-2">
                      <Label htmlFor="other-employment">Other Employment Details</Label>
                      <Input
                        id="other-employment"
                        value={otherEmployment}
                        onChange={(e) => setOtherEmployment(e.target.value)}
                        placeholder="Enter other employment information..."
                      />
                      <Button size="sm" onClick={handleSaveOtherEmployment}>Save Details</Button>
                    </div>
                  )}
                  
                  <div>
                    <h4 className="font-medium text-sm mb-2">Required Documents:</h4>
                    <div className="space-y-2">
                      {item.documents.map((doc) => {
                        const docData = parsedVerifications?.[item.key]?.documents.find(d => d.documentType === doc);
                        const isLoading = loadingStates[`${item.key}-${doc}`];
                        const statusInfo = getStatusInfo(docData?.status || 'not_started');

                        return (
                          <div key={doc} className="flex items-center justify-between p-2 border rounded">
                            <div className="flex-1">
                              <span className="text-sm flex items-center space-x-2">
                                {docData ? statusInfo.icon : <FileText className="h-4 w-4" />}
                                <span>{doc}</span>
                              </span>
                              {docData?.fileName && (
                                <div className="mt-1 text-xs text-gray-600 space-y-1">
                                  {getFilePreview(docData.fileUrl!, docData.fileName)}
                                  <a href={docData.fileUrl} target="_blank" rel="noopener noreferrer" className="hover:underline block">
                                    {docData.fileName}
                                  </a>
                                  <Badge variant="outline" className={`ml-2 ${statusInfo.color}`}>{docData.status}</Badge>
                                  <Progress value={docData.status === 'verified' ? 100 : docData.status === 'pending' ? 50 : 0} className="h-2 mt-1 w-32" />
                                </div>
                              )}
                              {docData?.status === 'rejected' && docData.rejectionReason && (
                                <p className="text-xs text-red-600 mt-1">Reason: {docData.rejectionReason}</p>
                              )}
                            </div>
                            <div className="flex items-center space-x-1">
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleFileUpload(item.key, doc)}
                                className="ml-2"
                                disabled={isLoading || !isProfileOwner}
                              >
                                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                                <span className="ml-1">{docData ? 'Replace' : 'Upload'}</span>
                              </Button>
                              {docData && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="text-red-500 hover:text-red-700"
                                  onClick={() => handleRemoveFile(item.key, doc)}
                                  disabled={isLoading || !isProfileOwner}
                                >
                                  <XCircle className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default VerificationTab;
