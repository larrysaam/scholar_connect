import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import VerificationBadge from "@/components/verification/VerificationBadge";
import { useLanguage } from "@/contexts/LanguageContext";
import { Award, FileText, Building, CheckCircle, Clock, Upload, Shield, Star, TrendingUp } from "lucide-react";
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
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600"></div>
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400/20 to-purple-400/20 animate-pulse"></div>
        </div>
        <span className="mt-4 text-lg font-medium text-gray-700">Loading verification details...</span>
        <p className="text-sm text-gray-500 mt-1">Please wait while we fetch the latest information</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <div className="relative mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mx-auto">
            <Shield className="h-10 w-10 text-red-500" />
          </div>
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">!</span>
          </div>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-3">Verification Data Unavailable</h3>
        <p className="text-gray-600 max-w-md mx-auto">
          We're unable to load verification information at this time. Please try refreshing the page or contact support if the issue persists.
        </p>
      </div>
    );
  }

  if (!researcher || !researcher.verifications) {
    return (
      <div className="text-center py-20">
        <div className="relative mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto">
            <FileText className="h-10 w-10 text-gray-400" />
          </div>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-3">No Verification Data</h3>
        <p className="text-gray-600 max-w-md mx-auto">
          This researcher hasn't completed the verification process yet. Verification helps build trust and credibility in academic collaborations.
        </p>
      </div>
    );
  }

  const verifications = researcher.verifications;

  // Helper to map 'rejected' to 'unverified' for display purposes
  const hasVerifiedDocuments = (documents?: { status: 'pending' | 'verified' | 'rejected'; }[]) => {
    return documents?.some(doc => doc.status === 'verified') || false;
  };

  const getDisplayStatus = (
    topLevelStatus: 'pending' | 'verified' | 'rejected',
    documents?: { status: 'pending' | 'verified' | 'rejected'; }[]
  ): 'pending' | 'verified' | 'unverified' => {
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
      icon: <Award className="h-6 w-6" />,
      documents: verifications.education?.documents || [],
      description: "Academic credentials including degrees, certifications, and institutional affiliations verified through official transcripts and certificates.",
      color: "from-emerald-500 to-teal-600",
      bgColor: "from-emerald-50 to-teal-50",
      borderColor: "border-emerald-200"
    },
    {
      type: "publication" as const,
      status: getDisplayStatus(verifications.publication, verifications.publications?.documents),
      icon: <FileText className="h-6 w-6" />,
      documents: verifications.publications?.documents || [],
      description: "Research output and academic contributions verified through publication databases, ORCID profiles, and citation metrics.",
      color: "from-blue-500 to-indigo-600",
      bgColor: "from-blue-50 to-indigo-50",
      borderColor: "border-blue-200"
    },
    {
      type: "institutional" as const,
      status: getDisplayStatus(verifications.institutional, verifications.employment?.documents),
      icon: <Building className="h-6 w-6" />,
      documents: verifications.employment?.documents || [],
      description: "Current institutional affiliation verified through institutional email confirmation and official appointment letters.",
      color: "from-purple-500 to-pink-600",
      bgColor: "from-purple-50 to-pink-50",
      borderColor: "border-purple-200"
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

  const verificationProgress = (verifiedCount / 3) * 100;

  return (
    <div className="space-y-8">
      {/* Enhanced Header Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white py-12 px-8">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-white/10 to-transparent rounded-bl-full"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-white/5 to-transparent rounded-tr-full"></div>
        
        <div className="relative text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-sm rounded-full mb-6 border border-white/20">
            <Shield className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
            Verification & Credentials
          </h2>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
            This researcher's credentials are verified through our comprehensive three-tier validation process,
            ensuring trust and credibility in academic collaborations.
          </p>
          
          {/* Trust indicators */}
          <div className="flex items-center justify-center space-x-6 mt-8">
            <div className="flex items-center space-x-2 text-blue-200">
              <Star className="h-5 w-5 fill-current" />
              <span className="text-sm font-medium">Trusted Platform</span>
            </div>
            <div className="flex items-center space-x-2 text-blue-200">
              <TrendingUp className="h-5 w-5" />
              <span className="text-sm font-medium">Rigorous Process</span>
            </div>
            <div className="flex items-center space-x-2 text-blue-200">
              <CheckCircle className="h-5 w-5" />
              <span className="text-sm font-medium">Verified Experts</span>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Overall Verification Status */}
      <Card className="relative overflow-hidden bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/30 border-2 border-blue-100/50 shadow-xl backdrop-blur-sm">
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-blue-200/20 to-transparent rounded-bl-full"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-indigo-200/20 to-transparent rounded-tr-full"></div>
        
        <CardHeader className="pb-6">
          <CardTitle className="text-2xl text-gray-800 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl shadow-lg">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Overall Verification Status</h3>
                <p className="text-sm text-blue-600 font-medium">Comprehensive Credential Validation</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-3xl font-bold text-gray-900">{verifiedCount}/3</div>
                <div className="text-sm text-gray-600">Verified</div>
              </div>
              <VerificationBadge
                type="overall"
                status={overallStatus}
                size="lg"
                verifications={verifications}
              />
            </div>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm font-medium text-gray-700">
              <span>Verification Progress</span>
              <span>{Math.round(verificationProgress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${verificationProgress}%` }}
              ></div>
            </div>
          </div>
          
          <div className="text-sm text-gray-700 bg-white/50 rounded-lg p-4 border border-gray-100">
            <p className="mb-3 font-medium text-gray-900">
              <strong>Verification Score:</strong> {verifiedCount}/3 credentials verified
            </p>
            <p className="mb-3">
              This researcher has been verified through our rigorous process that includes:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4 text-gray-600">
              <li>Academic credential verification through official transcripts</li>
              <li>Publication history verification via academic databases</li>
              <li>Institutional affiliation via institutional email and appointment letters</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Verification Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {verificationItems.map((item, index) => (
          <Card 
            key={item.type} 
            className={`group relative overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border-2 ${item.borderColor} bg-gradient-to-br ${item.bgColor}`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl ${item.color} opacity-10 rounded-bl-full group-hover:opacity-20 transition-opacity duration-300`}></div>
            
            <CardHeader className="pb-4 relative">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 bg-gradient-to-br ${item.color} rounded-lg shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <div className="text-white">
                      {item.icon}
                    </div>
                  </div>
                  <CardTitle className="text-lg font-bold text-gray-900">
                    {t(`researchAids.verification.${item.type}`)}
                  </CardTitle>
                </div>
                {/* <VerificationBadge 
                  type={item.type} 
                  status={item.status}
                  size="md"
                /> */}
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4 relative">
              <p className="text-sm text-gray-600 leading-relaxed">{item.description}</p>
              
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-gray-800 flex items-center">
                  <FileText className="h-4 w-4 mr-2 text-gray-500" />
                  Verified Documents
                </h4>
                {item.documents.length > 0 ? (
                  <div className="space-y-2">
                    {item.documents.map((doc, index) => (
                      <a 
                        key={index} 
                        href={doc.fileUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="flex items-center text-sm text-gray-600 hover:text-blue-600 hover:underline transition-colors duration-200 group-hover:translate-x-1 transform"
                      >
                        <CheckCircle className="h-4 w-4 mr-2 text-green-500 flex-shrink-0" />
                        <span className="truncate">{doc.fileName}</span>
                      </a>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 italic">No documents verified</p>
                )}
              </div>

              <div className="pt-2 border-t border-gray-100">
                {item.status === "verified" && (
                  <div className="flex items-center text-sm text-green-600 font-medium">
                    <CheckCircle className="h-4 w-4 mr-2 flex-shrink-0" />
                    Verified and Trusted
                  </div>
                )}
                
                {item.status === "pending" && (
                  <div className="flex items-center text-sm text-yellow-600 font-medium">
                    <Clock className="h-4 w-4 mr-2 flex-shrink-0" />
                    Under Review
                  </div>
                )}
                
                {item.status === "unverified" && (
                  <div className="flex items-center text-sm text-gray-500 font-medium">
                    <Upload className="h-4 w-4 mr-2 flex-shrink-0" />
                    Not Verified
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Enhanced Verification Process Info */}
      <Card className="bg-gradient-to-br from-gray-50 via-blue-50/20 to-indigo-50/20 border-2 border-gray-200/50 shadow-lg">
        <CardHeader className="pb-6">
          <CardTitle className="text-2xl text-gray-800 flex items-center">
            <div className="p-2 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg mr-3">
              <CheckCircle className="h-6 w-6 text-blue-600" />
            </div>
            Our Verification Process
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3 p-4 bg-white/60 rounded-lg border border-gray-100">
              <div className="flex items-center space-x-2">
                <Award className="h-5 w-5 text-emerald-600" />
                <h4 className="font-bold text-gray-900">Academic Verification</h4>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">
                We verify degrees and certifications through official transcripts and institutional confirmation.
              </p>
            </div>
            
            <div className="space-y-3 p-4 bg-white/60 rounded-lg border border-gray-100">
              <div className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-blue-600" />
                <h4 className="font-bold text-gray-900">Publication Verification</h4>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">
                Research output is verified through academic databases, ORCID profiles, and citation analysis.
              </p>
            </div>
            
            <div className="space-y-3 p-4 bg-white/60 rounded-lg border border-gray-100">
              <div className="flex items-center space-x-2">
                <Building className="h-5 w-5 text-purple-600" />
                <h4 className="font-bold text-gray-900">Institutional Verification</h4>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">
                Current affiliation is confirmed through institutional email verification and official appointment letters.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerificationTab;
