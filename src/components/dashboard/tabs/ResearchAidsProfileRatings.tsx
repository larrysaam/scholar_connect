
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Star, 
  Edit, 
  Plus, 
  Save, 
  X, 
  Upload,
  Award,
  BookOpen,
  Briefcase,
  GraduationCap,
  Globe
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ResearchAidsProfileRatings = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState("/placeholder-avatar.jpg");
  const { toast } = useToast();

  // Profile data state
  const [profileData, setProfileData] = useState({
    title: "Dr.",
    name: "Neba Emmanuel",
    bio: "Experienced research professional with expertise in statistical analysis, data collection, and academic writing. Specialized in agricultural research and environmental studies.",
    hourlyRate: "5000",
    location: "Yaoundé, Cameroon",
    languages: ["English", "French"],
    skills: ["Statistical Analysis", "Data Collection", "Academic Writing", "SPSS", "Research Methodology"],
    education: [
      {
        degree: "PhD in Agricultural Economics",
        institution: "University of Yaoundé I",
        year: "2018",
        field: "Agricultural Development"
      }
    ],
    experience: [
      {
        position: "Senior Research Analyst",
        institution: "IRAD (Institute of Agricultural Research)",
        period: "2019 - Present",
        description: "Leading research projects in agricultural productivity and sustainability"
      }
    ],
    awards: [
      {
        title: "Best Research Paper Award",
        year: "2022",
        organization: "African Agricultural Research Association"
      }
    ],
    publications: [
      {
        title: "Sustainable Agricultural Practices in Cameroon",
        journal: "Journal of African Agriculture",
        year: "2023",
        type: "Peer-reviewed"
      }
    ],
    scholarships: [
      {
        title: "African Development Bank Scholarship",
        period: "2015-2018",
        amount: "Full Tuition"
      }
    ],
    affiliations: [
      {
        organization: "International Association of Agricultural Economists",
        role: "Member",
        since: "2019"
      }
    ]
  });

  // Achievement data
  const achievements = {
    topRatedExpert: {
      achieved: true,
      criteria: "Maintain 4.8+ rating for 50+ projects",
      progress: "4.9/5.0 rating across 75 projects"
    },
    fastResponder: {
      achieved: true,
      criteria: "Respond to messages within 2 hours",
      progress: "Average response time: 45 minutes"
    },
    trustedProfessional: {
      achieved: false,
      criteria: "Complete verification process and maintain clean record",
      progress: "Verification in progress: 80% complete"
    }
  };

  const reviews = [
    {
      id: 1,
      client: "Dr. Sarah Johnson",
      rating: 5,
      comment: "Excellent statistical analysis work. Very professional and delivered on time.",
      project: "Agricultural Productivity Study",
      date: "2024-01-28"
    },
    {
      id: 2,
      client: "Prof. Michael Chen",
      rating: 4,
      comment: "Good quality literature review. Well researched and comprehensive.",
      project: "Climate Change Research",
      date: "2024-01-25"
    },
    {
      id: 3,
      client: "Dr. Marie Dubois",
      rating: 5,
      comment: "Outstanding data collection work. Highly recommend!",
      project: "Field Survey Project",
      date: "2024-01-20"
    }
  ];

  const overallRating = 4.9;
  const totalReviews = 47;

  // Form states for adding new items
  const [newEducation, setNewEducation] = useState({
    degree: "", institution: "", year: "", field: ""
  });
  const [newExperience, setNewExperience] = useState({
    position: "", institution: "", period: "", description: ""
  });
  const [newAward, setNewAward] = useState({
    title: "", year: "", organization: ""
  });
  const [newPublication, setNewPublication] = useState({
    title: "", journal: "", year: "", type: ""
  });
  const [newScholarship, setNewScholarship] = useState({
    title: "", period: "", amount: ""
  });
  const [newAffiliation, setNewAffiliation] = useState({
    organization: "", role: "", since: ""
  });
  const [newSkill, setNewSkill] = useState("");
  const [newLanguage, setNewLanguage] = useState("");

  const handleUpdateProfile = (field: string, value: any) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveProfile = () => {
    setIsEditing(false);
    toast({
      title: "Profile Updated",
      description: "Your profile has been saved successfully"
    });
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Simulate image upload
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
      toast({
        title: "Image Updated",
        description: "Profile image has been updated"
      });
    }
  };

  const addEducation = () => {
    if (!newEducation.degree || !newEducation.institution) {
      toast({
        title: "Error",
        description: "Please fill in required fields",
        variant: "destructive"
      });
      return;
    }
    
    setProfileData(prev => ({
      ...prev,
      education: [...prev.education, newEducation]
    }));
    setNewEducation({ degree: "", institution: "", year: "", field: "" });
    toast({ title: "Education Added", description: "New education entry added successfully" });
  };

  const addExperience = () => {
    if (!newExperience.position || !newExperience.institution) {
      toast({
        title: "Error",
        description: "Please fill in required fields",
        variant: "destructive"
      });
      return;
    }
    
    setProfileData(prev => ({
      ...prev,
      experience: [...prev.experience, newExperience]
    }));
    setNewExperience({ position: "", institution: "", period: "", description: "" });
    toast({ title: "Experience Added", description: "New experience entry added successfully" });
  };

  const addAward = () => {
    if (!newAward.title || !newAward.year) {
      toast({
        title: "Error",
        description: "Please fill in required fields",
        variant: "destructive"
      });
      return;
    }
    
    setProfileData(prev => ({
      ...prev,
      awards: [...prev.awards, newAward]
    }));
    setNewAward({ title: "", year: "", organization: "" });
    toast({ title: "Award Added", description: "New award entry added successfully" });
  };

  const addPublication = () => {
    if (!newPublication.title || !newPublication.journal) {
      toast({
        title: "Error",
        description: "Please fill in required fields",
        variant: "destructive"
      });
      return;
    }
    
    setProfileData(prev => ({
      ...prev,
      publications: [...prev.publications, newPublication]
    }));
    setNewPublication({ title: "", journal: "", year: "", type: "" });
    toast({ title: "Publication Added", description: "New publication entry added successfully" });
  };

  const addScholarship = () => {
    if (!newScholarship.title || !newScholarship.period) {
      toast({
        title: "Error",
        description: "Please fill in required fields",
        variant: "destructive"
      });
      return;
    }
    
    setProfileData(prev => ({
      ...prev,
      scholarships: [...prev.scholarships, newScholarship]
    }));
    setNewScholarship({ title: "", period: "", amount: "" });
    toast({ title: "Scholarship Added", description: "New scholarship entry added successfully" });
  };

  const addAffiliation = () => {
    if (!newAffiliation.organization || !newAffiliation.role) {
      toast({
        title: "Error",
        description: "Please fill in required fields",
        variant: "destructive"
      });
      return;
    }
    
    setProfileData(prev => ({
      ...prev,
      affiliations: [...prev.affiliations, newAffiliation]
    }));
    setNewAffiliation({ organization: "", role: "", since: "" });
    toast({ title: "Affiliation Added", description: "New affiliation entry added successfully" });
  };

  const addSkill = () => {
    if (!newSkill.trim()) return;
    
    setProfileData(prev => ({
      ...prev,
      skills: [...prev.skills, newSkill.trim()]
    }));
    setNewSkill("");
    toast({ title: "Skill Added", description: "New skill added successfully" });
  };

  const addLanguage = () => {
    if (!newLanguage.trim()) return;
    
    setProfileData(prev => ({
      ...prev,
      languages: [...prev.languages, newLanguage.trim()]
    }));
    setNewLanguage("");
    toast({ title: "Language Added", description: "New language added successfully" });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < rating ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">My Profile & Ratings</h2>
        <Button 
          onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
          variant={isEditing ? "default" : "outline"}
        >
          {isEditing ? <Save className="h-4 w-4 mr-2" /> : <Edit className="h-4 w-4 mr-2" />}
          {isEditing ? "Save Changes" : "Edit Profile"}
        </Button>
      </div>

      {/* Profile Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex flex-col items-center md:items-start">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage src={profileImage} alt={profileData.name} />
                <AvatarFallback>{profileData.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              {isEditing && (
                <Button variant="outline" size="sm" onClick={() => document.getElementById('profile-image')?.click()}>
                  <Upload className="h-4 w-4 mr-2" />
                  Change Photo
                </Button>
              )}
              <input
                id="profile-image"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </div>
            
            <div className="flex-1 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Title</Label>
                  {isEditing ? (
                    <Select value={profileData.title} onValueChange={(value) => handleUpdateProfile('title', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Mr.">Mr.</SelectItem>
                        <SelectItem value="Mrs.">Mrs.</SelectItem>
                        <SelectItem value="Dr.">Dr.</SelectItem>
                        <SelectItem value="Prof.">Prof.</SelectItem>
                        <SelectItem value="Eng.">Eng.</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <p className="font-medium">{profileData.title}</p>
                  )}
                </div>
                <div>
                  <Label>Full Name</Label>
                  {isEditing ? (
                    <Input
                      value={profileData.name}
                      onChange={(e) => handleUpdateProfile('name', e.target.value)}
                    />
                  ) : (
                    <p className="font-medium">{profileData.name}</p>
                  )}
                </div>
                <div>
                  <Label>Hourly Rate (XAF)</Label>
                  {isEditing ? (
                    <Input
                      value={profileData.hourlyRate}
                      onChange={(e) => handleUpdateProfile('hourlyRate', e.target.value)}
                    />
                  ) : (
                    <p className="font-medium">{profileData.hourlyRate} XAF/hour</p>
                  )}
                </div>
                <div>
                  <Label>Location</Label>
                  {isEditing ? (
                    <Input
                      value={profileData.location}
                      onChange={(e) => handleUpdateProfile('location', e.target.value)}
                    />
                  ) : (
                    <p className="font-medium">{profileData.location}</p>
                  )}
                </div>
              </div>
              
              <div>
                <Label>Bio</Label>
                {isEditing ? (
                  <Textarea
                    value={profileData.bio}
                    onChange={(e) => handleUpdateProfile('bio', e.target.value)}
                    rows={3}
                  />
                ) : (
                  <p className="text-gray-700">{profileData.bio}</p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Languages and Skills */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Languages
              </CardTitle>
              {isEditing && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-1" />
                      Add Language
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Language</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <Input
                        placeholder="Enter language"
                        value={newLanguage}
                        onChange={(e) => setNewLanguage(e.target.value)}
                      />
                      <Button onClick={addLanguage} className="w-full">Add Language</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {profileData.languages.map((language, index) => (
                <Badge key={index} variant="outline">{language}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Skills</CardTitle>
              {isEditing && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-1" />
                      Add Skill
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Skill</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <Input
                        placeholder="Enter skill"
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                      />
                      <Button onClick={addSkill} className="w-full">Add Skill</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {profileData.skills.map((skill, index) => (
                <Badge key={index} variant="secondary">{skill}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Educational Background */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              Educational Background
            </CardTitle>
            {isEditing && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-1" />
                    Add Education
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Education</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Input
                      placeholder="Degree"
                      value={newEducation.degree}
                      onChange={(e) => setNewEducation(prev => ({ ...prev, degree: e.target.value }))}
                    />
                    <Input
                      placeholder="Institution"
                      value={newEducation.institution}
                      onChange={(e) => setNewEducation(prev => ({ ...prev, institution: e.target.value }))}
                    />
                    <Input
                      placeholder="Year"
                      value={newEducation.year}
                      onChange={(e) => setNewEducation(prev => ({ ...prev, year: e.target.value }))}
                    />
                    <Input
                      placeholder="Field of Study"
                      value={newEducation.field}
                      onChange={(e) => setNewEducation(prev => ({ ...prev, field: e.target.value }))}
                    />
                    <Button onClick={addEducation} className="w-full">Add Education</Button>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {profileData.education.map((edu, index) => (
              <div key={index} className="border-l-4 border-l-blue-500 pl-4">
                <h4 className="font-medium">{edu.degree}</h4>
                <p className="text-gray-600">{edu.institution}</p>
                <p className="text-sm text-gray-500">{edu.year} • {edu.field}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Work Experience */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Work Experience
            </CardTitle>
            {isEditing && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-1" />
                    Add Experience
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Experience</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Input
                      placeholder="Position"
                      value={newExperience.position}
                      onChange={(e) => setNewExperience(prev => ({ ...prev, position: e.target.value }))}
                    />
                    <Input
                      placeholder="Institution"
                      value={newExperience.institution}
                      onChange={(e) => setNewExperience(prev => ({ ...prev, institution: e.target.value }))}
                    />
                    <Input
                      placeholder="Period (e.g., 2019-Present)"
                      value={newExperience.period}
                      onChange={(e) => setNewExperience(prev => ({ ...prev, period: e.target.value }))}
                    />
                    <Textarea
                      placeholder="Description"
                      value={newExperience.description}
                      onChange={(e) => setNewExperience(prev => ({ ...prev, description: e.target.value }))}
                    />
                    <Button onClick={addExperience} className="w-full">Add Experience</Button>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {profileData.experience.map((exp, index) => (
              <div key={index} className="border-l-4 border-l-green-500 pl-4">
                <h4 className="font-medium">{exp.position}</h4>
                <p className="text-gray-600">{exp.institution}</p>
                <p className="text-sm text-gray-500">{exp.period}</p>
                <p className="text-sm mt-2">{exp.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Awards and Publications in two columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Awards & Recognition
              </CardTitle>
              {isEditing && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-1" />
                      Add Award
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Award</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <Input
                        placeholder="Award Title"
                        value={newAward.title}
                        onChange={(e) => setNewAward(prev => ({ ...prev, title: e.target.value }))}
                      />
                      <Input
                        placeholder="Year"
                        value={newAward.year}
                        onChange={(e) => setNewAward(prev => ({ ...prev, year: e.target.value }))}
                      />
                      <Input
                        placeholder="Organization"
                        value={newAward.organization}
                        onChange={(e) => setNewAward(prev => ({ ...prev, organization: e.target.value }))}
                      />
                      <Button onClick={addAward} className="w-full">Add Award</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {profileData.awards.map((award, index) => (
                <div key={index} className="border-l-4 border-l-yellow-500 pl-4">
                  <h4 className="font-medium">{award.title}</h4>
                  <p className="text-sm text-gray-600">{award.organization}</p>
                  <p className="text-sm text-gray-500">{award.year}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Publications
              </CardTitle>
              {isEditing && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-1" />
                      Add Publication
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Publication</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <Input
                        placeholder="Publication Title"
                        value={newPublication.title}
                        onChange={(e) => setNewPublication(prev => ({ ...prev, title: e.target.value }))}
                      />
                      <Input
                        placeholder="Journal/Conference"
                        value={newPublication.journal}
                        onChange={(e) => setNewPublication(prev => ({ ...prev, journal: e.target.value }))}
                      />
                      <Input
                        placeholder="Year"
                        value={newPublication.year}
                        onChange={(e) => setNewPublication(prev => ({ ...prev, year: e.target.value }))}
                      />
                      <Input
                        placeholder="Type (e.g., Peer-reviewed)"
                        value={newPublication.type}
                        onChange={(e) => setNewPublication(prev => ({ ...prev, type: e.target.value }))}
                      />
                      <Button onClick={addPublication} className="w-full">Add Publication</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {profileData.publications.map((pub, index) => (
                <div key={index} className="border-l-4 border-l-purple-500 pl-4">
                  <h4 className="font-medium">{pub.title}</h4>
                  <p className="text-sm text-gray-600">{pub.journal}</p>
                  <p className="text-sm text-gray-500">{pub.year} • {pub.type}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Scholarships and Affiliations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Scholarships & Fellowships</CardTitle>
              {isEditing && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-1" />
                      Add Scholarship
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Scholarship</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <Input
                        placeholder="Scholarship Title"
                        value={newScholarship.title}
                        onChange={(e) => setNewScholarship(prev => ({ ...prev, title: e.target.value }))}
                      />
                      <Input
                        placeholder="Period"
                        value={newScholarship.period}
                        onChange={(e) => setNewScholarship(prev => ({ ...prev, period: e.target.value }))}
                      />
                      <Input
                        placeholder="Amount/Coverage"
                        value={newScholarship.amount}
                        onChange={(e) => setNewScholarship(prev => ({ ...prev, amount: e.target.value }))}
                      />
                      <Button onClick={addScholarship} className="w-full">Add Scholarship</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {profileData.scholarships.map((scholarship, index) => (
                <div key={index} className="border-l-4 border-l-indigo-500 pl-4">
                  <h4 className="font-medium">{scholarship.title}</h4>
                  <p className="text-sm text-gray-600">{scholarship.period}</p>
                  <p className="text-sm text-gray-500">{scholarship.amount}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Professional Affiliations</CardTitle>
              {isEditing && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-1" />
                      Add Affiliation
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Affiliation</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <Input
                        placeholder="Organization"
                        value={newAffiliation.organization}
                        onChange={(e) => setNewAffiliation(prev => ({ ...prev, organization: e.target.value }))}
                      />
                      <Input
                        placeholder="Role/Position"
                        value={newAffiliation.role}
                        onChange={(e) => setNewAffiliation(prev => ({ ...prev, role: e.target.value }))}
                      />
                      <Input
                        placeholder="Member Since"
                        value={newAffiliation.since}
                        onChange={(e) => setNewAffiliation(prev => ({ ...prev, since: e.target.value }))}
                      />
                      <Button onClick={addAffiliation} className="w-full">Add Affiliation</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {profileData.affiliations.map((affiliation, index) => (
                <div key={index} className="border-l-4 border-l-pink-500 pl-4">
                  <h4 className="font-medium">{affiliation.organization}</h4>
                  <p className="text-sm text-gray-600">{affiliation.role}</p>
                  <p className="text-sm text-gray-500">Since {affiliation.since}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle>Achievements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(achievements).map(([key, achievement]) => (
              <div
                key={key}
                className={`p-4 rounded-lg border-2 ${
                  achievement.achieved
                    ? "border-green-200 bg-green-50"
                    : "border-gray-200 bg-gray-50"
                }`}
              >
                <div className="flex items-center space-x-2 mb-2">
                  <Award
                    className={`h-5 w-5 ${
                      achievement.achieved ? "text-green-600" : "text-gray-400"
                    }`}
                  />
                  <h4 className="font-medium capitalize">
                    {key.replace(/([A-Z])/g, " $1").trim()}
                  </h4>
                </div>
                <p className="text-sm text-gray-600 mb-2">{achievement.criteria}</p>
                <p className="text-xs text-gray-500">{achievement.progress}</p>
                {achievement.achieved && (
                  <Badge className="mt-2 bg-green-600">Achieved</Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Reviews Section */}
      <Card>
        <CardHeader>
          <CardTitle>Client Reviews & Ratings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="text-3xl font-bold">{overallRating}</div>
                <div className="flex items-center justify-center space-x-1">
                  {renderStars(Math.floor(overallRating))}
                </div>
                <div className="text-sm text-gray-600">{totalReviews} reviews</div>
              </div>
              <div className="flex-1">
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map((stars) => {
                    const count = reviews.filter(r => r.rating === stars).length;
                    const percentage = (count / reviews.length) * 100;
                    return (
                      <div key={stars} className="flex items-center space-x-2">
                        <span className="text-sm w-8">{stars}★</span>
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-yellow-400 h-2 rounded-full"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600 w-8">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {reviews.map((review) => (
              <Card key={review.id} className="border-l-4 border-l-blue-500">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium">{review.client}</h4>
                      <p className="text-sm text-gray-600">{review.project}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-1">
                        {renderStars(review.rating)}
                      </div>
                      <p className="text-sm text-gray-500">{review.date}</p>
                    </div>
                  </div>
                  <p className="text-gray-700">{review.comment}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResearchAidsProfileRatings;
