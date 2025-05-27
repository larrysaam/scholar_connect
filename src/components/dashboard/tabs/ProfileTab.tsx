
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { User, Plus, X, Trash2, Sparkles, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import AIBioGenerator from "@/components/dashboard/profile/AIBioGenerator";

const ProfileTab = () => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: "Dr.",
    name: "John Researcher",
    email: "john.researcher@university.cm",
    phone: "+237 6XX XXX XXX",
    location: "Yaoundé, Cameroon",
    bio: "Specialized in artificial intelligence and machine learning with over 10 years of research experience in healthcare applications.",
    educationalBackground: [
      { degree: "PhD in Computer Science", institution: "University of Yaoundé I", year: "2015" },
      { degree: "MSc in Information Systems", institution: "University of Buea", year: "2010" }
    ],
    workExperience: [
      { position: "Associate Professor", company: "University of Yaoundé I", period: "2018-Present" },
      { position: "Assistant Professor", company: "University of Buea", period: "2015-2018" }
    ],
    awards: [
      { title: "Best Research Paper Award", organization: "IEEE Conference", year: "2023" },
      { title: "Excellence in Teaching Award", organization: "University of Yaoundé I", year: "2022" }
    ],
    publications: [
      { title: "AI in Healthcare: A Comprehensive Review", journal: "Nature AI", year: "2023" },
      { title: "Machine Learning Applications in Medical Diagnosis", journal: "IEEE Transactions", year: "2022" }
    ],
    scholarships: [
      { title: "Government Research Fellowship", organization: "Ministry of Higher Education", period: "2020-2023" },
      { title: "UNESCO Research Grant", organization: "UNESCO", period: "2019-2020" }
    ],
    affiliations: [
      "IEEE Computer Society",
      "Association for Computing Machinery",
      "Cameroon Computer Science Association"
    ],
    languages: ["English", "French", "Spanish"],
    supervision: [
      { level: "PhD", count: 5 },
      { level: "Master's", count: 12 },
      { level: "Undergraduate", count: 25 },
      { level: "Higher National Diploma", count: 8 }
    ],
    supervisionDetails: [
      { name: "Marie Dupont", level: "PhD", thesisTitle: "Machine Learning Applications in Agricultural Prediction", year: "2023" },
      { name: "Paul Ngozi", level: "Master's", thesisTitle: "Data Mining Techniques for Healthcare Analytics", year: "2023" },
      { name: "Sarah Mballa", level: "PhD", thesisTitle: "AI-Driven Climate Change Modeling", year: "2022" }
    ]
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveProfile = () => {
    if (!formData.name || !formData.email) {
      toast({
        title: "Error",
        description: "Name and email are required fields",
        variant: "destructive"
      });
      return;
    }

    if (formData.email && !formData.email.includes('@')) {
      toast({
        title: "Error",
        description: "Please enter a valid email address",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Profile Updated",
      description: "Your profile information has been saved successfully"
    });
    
    setIsEditing(false);
    console.log("Saving profile data:", formData);
  };

  const handleBioGenerated = (newBio: string) => {
    setFormData(prev => ({ ...prev, bio: newBio }));
  };

  // Educational Background handlers
  const handleAddEducation = () => {
    setFormData(prev => ({
      ...prev,
      educationalBackground: [...prev.educationalBackground, { degree: "", institution: "", year: "" }]
    }));
  };

  const handleUpdateEducation = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      educationalBackground: prev.educationalBackground.map((edu, i) =>
        i === index ? { ...edu, [field]: value } : edu
      )
    }));
  };

  const handleRemoveEducation = (index: number) => {
    setFormData(prev => ({
      ...prev,
      educationalBackground: prev.educationalBackground.filter((_, i) => i !== index)
    }));
  };

  // Work Experience handlers
  const handleAddWorkExperience = () => {
    setFormData(prev => ({
      ...prev,
      workExperience: [...prev.workExperience, { position: "", company: "", period: "" }]
    }));
  };

  const handleUpdateWorkExperience = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      workExperience: prev.workExperience.map((exp, i) =>
        i === index ? { ...exp, [field]: value } : exp
      )
    }));
  };

  const handleRemoveWorkExperience = (index: number) => {
    setFormData(prev => ({
      ...prev,
      workExperience: prev.workExperience.filter((_, i) => i !== index)
    }));
  };

  // Awards handlers
  const handleAddAward = () => {
    setFormData(prev => ({
      ...prev,
      awards: [...prev.awards, { title: "", organization: "", year: "" }]
    }));
  };

  const handleUpdateAward = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      awards: prev.awards.map((award, i) =>
        i === index ? { ...award, [field]: value } : award
      )
    }));
  };

  const handleRemoveAward = (index: number) => {
    setFormData(prev => ({
      ...prev,
      awards: prev.awards.filter((_, i) => i !== index)
    }));
  };

  // Publications handlers
  const handleAddPublication = () => {
    setFormData(prev => ({
      ...prev,
      publications: [...prev.publications, { title: "", journal: "", year: "" }]
    }));
  };

  const handleUpdatePublication = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      publications: prev.publications.map((pub, i) =>
        i === index ? { ...pub, [field]: value } : pub
      )
    }));
  };

  const handleRemovePublication = (index: number) => {
    setFormData(prev => ({
      ...prev,
      publications: prev.publications.filter((_, i) => i !== index)
    }));
  };

  // Scholarships handlers
  const handleAddScholarship = () => {
    setFormData(prev => ({
      ...prev,
      scholarships: [...prev.scholarships, { title: "", organization: "", period: "" }]
    }));
  };

  const handleUpdateScholarship = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      scholarships: prev.scholarships.map((scholarship, i) =>
        i === index ? { ...scholarship, [field]: value } : scholarship
      )
    }));
  };

  const handleRemoveScholarship = (index: number) => {
    setFormData(prev => ({
      ...prev,
      scholarships: prev.scholarships.filter((_, i) => i !== index)
    }));
  };

  // Affiliations handlers
  const handleAddAffiliation = () => {
    setFormData(prev => ({
      ...prev,
      affiliations: [...prev.affiliations, ""]
    }));
  };

  const handleUpdateAffiliation = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      affiliations: prev.affiliations.map((aff, i) =>
        i === index ? value : aff
      )
    }));
  };

  const handleRemoveAffiliation = (index: number) => {
    setFormData(prev => ({
      ...prev,
      affiliations: prev.affiliations.filter((_, i) => i !== index)
    }));
  };

  // Languages handlers
  const handleAddLanguage = () => {
    setFormData(prev => ({
      ...prev,
      languages: [...prev.languages, ""]
    }));
  };

  const handleUpdateLanguage = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      languages: prev.languages.map((lang, i) =>
        i === index ? value : lang
      )
    }));
  };

  const handleRemoveLanguage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      languages: prev.languages.filter((_, i) => i !== index)
    }));
  };

  // Supervision handlers
  const handleAddSupervision = () => {
    setFormData(prev => ({
      ...prev,
      supervision: [...prev.supervision, { level: "", count: 0 }]
    }));
  };

  const handleUpdateSupervision = (index: number, field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      supervision: prev.supervision.map((sup, i) =>
        i === index ? { ...sup, [field]: value } : sup
      )
    }));
  };

  const handleRemoveSupervision = (index: number) => {
    setFormData(prev => ({
      ...prev,
      supervision: prev.supervision.filter((_, i) => i !== index)
    }));
  };

  // Supervision Details handlers
  const handleAddSupervisionDetail = () => {
    setFormData(prev => ({
      ...prev,
      supervisionDetails: [...prev.supervisionDetails, { name: "", level: "", thesisTitle: "", year: "" }]
    }));
  };

  const handleUpdateSupervisionDetail = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      supervisionDetails: prev.supervisionDetails.map((detail, i) =>
        i === index ? { ...detail, [field]: value } : detail
      )
    }));
  };

  const handleRemoveSupervisionDetail = (index: number) => {
    setFormData(prev => ({
      ...prev,
      supervisionDetails: prev.supervisionDetails.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Profile Information</h2>
        <Button 
          onClick={isEditing ? handleSaveProfile : () => setIsEditing(true)}
          variant={isEditing ? "default" : "outline"}
        >
          {isEditing ? "Save Changes" : "Edit Profile"}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="h-5 w-5 mr-2" />
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Select
                value={formData.title}
                onValueChange={(value) => handleInputChange("title", value)}
                disabled={!isEditing}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select title" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Mr.">Mr.</SelectItem>
                  <SelectItem value="Mrs.">Mrs.</SelectItem>
                  <SelectItem value="Ms.">Ms.</SelectItem>
                  <SelectItem value="Dr.">Dr.</SelectItem>
                  <SelectItem value="Prof.">Prof.</SelectItem>
                  <SelectItem value="Eng.">Eng.</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                disabled={!isEditing}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                disabled={!isEditing}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Professional Bio with AI Generation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Professional Bio</span>
            {isEditing && (
              <AIBioGenerator 
                currentBio={formData.bio}
                profileData={formData}
                onBioGenerated={handleBioGenerated}
                userType="researcher"
              />
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={formData.bio}
            onChange={(e) => handleInputChange("bio", e.target.value)}
            disabled={!isEditing}
            rows={4}
            placeholder="Your professional bio will be displayed here..."
          />
        </CardContent>
      </Card>

      {/* Educational Background */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Educational Background</CardTitle>
            {isEditing && (
              <Button variant="outline" size="sm" onClick={handleAddEducation}>
                <Plus className="h-4 w-4 mr-2" />
                Add Education
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {formData.educationalBackground.map((edu, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-lg">
                <div>
                  <Label>Degree</Label>
                  <Input
                    value={edu.degree}
                    onChange={(e) => handleUpdateEducation(index, 'degree', e.target.value)}
                    disabled={!isEditing}
                    placeholder="e.g., PhD in Computer Science"
                  />
                </div>
                <div>
                  <Label>Institution</Label>
                  <Input
                    value={edu.institution}
                    onChange={(e) => handleUpdateEducation(index, 'institution', e.target.value)}
                    disabled={!isEditing}
                    placeholder="University name"
                  />
                </div>
                <div>
                  <Label>Year</Label>
                  <Input
                    value={edu.year}
                    onChange={(e) => handleUpdateEducation(index, 'year', e.target.value)}
                    disabled={!isEditing}
                    placeholder="2023"
                  />
                </div>
                {isEditing && (
                  <div className="flex items-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoveEducation(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Work Experience */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Work Experience</CardTitle>
            {isEditing && (
              <Button variant="outline" size="sm" onClick={handleAddWorkExperience}>
                <Plus className="h-4 w-4 mr-2" />
                Add Experience
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {formData.workExperience.map((exp, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-lg">
                <div>
                  <Label>Position</Label>
                  <Input
                    value={exp.position}
                    onChange={(e) => handleUpdateWorkExperience(index, 'position', e.target.value)}
                    disabled={!isEditing}
                    placeholder="Job title"
                  />
                </div>
                <div>
                  <Label>Company/Institution</Label>
                  <Input
                    value={exp.company}
                    onChange={(e) => handleUpdateWorkExperience(index, 'company', e.target.value)}
                    disabled={!isEditing}
                    placeholder="Company name"
                  />
                </div>
                <div>
                  <Label>Period</Label>
                  <Input
                    value={exp.period}
                    onChange={(e) => handleUpdateWorkExperience(index, 'period', e.target.value)}
                    disabled={!isEditing}
                    placeholder="2020-2023"
                  />
                </div>
                {isEditing && (
                  <div className="flex items-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoveWorkExperience(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Awards and Recognitions */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Awards and Recognitions</CardTitle>
            {isEditing && (
              <Button variant="outline" size="sm" onClick={handleAddAward}>
                <Plus className="h-4 w-4 mr-2" />
                Add Award
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {formData.awards.map((award, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-lg">
                <div>
                  <Label>Award Title</Label>
                  <Input
                    value={award.title}
                    onChange={(e) => handleUpdateAward(index, 'title', e.target.value)}
                    disabled={!isEditing}
                    placeholder="Award name"
                  />
                </div>
                <div>
                  <Label>Organization</Label>
                  <Input
                    value={award.organization}
                    onChange={(e) => handleUpdateAward(index, 'organization', e.target.value)}
                    disabled={!isEditing}
                    placeholder="Awarding organization"
                  />
                </div>
                <div>
                  <Label>Year</Label>
                  <Input
                    value={award.year}
                    onChange={(e) => handleUpdateAward(index, 'year', e.target.value)}
                    disabled={!isEditing}
                    placeholder="2023"
                  />
                </div>
                {isEditing && (
                  <div className="flex items-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoveAward(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Publications */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Publications</CardTitle>
            {isEditing && (
              <Button variant="outline" size="sm" onClick={handleAddPublication}>
                <Plus className="h-4 w-4 mr-2" />
                Add Publication
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {formData.publications.map((pub, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-lg">
                <div>
                  <Label>Title</Label>
                  <Input
                    value={pub.title}
                    onChange={(e) => handleUpdatePublication(index, 'title', e.target.value)}
                    disabled={!isEditing}
                    placeholder="Publication title"
                  />
                </div>
                <div>
                  <Label>Journal/Conference</Label>
                  <Input
                    value={pub.journal}
                    onChange={(e) => handleUpdatePublication(index, 'journal', e.target.value)}
                    disabled={!isEditing}
                    placeholder="Journal name"
                  />
                </div>
                <div>
                  <Label>Year</Label>
                  <Input
                    value={pub.year}
                    onChange={(e) => handleUpdatePublication(index, 'year', e.target.value)}
                    disabled={!isEditing}
                    placeholder="2023"
                  />
                </div>
                {isEditing && (
                  <div className="flex items-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemovePublication(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Scholarships and Fellowships */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Scholarships and Fellowships</CardTitle>
            {isEditing && (
              <Button variant="outline" size="sm" onClick={handleAddScholarship}>
                <Plus className="h-4 w-4 mr-2" />
                Add Scholarship
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {formData.scholarships.map((scholarship, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-lg">
                <div>
                  <Label>Title</Label>
                  <Input
                    value={scholarship.title}
                    onChange={(e) => handleUpdateScholarship(index, 'title', e.target.value)}
                    disabled={!isEditing}
                    placeholder="Scholarship/Fellowship title"
                  />
                </div>
                <div>
                  <Label>Organization</Label>
                  <Input
                    value={scholarship.organization}
                    onChange={(e) => handleUpdateScholarship(index, 'organization', e.target.value)}
                    disabled={!isEditing}
                    placeholder="Granting organization"
                  />
                </div>
                <div>
                  <Label>Period</Label>
                  <Input
                    value={scholarship.period}
                    onChange={(e) => handleUpdateScholarship(index, 'period', e.target.value)}
                    disabled={!isEditing}
                    placeholder="2020-2023"
                  />
                </div>
                {isEditing && (
                  <div className="flex items-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoveScholarship(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Professional Affiliations */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Professional Affiliations</CardTitle>
            {isEditing && (
              <Button variant="outline" size="sm" onClick={handleAddAffiliation}>
                <Plus className="h-4 w-4 mr-2" />
                Add Affiliation
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {formData.affiliations.map((affiliation, index) => (
              <div key={index} className="flex gap-2 items-center">
                <Input
                  value={affiliation}
                  onChange={(e) => handleUpdateAffiliation(index, e.target.value)}
                  disabled={!isEditing}
                  placeholder="Professional organization"
                  className="flex-1"
                />
                {isEditing && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRemoveAffiliation(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Languages */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Languages</CardTitle>
            {isEditing && (
              <Button variant="outline" size="sm" onClick={handleAddLanguage}>
                <Plus className="h-4 w-4 mr-2" />
                Add Language
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {formData.languages.map((language, index) => (
              <div key={index} className="flex gap-2 items-center">
                <Input
                  value={language}
                  onChange={(e) => handleUpdateLanguage(index, e.target.value)}
                  disabled={!isEditing}
                  placeholder="Language"
                  className="flex-1"
                />
                {isEditing && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRemoveLanguage(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Student Supervision */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Student Supervision</CardTitle>
            {isEditing && (
              <Button variant="outline" size="sm" onClick={handleAddSupervision}>
                <Plus className="h-4 w-4 mr-2" />
                Add Level
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {formData.supervision.map((sup, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg">
                <div>
                  <Label>Academic Level</Label>
                  <Select
                    value={sup.level}
                    onValueChange={(value) => handleUpdateSupervision(index, 'level', value)}
                    disabled={!isEditing}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Post Doctorate">Post Doctorate</SelectItem>
                      <SelectItem value="PhD">PhD</SelectItem>
                      <SelectItem value="Master's">Master's</SelectItem>
                      <SelectItem value="Undergraduate">Undergraduate</SelectItem>
                      <SelectItem value="Higher National Diploma">Higher National Diploma</SelectItem>
                      <SelectItem value="National Diploma">National Diploma</SelectItem>
                      <SelectItem value="DIPES">DIPES</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Number of Students</Label>
                  <Input
                    type="number"
                    value={sup.count}
                    onChange={(e) => handleUpdateSupervision(index, 'count', parseInt(e.target.value) || 0)}
                    disabled={!isEditing}
                    placeholder="0"
                  />
                </div>
                {isEditing && (
                  <div className="flex items-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoveSupervision(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Student Supervision Details */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Details of Student Supervision</CardTitle>
            {isEditing && (
              <Button variant="outline" size="sm" onClick={handleAddSupervisionDetail}>
                <Plus className="h-4 w-4 mr-2" />
                Add Student
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {formData.supervisionDetails.map((detail, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 border rounded-lg">
                <div>
                  <Label>Student Name</Label>
                  <Input
                    value={detail.name}
                    onChange={(e) => handleUpdateSupervisionDetail(index, 'name', e.target.value)}
                    disabled={!isEditing}
                    placeholder="Student full name"
                  />
                </div>
                <div>
                  <Label>Academic Level</Label>
                  <Select
                    value={detail.level}
                    onValueChange={(value) => handleUpdateSupervisionDetail(index, 'level', value)}
                    disabled={!isEditing}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Post Doctorate">Post Doctorate</SelectItem>
                      <SelectItem value="PhD">PhD</SelectItem>
                      <SelectItem value="Master's">Master's</SelectItem>
                      <SelectItem value="Undergraduate">Undergraduate</SelectItem>
                      <SelectItem value="Higher National Diploma">Higher National Diploma</SelectItem>
                      <SelectItem value="National Diploma">National Diploma</SelectItem>
                      <SelectItem value="DIPES">DIPES</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Thesis Title</Label>
                  <Input
                    value={detail.thesisTitle}
                    onChange={(e) => handleUpdateSupervisionDetail(index, 'thesisTitle', e.target.value)}
                    disabled={!isEditing}
                    placeholder="Research/thesis title"
                  />
                </div>
                <div>
                  <Label>Year</Label>
                  <Input
                    value={detail.year}
                    onChange={(e) => handleUpdateSupervisionDetail(index, 'year', e.target.value)}
                    disabled={!isEditing}
                    placeholder="2023"
                  />
                </div>
                {isEditing && (
                  <div className="flex items-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoveSupervisionDetail(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Account Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">47</p>
              <p className="text-sm text-gray-600">Total Consultations</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">4.8</p>
              <p className="text-sm text-gray-600">Average Rating</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">2.5 years</p>
              <p className="text-sm text-gray-600">Member Since</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileTab;
