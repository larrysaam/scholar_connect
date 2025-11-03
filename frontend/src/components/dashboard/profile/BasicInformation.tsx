
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import AIBioGenerator from "./AIBioGenerator";

interface BasicInformationProps {
  profileData: {
    name: string;
    title: string;
    institution: string;
    department: string;
    email: string;
    phone: string;
    hourlyRate: string;
    bio: string;
    specialties: string[];
    languages: string[];
    employmentFile?: {
      name: string;
      uploadDate: string;
    };
  };
  isEditing: boolean;
  userType?: "student" | "researcher";
  onUpdate: (field: string, value: string) => void;
  onFileUpload?: (file: File) => void;
}

const BasicInformation = ({ profileData, isEditing, userType = "researcher", onUpdate, onFileUpload }: BasicInformationProps) => {
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && onFileUpload) {
      onFileUpload(file);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Basic Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={profileData.name}
              onChange={(e) => onUpdate('name', e.target.value)}
              disabled={!isEditing}
            />
          </div>
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={profileData.title}
              onChange={(e) => onUpdate('title', e.target.value)}
              disabled={!isEditing}
            />
          </div>
          <div>
            <Label htmlFor="institution">Institution</Label>
            <Input
              id="institution"
              value={profileData.institution}
              onChange={(e) => onUpdate('institution', e.target.value)}
              disabled={!isEditing}
            />
          </div>
          <div>
            <Label htmlFor="department">Department</Label>
            <Input
              id="department"
              value={profileData.department}
              onChange={(e) => onUpdate('department', e.target.value)}
              disabled={!isEditing}
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={profileData.email}
              onChange={(e) => onUpdate('email', e.target.value)}
              disabled={!isEditing}
            />
          </div>
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={profileData.phone}
              onChange={(e) => onUpdate('phone', e.target.value)}
              disabled={!isEditing}
            />
          </div>
          {userType === "researcher" && (
            <div>
              <Label htmlFor="hourlyRate">Hourly Rate (XAF)</Label>
              <Input
                id="hourlyRate"
                value={profileData.hourlyRate}
                onChange={(e) => onUpdate('hourlyRate', e.target.value)}
                disabled={!isEditing}
              />
            </div>
          )}
        </div>
        
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Label htmlFor="bio">Bio</Label>
            {isEditing && (
              <AIBioGenerator
                currentBio={profileData.bio}
                profileData={profileData}
                userType={userType}
                onBioGenerated={(newBio) => onUpdate('bio', newBio)}
              />
            )}
          </div>
          <Textarea
            id="bio"
            value={profileData.bio}
            onChange={(e) => onUpdate('bio', e.target.value)}
            disabled={!isEditing}
            rows={4}
          />
        </div>
        
        <div>
          <Label>Specialties</Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {profileData.specialties.map((specialty, index) => (
              <Badge key={index} variant="secondary">
                {specialty}
              </Badge>
            ))}
          </div>
        </div>
        
        <div>
          <Label>Languages</Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {profileData.languages.map((language, index) => (
              <Badge key={index} variant="outline">
                {language}
              </Badge>
            ))}
          </div>
        </div>

        {userType === "researcher" && (
          <div>
            <Label>Employment Verification Document</Label>
            <div className="mt-2">
              {profileData.employmentFile ? (
                <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{profileData.employmentFile.name}</p>
                    <p className="text-xs text-gray-500">Uploaded: {profileData.employmentFile.uploadDate}</p>
                  </div>
                  {isEditing && (
                    <Button variant="outline" size="sm" onClick={() => document.getElementById('employment-file')?.click()}>
                      <Upload className="h-4 w-4 mr-2" />
                      Replace
                    </Button>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    disabled={!isEditing}
                    onClick={() => document.getElementById('employment-file')?.click()}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Document
                  </Button>
                  <span className="text-sm text-gray-500">No document uploaded</span>
                </div>
              )}
              <input
                id="employment-file"
                type="file"
                className="hidden"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                onChange={handleFileUpload}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BasicInformation;
