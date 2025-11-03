
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { Upload, FileText, Building, Award, CheckCircle, Clock } from "lucide-react";
import VerificationBadge from "./VerificationBadge";

interface VerificationItem {
  type: "academic" | "publication" | "institutional";
  status: "verified" | "pending" | "unverified";
  documents: string[];
  lastUpdated?: string;
}

const VerificationManager = () => {
  const { t } = useLanguage();

  const verificationItems: VerificationItem[] = [
    {
      type: "academic",
      status: "verified",
      documents: ["PhD_Certificate.pdf", "Masters_Degree.pdf"],
      lastUpdated: "2024-01-15"
    },
    {
      type: "publication",
      status: "pending",
      documents: ["Publication_List.pdf", "ORCID_Profile.pdf"],
      lastUpdated: "2024-01-20"
    },
    {
      type: "institutional",
      status: "unverified",
      documents: [],
    }
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case "academic":
        return <Award className="h-5 w-5" />;
      case "publication":
        return <FileText className="h-5 w-5" />;
      case "institutional":
        return <Building className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Verification & Credentials</h2>
        <p className="text-gray-600">
          Verify your credentials to build trust with researchers and students on the platform.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {verificationItems.map((item) => (
          <Card key={item.type} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {getIcon(item.type)}
                  <CardTitle className="text-lg">
                    {t(`researchAids.verification.${item.type}`)}
                  </CardTitle>
                </div>
                <VerificationBadge 
                  type={item.type as "academic" | "publication" | "institutional"} 
                  status={item.status as "verified" | "pending" | "unverified"}
                  size="md"
                />
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Documents</h4>
                {item.documents.length > 0 ? (
                  <div className="space-y-1">
                    {item.documents.map((doc, index) => (
                      <div key={index} className="flex items-center text-sm text-gray-600">
                        <FileText className="h-4 w-4 mr-2" />
                        {doc}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No documents uploaded</p>
                )}
              </div>

              {item.lastUpdated && (
                <p className="text-xs text-gray-500">
                  Last updated: {new Date(item.lastUpdated).toLocaleDateString()}
                </p>
              )}

              <div className="space-y-2">
                {item.status === "unverified" && (
                  <Button size="sm" className="w-full" variant="outline">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Documents
                  </Button>
                )}
                
                {item.status === "pending" && (
                  <div className="flex items-center text-sm text-yellow-600">
                    <Clock className="h-4 w-4 mr-1" />
                    Under Review (3-5 business days)
                  </div>
                )}
                
                {item.status === "verified" && (
                  <div className="flex items-center text-sm text-green-600">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Verified and Trusted
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default VerificationManager;
