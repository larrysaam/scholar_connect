import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Camera, Plus, X, Save, Sparkles } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Award {
  title: string;
  year: string;
}

interface Fellowship {
  title: string;
  period: string;
}

interface Grant {
  title: string;
  amount: string;
  period: string;
}

interface Publication {
  title: string;
  journal: string;
  year: string;
}

interface StudentSupervision {
  name: string;
  thesisTitle: string;
  year: string;
  level: string;
}

interface ProfileData {
  personalInfo: {
    title: string;
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
  awards: Award[];
  fellowships: Fellowship[];
  grants: Grant[];
  memberships: string[];
  publications: Publication[];
  languages: string[];
  supervision: {
    phd: number;
    masters: number;
    undergrad: number;
    postdoc: number;
    hnd: number;
    dipes: number;
  };
  supervisionDetails: StudentSupervision[];
  otherInformation: string;
}

const ProfileTab = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [newExpertise, setNewExpertise] = useState("");
  const [newMembership, setNewMembership] = useState("");
  const [newLanguage, setNewLanguage] = useState("");
  const [isGeneratingBio, setIsGeneratingBio] = useState(false);
  
  const [profileData, setProfileData] = useState<ProfileData>({
    personalInfo: {
      title: "Dr.",
      firstName: "Alex",
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
    awards: [
      { title: "Excellence in Research Award", year: "2023" }
    ],
    fellowships: [
      { title: "IEEE Fellow", period: "2020-Present" }
    ],
    grants: [
      { title: "NSF Research Grant", amount: "$500,000", period: "2022-2025" }
    ],
    memberships: ["IEEE", "ACM", "AAAI"],
    publications: [
      { title: "Advanced Machine Learning Techniques", journal: "Nature AI", year: "2023" }
    ],
    languages: ["English", "Spanish", "French"],
    supervision: {
      phd: 8,
      masters: 15,
      undergrad: 25,
      postdoc: 3,
      hnd: 5,
      dipes: 2
    },
    supervisionDetails: [
      { name: "John Doe", thesisTitle: "AI in Healthcare", year: "2023", level: "PhD" }
    ],
    otherInformation: "Available for weekend consultations. Specializes in industry-academia collaborations."
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
          ...prev[section as keyof typeof prev] as object,
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

  const handleAddMembership = () => {
    if (newMembership.trim() && !profileData.memberships.includes(newMembership.trim())) {
      setProfileData(prev => ({
        ...prev,
        memberships: [...prev.memberships, newMembership.trim()]
      }));
      setNewMembership("");
    }
  };

  const handleRemoveMembership = (membershipToRemove: string) => {
    setProfileData(prev => ({
      ...prev,
      memberships: prev.memberships.filter(membership => membership !== membershipToRemove)
    }));
  };

  const handleAddLanguage = () => {
    if (newLanguage.trim() && !profileData.languages.includes(newLanguage.trim())) {
      setProfileData(prev => ({
        ...prev,
        languages: [...prev.languages, newLanguage.trim()]
      }));
      setNewLanguage("");
    }
  };

  const handleRemoveLanguage = (languageToRemove: string) => {
    setProfileData(prev => ({
      ...prev,
      languages: prev.languages.filter(language => language !== languageToRemove)
    }));
  };

  const handleAddAward = () => {
    setProfileData(prev => ({
      ...prev,
      awards: [...prev.awards, { title: "", year: "" }]
    }));
  };

  const handleUpdateAward = (index: number, field: keyof Award, value: string) => {
    setProfileData(prev => ({
      ...prev,
      awards: prev.awards.map((award, i) => 
        i === index ? { ...award, [field]: value } : award
      )
    }));
  };

  const handleRemoveAward = (index: number) => {
    setProfileData(prev => ({
      ...prev,
      awards: prev.awards.filter((_, i) => i !== index)
    }));
  };

  const handleAddFellowship = () => {
    setProfileData(prev => ({
      ...prev,
      fellowships: [...prev.fellowships, { title: "", period: "" }]
    }));
  };

  const handleUpdateFellowship = (index: number, field: keyof Fellowship, value: string) => {
    setProfileData(prev => ({
      ...prev,
      fellowships: prev.fellowships.map((fellowship, i) => 
        i === index ? { ...fellowship, [field]: value } : fellowship
      )
    }));
  };

  const handleRemoveFellowship = (index: number) => {
    setProfileData(prev => ({
      ...prev,
      fellowships: prev.fellowships.filter((_, i) => i !== index)
    }));
  };

  const handleAddGrant = () => {
    setProfileData(prev => ({
      ...prev,
      grants: [...prev.grants, { title: "", amount: "", period: "" }]
    }));
  };

  const handleUpdateGrant = (index: number, field: keyof Grant, value: string) => {
    setProfileData(prev => ({
      ...prev,
      grants: prev.grants.map((grant, i) => 
        i === index ? { ...grant, [field]: value } : grant
      )
    }));
  };

  const handleRemoveGrant = (index: number) => {
    setProfileData(prev => ({
      ...prev,
      grants: prev.grants.filter((_, i) => i !== index)
    }));
  };

  const handleAddPublication = () => {
    setProfileData(prev => ({
      ...prev,
      publications: [...prev.publications, { title: "", journal: "", year: "" }]
    }));
  };

  const handleUpdatePublication = (index: number, field: keyof Publication, value: string) => {
    setProfileData(prev => ({
      ...prev,
      publications: prev.publications.map((publication, i) => 
        i === index ? { ...publication, [field]: value } : publication
      )
    }));
  };

  const handleRemovePublication = (index: number) => {
    setProfileData(prev => ({
      ...prev,
      publications: prev.publications.filter((_, i) => i !== index)
    }));
  };

  const handleAddSupervisionDetail = () => {
    setProfileData(prev => ({
      ...prev,
      supervisionDetails: [...prev.supervisionDetails, { name: "", thesisTitle: "", year: "", level: "" }]
    }));
  };

  const handleUpdateSupervisionDetail = (index: number, field: keyof StudentSupervision, value: string) => {
    setProfileData(prev => ({
      ...prev,
      supervisionDetails: prev.supervisionDetails.map((detail, i) => 
        i === index ? { ...detail, [field]: value } : detail
      )
    }));
  };

  const handleRemoveSupervisionDetail = (index: number) => {
    setProfileData(prev => ({
      ...prev,
      supervisionDetails: prev.supervisionDetails.filter((_, i) => i !== index)
    }));
  };

  const handleGenerateBio = async () => {
    setIsGeneratingBio(true);
    try {
      // Simulate AI bio generation based on profile data
      const bioPrompt = `Generate a professional bio for ${profileData.personalInfo.title} ${profileData.personalInfo.firstName} ${profileData.personalInfo.lastName}, ${profileData.academicInfo.currentPosition} at ${profileData.academicInfo.institution} in ${profileData.academicInfo.department}, specializing in ${profileData.academicInfo.researchField}`;
      
      // Mock AI response - in a real implementation, this would call an AI service
      setTimeout(() => {
        const generatedBio = `${profileData.personalInfo.title} ${profileData.personalInfo.firstName} ${profileData.personalInfo.lastName} is a distinguished ${profileData.academicInfo.currentPosition} at ${profileData.academicInfo.institution}, specializing in ${profileData.academicInfo.researchField}. With expertise in ${profileData.academicInfo.expertise.join(", ")}, they have made significant contributions to the field through their research and supervision of ${profileData.supervision.phd} PhD students, ${profileData.supervision.masters} Master's students, and numerous undergraduate researchers.`;
        
        setProfileData(prev => ({
          ...prev,
          academicInfo: {
            ...prev.academicInfo,
            bio: generatedBio
          }
        }));
        setIsGeneratingBio(false);
      }, 2000);
    } catch (error) {
      console.error("Error generating bio:", error);
      setIsGeneratingBio(false);
    }
  };

  const handleSave = () => {
    console.log("Saving profile data:", profileData);
    setIsEditing(false);
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 50 }, (_, i) => (currentYear - i).toString());
  const levels = ["Post Doctorate", "PhD", "Master's", "Undergraduate", "HND", "DIPES"];

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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={profileData.personalInfo.title}
                onChange={(e) => handleInputChange('personalInfo', 'title', e.target.value)}
                disabled={!isEditing}
                placeholder="Dr., Prof., Mr., Ms., etc."
              />
            </div>
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
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={profileData.personalInfo.location}
                onChange={(e) => handleInputChange('personalInfo', 'location', e.target.value)}
                disabled={!isEditing}
              />
            </div>
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
            <div className="flex items-center gap-2 mb-2">
              <Label htmlFor="bio">Bio</Label>
              {isEditing && (
                <Button 
                  onClick={handleGenerateBio} 
                  variant="outline" 
                  size="sm"
                  disabled={isGeneratingBio}
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  {isGeneratingBio ? "Generating..." : "Generate with AI"}
                </Button>
              )}
            </div>
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

      {/* Awards */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg">Awards</CardTitle>
            {isEditing && (
              <Button onClick={handleAddAward} variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Award
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {profileData.awards.map((award, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg">
              {isEditing && (
                <div className="md:col-span-3 flex justify-end">
                  <Button size="sm" variant="ghost" onClick={() => handleRemoveAward(index)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
              <div className="md:col-span-2">
                <Label>Title</Label>
                <Input
                  value={award.title}
                  onChange={(e) => handleUpdateAward(index, 'title', e.target.value)}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <Label>Year</Label>
                <Input
                  value={award.year}
                  onChange={(e) => handleUpdateAward(index, 'year', e.target.value)}
                  disabled={!isEditing}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Fellowships */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg">Fellowships</CardTitle>
            {isEditing && (
              <Button onClick={handleAddFellowship} variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Fellowship
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {profileData.fellowships.map((fellowship, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg">
              {isEditing && (
                <div className="md:col-span-2 flex justify-end">
                  <Button size="sm" variant="ghost" onClick={() => handleRemoveFellowship(index)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
              <div>
                <Label>Title</Label>
                <Input
                  value={fellowship.title}
                  onChange={(e) => handleUpdateFellowship(index, 'title', e.target.value)}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <Label>Period</Label>
                <Input
                  value={fellowship.period}
                  onChange={(e) => handleUpdateFellowship(index, 'period', e.target.value)}
                  disabled={!isEditing}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Research Grants */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg">Research Grants</CardTitle>
            {isEditing && (
              <Button onClick={handleAddGrant} variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Grant
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {profileData.grants.map((grant, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg">
              {isEditing && (
                <div className="md:col-span-3 flex justify-end">
                  <Button size="sm" variant="ghost" onClick={() => handleRemoveGrant(index)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
              <div>
                <Label>Title</Label>
                <Input
                  value={grant.title}
                  onChange={(e) => handleUpdateGrant(index, 'title', e.target.value)}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <Label>Amount</Label>
                <Input
                  value={grant.amount}
                  onChange={(e) => handleUpdateGrant(index, 'amount', e.target.value)}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <Label>Period</Label>
                <Input
                  value={grant.period}
                  onChange={(e) => handleUpdateGrant(index, 'period', e.target.value)}
                  disabled={!isEditing}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Professional Memberships */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Professional Memberships</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2 mb-3">
            {profileData.memberships.map((membership, index) => (
              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                {membership}
                {isEditing && (
                  <button
                    onClick={() => handleRemoveMembership(membership)}
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
                value={newMembership}
                onChange={(e) => setNewMembership(e.target.value)}
                placeholder="Add new membership"
                onKeyPress={(e) => e.key === 'Enter' && handleAddMembership()}
              />
              <Button onClick={handleAddMembership} variant="outline">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Publications */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg">Publications</CardTitle>
            {isEditing && (
              <Button onClick={handleAddPublication} variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Publication
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {profileData.publications.map((publication, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg">
              {isEditing && (
                <div className="md:col-span-3 flex justify-end">
                  <Button size="sm" variant="ghost" onClick={() => handleRemovePublication(index)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
              <div className="md:col-span-2">
                <Label>Title</Label>
                <Input
                  value={publication.title}
                  onChange={(e) => handleUpdatePublication(index, 'title', e.target.value)}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <Label>Year</Label>
                <Input
                  value={publication.year}
                  onChange={(e) => handleUpdatePublication(index, 'year', e.target.value)}
                  disabled={!isEditing}
                />
              </div>
              <div className="md:col-span-3">
                <Label>Journal</Label>
                <Input
                  value={publication.journal}
                  onChange={(e) => handleUpdatePublication(index, 'journal', e.target.value)}
                  disabled={!isEditing}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Languages */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Languages</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2 mb-3">
            {profileData.languages.map((language, index) => (
              <Badge key={index} variant="outline" className="flex items-center gap-1">
                {language}
                {isEditing && (
                  <button
                    onClick={() => handleRemoveLanguage(language)}
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
                value={newLanguage}
                onChange={(e) => setNewLanguage(e.target.value)}
                placeholder="Add new language"
                onKeyPress={(e) => e.key === 'Enter' && handleAddLanguage()}
              />
              <Button onClick={handleAddLanguage} variant="outline">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Student Supervision */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Student Supervision</CardTitle>
          <CardDescription>Number of students you have supervised</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
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
            <div>
              <Label htmlFor="hnd">HND Students</Label>
              <Input
                id="hnd"
                type="number"
                value={profileData.supervision.hnd}
                onChange={(e) => handleInputChange('supervision', 'hnd', parseInt(e.target.value) || 0)}
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label htmlFor="dipes">DIPES Students</Label>
              <Input
                id="dipes"
                type="number"
                value={profileData.supervision.dipes}
                onChange={(e) => handleInputChange('supervision', 'dipes', parseInt(e.target.value) || 0)}
                disabled={!isEditing}
              />
            </div>
          </div>

          {/* Detailed Supervision Records */}
          <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-medium">Supervision Details</h4>
              {isEditing && (
                <Button onClick={handleAddSupervisionDetail} variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Student
                </Button>
              )}
            </div>
            <div className="space-y-4">
              {profileData.supervisionDetails.map((detail, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-lg">
                  {isEditing && (
                    <div className="md:col-span-4 flex justify-end">
                      <Button size="sm" variant="ghost" onClick={() => handleRemoveSupervisionDetail(index)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                  <div>
                    <Label>Student Name</Label>
                    <Input
                      value={detail.name}
                      onChange={(e) => handleUpdateSupervisionDetail(index, 'name', e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label>Thesis Title</Label>
                    <Input
                      value={detail.thesisTitle}
                      onChange={(e) => handleUpdateSupervisionDetail(index, 'thesisTitle', e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label>Year</Label>
                    {isEditing ? (
                      <Select 
                        value={detail.year} 
                        onValueChange={(value) => handleUpdateSupervisionDetail(index, 'year', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select year" />
                        </SelectTrigger>
                        <SelectContent>
                          {years.map(year => (
                            <SelectItem key={year} value={year}>{year}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input value={detail.year} disabled />
                    )}
                  </div>
                  <div>
                    <Label>Level</Label>
                    {isEditing ? (
                      <Select 
                        value={detail.level} 
                        onValueChange={(value) => handleUpdateSupervisionDetail(index, 'level', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                        <SelectContent>
                          {levels.map(level => (
                            <SelectItem key={level} value={level}>{level}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input value={detail.level} disabled />
                    )}
                  </div>
                </div>
              ))}
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
