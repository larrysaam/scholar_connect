
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import VerificationBadge from "@/components/verification/VerificationBadge";
import { useLanguage } from "@/contexts/LanguageContext";
import { Award, FileText, Building, CheckCircle, Clock, Upload, Shield } from "lucide-react";
import { useResearcherProfile } from "@/hooks/useResearcherProfile";
import { useParams } from "react-router-dom";
import { useEffect } from "react";

interface VerificationTabProps {
  researcherId: string;
}

const VerificationTab = ({ researcherId }: VerificationTabProps) => {
  const { t } = useLanguage();
  const { researcher, loading, error } = useResearcherProfile(researcherId);

  if (loading) {
    return <div>Loading verifications...</div>;
  }

  if (error) {
    return <div>Error loading verifications: {error}</div>;
  }

  if (!researcher || !researcher.verifications) {
    return <div>No verification data available.</div>;
  }

  const verifications = researcher.verifications;

  // Helper to map 'rejected' to 'unverified' for display purposes
  const hasVerifiedDocuments = (documents?: { status: 'pending' | 'verified' | 'rejected'; }[]) => {
    return documents?.some(doc => doc.status === 'verified') || false;
  };

  const getDisplayStatus = (
    topLevelStatus: 'pending' | 'verified' | 'rejected',
    documents?: { status: 'pending' | 'verified' | 'rejected'; }[]
  ) => {
    if (topLevelStatus === 'verified' || hasVerifiedDocuments(documents)) {
      return 'verified';
    }
    if (topLevelStatus === 'pending' || documents?.some(doc => doc.status === 'pending')) {
      return 'pending';
    }
    return 'unverified';
  };

  const verificationItems = [
    {
      type: "academic" as const,
      status: getDisplayStatus(verifications.academic, verifications.education?.documents),
      icon: <Award className="h-5 w-5" />,
      documents: verifications.education?.documents || [],
      description: "Academic credentials including degrees, certifications, and institutional affiliations verified through official transcripts and certificates."
    },
    {
      type: "publication" as const,
      status: getDisplayStatus(verifications.publication, verifications.publications?.documents),
      icon: <FileText className="h-5 w-5" />,
      documents: verifications.publications?.documents || [],
      description: "Research output and academic contributions verified through publication databases, ORCID profiles, and citation metrics."
    },
    {
      type: "institutional" as const,
      status: getDisplayStatus(verifications.institutional, verifications.employment?.documents),
      icon: <Building className="h-5 w-5" />,
      documents: verifications.employment?.documents || [],
      description: "Current institutional affiliation verified through institutional email confirmation and official appointment letters."
    }
  ];

  // Calculate overall verification status
  const getOverallStatus = () => {
    const academicStatus = getDisplayStatus(verifications.academic, verifications.education?.documents);
    const publicationStatus = getDisplayStatus(verifications.publication, verifications.publications?.documents);
    const institutionalStatus = getDisplayStatus(verifications.institutional, verifications.employment?.documents);

    if (academicStatus === "verified" && publicationStatus === "verified" && institutionalStatus === "verified") {
      return "verified";
    }
    
    if (academicStatus === "pending" || publicationStatus === "pending" || institutionalStatus === "pending") {
      return "pending";
    }
    
    if (academicStatus === "verified" || publicationStatus === "verified" || institutionalStatus === "verified") {
      return "verified";
    }
    
    return "unverified";
  };

  const overallStatus = getOverallStatus();
  const verifiedCount = [
    getDisplayStatus(verifications.academic, verifications.education?.documents),
    getDisplayStatus(verifications.publication, verifications.publications?.documents),
    getDisplayStatus(verifications.institutional, verifications.employment?.documents)
  ].filter(status => status === "verified").length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Verification & Credentials</h2>
        <p className="text-gray-600">
          This researcher's credentials are verified through our comprehensive three-tier validation process.
        </p>
      </div>

      {/* Overall Verification Status */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-800 flex items-center justify-between">
            <div className="flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              Overall Verification Status
            </div>
            <VerificationBadge 
              type="overall" 
              status={overallStatus}
              size="lg"
              verifications={verifications}
            />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-blue-700">
            <p className="mb-2">
              <strong>Verification Score:</strong> {verifiedCount}/3 credentials verified
            </p>
            <p className="mb-2">
              This researcher has been verified through our rigorous process that includes:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Academic credential verification through official transcripts</li>
              <li>Publication history verification via academic databases</li>
              <li>Institutional affiliation via institutional email and appointment letters</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {verificationItems.map((item) => (
          <Card key={item.type} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {item.icon}
                  <CardTitle className="text-lg">
                    {t(`researchAids.verification.${item.type}`)}
                  </CardTitle>
                </div>
                <VerificationBadge 
                  type={item.type} 
                  status={item.status}
                  size="md"
                />
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">{item.description}</p>
              
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Verified Documents</h4>
                {item.documents.length > 0 ? (
                  <div className="space-y-1">
                    {item.documents.map((doc, index) => (
                      <a key={index} href={doc.fileUrl} target="_blank" rel="noopener noreferrer" className="flex items-center text-sm text-gray-600 hover:text-blue-600 hover:underline">
                        <FileText className="h-4 w-4 mr-2 text-green-600" />
                        {doc.fileName}
                      </a>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No documents verified</p>
                )}
              </div>

              <div className="space-y-2">
                {item.status === "verified" && (
                  <div className="flex items-center text-sm text-green-600">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Verified and Trusted
                  </div>
                )}
                
                {item.status === "pending" && (
                  <div className="flex items-center text-sm text-yellow-600">
                    <Clock className="h-4 w-4 mr-1" />
                    Under Review
                  </div>
                )}
                
                {item.status === "unverified" && (
                  <div className="flex items-center text-sm text-gray-500">
                    <Upload className="h-4 w-4 mr-1" />
                    Not Verified
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Verification Process Info */}
      <Card className="bg-gray-50 border-gray-200">
        <CardHeader>
          <CardTitle className="text-gray-800 flex items-center">
            <CheckCircle className="h-5 w-5 mr-2" />
            Our Verification Process
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-gray-700 space-y-3">
            <div>
              <h4 className="font-semibold">Academic Verification</h4>
              <p>We verify degrees and certifications through official transcripts and institutional confirmation.</p>
            </div>
            <div>
              <h4 className="font-semibold">Publication Verification</h4>
              <p>Research output is verified through academic databases, ORCID profiles, and citation analysis.</p>
            </div>
            <div>
              <h4 className="font-semibold">Institutional Verification</h4>
              <p>Current affiliation is confirmed through institutional email verification and official appointment letters.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerificationTab;
