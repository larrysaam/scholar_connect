
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Shield, CheckCircle, AlertTriangle, Upload, FileText, User, GraduationCap, Award } from "lucide-react";

const VerificationTab = () => {
  const [verificationStatus] = useState({
    identity: "verified",
    education: "verified", 
    employment: "pending",
    publications: "verified"
  });

  const verificationProgress = 75; // 3 out of 4 verified

  const verificationItems = [
    {
      title: "Identity Verification",
      description: "Government-issued ID verification",
      status: verificationStatus.identity,
      icon: User,
      documents: ["Passport", "Driver's License"]
    },
    {
      title: "Educational Background",
      description: "Academic credentials and degrees",
      status: verificationStatus.education,
      icon: GraduationCap,
      documents: ["PhD Certificate", "Transcripts"]
    },
    {
      title: "Employment Verification",
      description: "Current institutional affiliation",
      status: verificationStatus.employment,
      icon: Shield,
      documents: ["Employment Letter", "Faculty ID"]
    },
    {
      title: "Research Publications",
      description: "Published academic work verification",
      status: verificationStatus.publications,
      icon: Award,
      documents: ["Publication List", "ORCID Profile"]
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'pending':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
    }
  };

  const handleFileUpload = (category: string) => {
    console.log("Uploading file for:", category);
    alert(`File upload interface would open for ${category}`);
  };

  return (
    <div className="space-y-6">
      {/* Verification Overview */}
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
                <span>{verificationProgress}% Complete</span>
              </div>
              <Progress value={verificationProgress} className="h-3" />
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">3</div>
                <div className="text-sm text-gray-600">Verified</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">1</div>
                <div className="text-sm text-gray-600">Pending</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-400">0</div>
                <div className="text-sm text-gray-600">Rejected</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">4</div>
                <div className="text-sm text-gray-600">Total Items</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Verification Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {verificationItems.map((item, index) => (
          <Card key={index}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center space-x-2">
                  <item.icon className="h-5 w-5" />
                  <span>{item.title}</span>
                </CardTitle>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(item.status)}
                  <Badge className={getStatusColor(item.status)}>
                    {item.status.toUpperCase()}
                  </Badge>
                </div>
              </div>
              <CardDescription>{item.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-sm mb-2">Required Documents:</h4>
                  <div className="space-y-2">
                    {item.documents.map((doc, docIndex) => (
                      <div key={docIndex} className="flex items-center justify-between p-2 border rounded">
                        <span className="text-sm flex items-center space-x-2">
                          <FileText className="h-4 w-4" />
                          <span>{doc}</span>
                        </span>
                        {item.status === 'verified' ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleFileUpload(doc)}
                          >
                            <Upload className="h-4 w-4 mr-1" />
                            Upload
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                
                {item.status === 'pending' && (
                  <div className="bg-yellow-50 p-3 rounded border border-yellow-200">
                    <p className="text-sm text-yellow-800">
                      Your documents are under review. We'll notify you once verification is complete.
                    </p>
                  </div>
                )}
                
                {item.status === 'verified' && (
                  <div className="bg-green-50 p-3 rounded border border-green-200">
                    <p className="text-sm text-green-800">
                      ✓ Verification completed successfully.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Verification Benefits */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Verification Benefits</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4">
              <Shield className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <h4 className="font-medium">Enhanced Trust</h4>
              <p className="text-sm text-gray-600">Build credibility with students and institutions</p>
            </div>
            <div className="text-center p-4">
              <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <h4 className="font-medium">Higher Visibility</h4>
              <p className="text-sm text-gray-600">Appear higher in search results</p>
            </div>
            <div className="text-center p-4">
              <Award className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
              <h4 className="font-medium">Premium Features</h4>
              <p className="text-sm text-gray-600">Access to exclusive platform features</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerificationTab;
