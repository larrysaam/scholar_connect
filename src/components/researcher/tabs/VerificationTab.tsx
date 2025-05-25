
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import VerificationBadge from "@/components/verification/VerificationBadge";
import { useLanguage } from "@/contexts/LanguageContext";
import { Award, FileText, Building, CheckCircle, Clock, Upload, Shield } from "lucide-react";

interface VerificationTabProps {
  verifications: {
    academic: "verified" | "pending" | "unverified";
    publication: "verified" | "pending" | "unverified";
    institutional: "verified" | "pending" | "unverified";
  };
}

const VerificationTab = ({ verifications }: VerificationTabProps) => {
  const { t } = useLanguage();

  const verificationItems = [
    {
      type: "academic" as const,
      status: verifications.academic,
      icon: <Award className="h-5 w-5" />,
      documents: verifications.academic === "unverified" ? [] : ["PhD_Certificate.pdf", "Academic_Transcripts.pdf"],
      description: "Academic credentials including degrees, certifications, and institutional affiliations verified through official transcripts and certificates."
    },
    {
      type: "publication" as const,
      status: verifications.publication,
      icon: <FileText className="h-5 w-5" />,
      documents: verifications.publication === "unverified" ? [] : ["Publication_List.pdf", "ORCID_Profile.pdf", "Citation_Report.pdf"],
      description: "Research output and academic contributions verified through publication databases, ORCID profiles, and citation metrics."
    },
    {
      type: "institutional" as const,
      status: verifications.institutional,
      icon: <Building className="h-5 w-5" />,
      documents: verifications.institutional === "unverified" ? [] : ["Employment_Letter.pdf", "Institutional_Email_Verification.pdf"],
      description: "Current institutional affiliation verified through institutional email confirmation and official appointment letters."
    }
  ];

  // Calculate overall verification status
  const getOverallStatus = () => {
    const { academic, publication, institutional } = verifications;
    
    if (academic === "verified" && publication === "verified" && institutional === "verified") {
      return "verified";
    }
    
    if (academic === "pending" || publication === "pending" || institutional === "pending") {
      return "pending";
    }
    
    if (academic === "verified" || publication === "verified" || institutional === "verified") {
      return "verified";
    }
    
    return "unverified";
  };

  const overallStatus = getOverallStatus();
  const verifiedCount = Object.values(verifications).filter(v => v === "verified").length;

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
                      <div key={index} className="flex items-center text-sm text-gray-600">
                        <FileText className="h-4 w-4 mr-2 text-green-600" />
                        {doc}
                      </div>
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
