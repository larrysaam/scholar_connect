import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Camera, Plus, X, Save } from "lucide-react";

interface ProfileData {
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    location: string;
  };
  academicInfo: {
    currentPosition: string;
    institution: string;
    department: string;
    researchField: string;
    expertise: string[];
    bio: string;
  };
  supervision: {
    phd: number;
    masters: number;
    undergrad: number;
    postdoc: number;
  };
  otherInformation: string;
}

const ProfileTab = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [newExpertise, setNewExpertise] = useState("");
  
  const [profileData, setProfileData] = useState<ProfileData>({
    personalInfo: {
      firstName: "Dr. Alex",
      lastName: "Smith",
      email: "alex.smith@university.edu",
      phone: "+1 (555) 123-4567",
      location: "Boston, MA, USA"
    },
    academicInfo: {
      currentPosition: "Associate Professor",
      institution: "Harvard University",
      department: "Computer Science",
      researchField: "Artificial Intelligence",
      expertise: ["Machine Learning", "Natural Language Processing", "Computer Vision", "Data Science"],
      bio: "Dr. Alex Smith is an Associate Professor of Computer Science at Harvard University with over 10 years of experience in artificial intelligence research. Their work focuses on developing innovative machine learning algorithms for real-world applications."
    },
    supervision: {
      phd: 8,
      masters: 15,
      undergrad: 25,
      postdoc: 3
    },
    otherInformation: "Available for weekend consultations. Specializes in industry-academia collaborations. Fluent in English, Spanish, and French."
  });

  const handleInputChange = (section: keyof ProfileData, field: string, value: string | number) => {
    if (section === 'otherInformation') {
      setProfileData(prev => ({
        ...prev,
        otherInformation: value as string
      }));
    } else {
      setProfileData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value
        }
      }));
    }
  };

  const handleAddExpertise = () => {
    if (newExpertise.trim() && !profileData.academicInfo.expertise.includes(newExpertise.trim())) {
      setProfileData(prev => ({
        ...prev,
        academicInfo: {
          ...prev.academicInfo,
          expertise: [...prev.academicInfo.expertise, newExpertise.trim()]
        }
      }));
      setNewExpertise("");
    }
  };

  const handleRemoveExpertise = (expertiseToRemove: string) => {
    setProfileData(prev => ({
      ...prev,
      academicInfo: {
        ...prev.academicInfo,
        expertise: prev.academicInfo.expertise.filter(exp => exp !== expertiseToRemove)
      }
    }));
  };

  const handleSave = () => {
    console.log("Saving profile data:", profileData);
    setIsEditing(false);
    // In a real app, this would save to the backend
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Profile Information</h2>
        <Button 
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          className={isEditing ? "bg-green-600 hover:bg-green-700" : ""}
        >
          {isEditing ? (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </>
          ) : (
            "Edit Profile"
          )}
        </Button>
      </div>

      {/* Profile Picture */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Profile Picture</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="h-24 w-24 rounded-full bg-blue-100 flex items-center justify-center">
              <Camera className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <Button variant="outline" disabled={!isEditing}>
                <Camera className="h-4 w-4 mr-2" />
                Upload Photo
              </Button>
              <p className="text-sm text-gray-500 mt-2">Recommended: 400x400px, max 5MB</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={profileData.personalInfo.firstName}
                onChange={(e) => handleInputChange('personalInfo', 'firstName', e.target.value)}
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={profileData.personalInfo.lastName}
                onChange={(e) => handleInputChange('personalInfo', 'lastName', e.target.value)}
                disabled={!isEditing}
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={profileData.personalInfo.location}
              onChange={(e) => handleInputChange('personalInfo', 'location', e.target.value)}
              disabled={!isEditing}
            />
          </div>
        </CardContent>
      </Card>

      {/* Academic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Academic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="position">Current Position</Label>
              <Input
                id="position"
                value={profileData.academicInfo.currentPosition}
                onChange={(e) => handleInputChange('academicInfo', 'currentPosition', e.target.value)}
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label htmlFor="institution">Institution</Label>
              <Input
                id="institution"
                value={profileData.academicInfo.institution}
                onChange={(e) => handleInputChange('academicInfo', 'institution', e.target.value)}
                disabled={!isEditing}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                value={profileData.academicInfo.department}
                onChange={(e) => handleInputChange('academicInfo', 'department', e.target.value)}
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label htmlFor="researchField">Research Field</Label>
              <Input
                id="researchField"
                value={profileData.academicInfo.researchField}
                onChange={(e) => handleInputChange('academicInfo', 'researchField', e.target.value)}
                disabled={!isEditing}
              />
            </div>
          </div>

          <div>
            <Label>Areas of Expertise</Label>
            <div className="flex flex-wrap gap-2 mt-2 mb-3">
              {profileData.academicInfo.expertise.map((exp, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {exp}
                  {isEditing && (
                    <button
                      onClick={() => handleRemoveExpertise(exp)}
                      className="ml-1 hover:bg-red-100 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </Badge>
              ))}
            </div>
            {isEditing && (
              <div className="flex gap-2">
                <Input
                  value={newExpertise}
                  onChange={(e) => setNewExpertise(e.target.value)}
                  placeholder="Add new expertise area"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddExpertise()}
                />
                <Button onClick={handleAddExpertise} variant="outline">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={profileData.academicInfo.bio}
              onChange={(e) => handleInputChange('academicInfo', 'bio', e.target.value)}
              disabled={!isEditing}
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      {/* Supervision */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Student Supervision</CardTitle>
          <CardDescription>Number of students you have supervised</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="phd">PhD Students</Label>
              <Input
                id="phd"
                type="number"
                value={profileData.supervision.phd}
                onChange={(e) => handleInputChange('supervision', 'phd', parseInt(e.target.value) || 0)}
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label htmlFor="masters">Master's Students</Label>
              <Input
                id="masters"
                type="number"
                value={profileData.supervision.masters}
                onChange={(e) => handleInputChange('supervision', 'masters', parseInt(e.target.value) || 0)}
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label htmlFor="undergrad">Undergraduate Students</Label>
              <Input
                id="undergrad"
                type="number"
                value={profileData.supervision.undergrad}
                onChange={(e) => handleInputChange('supervision', 'undergrad', parseInt(e.target.value) || 0)}
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label htmlFor="postdoc">Postdoctoral Fellows</Label>
              <Input
                id="postdoc"
                type="number"
                value={profileData.supervision.postdoc}
                onChange={(e) => handleInputChange('supervision', 'postdoc', parseInt(e.target.value) || 0)}
                disabled={!isEditing}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Other Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Other Information</CardTitle>
          <CardDescription>Additional information about your availability, specializations, or preferences</CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            value={profileData.otherInformation}
            onChange={(e) => handleInputChange('otherInformation', '', e.target.value)}
            disabled={!isEditing}
            rows={4}
            placeholder="Enter any additional information about yourself, your availability, special services, or preferences..."
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileTab;
