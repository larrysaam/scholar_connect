
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import VerificationBadge from "@/components/verification/VerificationBadge";
import { useLanguage } from "@/contexts/LanguageContext";
import { Award, FileText, Building, CheckCircle, Clock, Upload } from "lucide-react";

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
      description: "Verified academic credentials including degrees, certifications, and institutional affiliations."
    },
    {
      type: "publication" as const,
      status: verifications.publication,
      icon: <FileText className="h-5 w-5" />,
      documents: verifications.publication === "unverified" ? [] : ["Publication_List.pdf", "ORCID_Profile.pdf", "Citation_Report.pdf"],
      description: "Verified publication history, research output, and academic contributions."
    },
    {
      type: "institutional" as const,
      status: verifications.institutional,
      icon: <Building className="h-5 w-5" />,
      documents: verifications.institutional === "unverified" ? [] : ["Employment_Letter.pdf", "Institution_Verification.pdf"],
      description: "Verified current institutional affiliation and employment status."
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Verification & Credentials</h2>
        <p className="text-gray-600">
          This researcher's credentials have been verified through our comprehensive validation process.
        </p>
      </div>

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

      {/* Trust Score Summary */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-800 flex items-center">
            <CheckCircle className="h-5 w-5 mr-2" />
            Trust Score
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <span className="text-lg font-semibold text-blue-800">Verification Status</span>
            <div className="flex space-x-2">
              {Object.values(verifications).map((status, index) => (
                <Badge 
                  key={index}
                  variant={status === "verified" ? "default" : status === "pending" ? "secondary" : "outline"}
                  className={`text-xs ${
                    status === "verified" ? "bg-green-100 text-green-800 border-green-200" : 
                    status === "pending" ? "bg-yellow-100 text-yellow-800 border-yellow-200" : 
                    "bg-gray-100 text-gray-600 border-gray-200"
                  }`}
                >
                  {status}
                </Badge>
              ))}
            </div>
          </div>
          
          <div className="text-sm text-blue-700">
            <p className="mb-2">
              <strong>Verified researchers</strong> have gone through our comprehensive credential validation process.
            </p>
            <p>
              This includes verification of academic credentials, publication history, and institutional affiliations 
              to ensure you're connecting with qualified experts.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerificationTab;
