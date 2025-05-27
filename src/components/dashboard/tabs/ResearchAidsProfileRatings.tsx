import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star, Edit2, MapPin, Calendar, Award, BookOpen, Users, CheckCircle, Plus, X, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ResearchAidsProfileRatings = () => {
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [profileData, setProfileData] = useState({
    title: "Dr.",
    name: "Neba Emmanuel",
    jobTitle: "Academic Editor & Research Consultant",
    bio: "Experienced academic editor and research consultant with expertise in statistical analysis, academic writing, and data interpretation. Specialized in agricultural research and environmental studies.",
    location: "Yaoundé, Cameroon",
    experience: "5+ years",
    education: "PhD in Agricultural Sciences",
    skills: ["Statistical Analysis", "Data Analysis", "Literature Review", "Academic Writing", "SPSS", "Research Design"],
    languages: ["English", "French"],
    educationalBackground: [
      { degree: "PhD in Agricultural Sciences", institution: "University of Yaoundé I", year: "2018" }
    ],
    workExperience: [
      { position: "Research Consultant", company: "Independent", period: "2020-Present" }
    ],
    awards: [
      { title: "Best Research Paper Award", organization: "Agricultural Research Society", year: "2022" }
    ],
    publications: [
      { title: "Impact of Climate Change on Agricultural Productivity", journal: "Journal of Agricultural Research", year: "2023" }
    ],
    scholarships: [
      { title: "Government Scholarship", organization: "Ministry of Higher Education", period: "2015-2018" }
    ],
    affiliations: ["International Agricultural Research Association", "Statistical Analysis Society"]
  });
  const { toast } = useToast();

  const profileStats = {
    completedJobs: 24,
    totalEarnings: "245,000 XAF",
    averageRating: 4.8,
    responseTime: "2 hours",
    completionRate: "98%",
    clientRetention: "85%"
  };

  const recentReviews = [
    {
      id: 1,
      client: "Dr. Sarah Johnson",
      project: "Statistical Analysis for Agricultural Study",
      rating: 5,
      review: "Excellent work on the statistical analysis. Very thorough and professional approach to data interpretation.",
      date: "2024-01-15"
    },
    {
      id: 2,
      client: "Prof. Michael Chen",
      project: "Literature Review on Climate Change",
      rating: 4,
      review: "Good quality literature review with comprehensive coverage. Delivered on time with clear documentation.",
      date: "2024-01-08"
    },
    {
      id: 3,
      client: "Dr. Marie Dubois",
      project: "Survey Data Collection",
      rating: 5,
      review: "Outstanding data collection work. Very organized and efficient. Highly recommend for future projects.",
      date: "2023-12-20"
    }
  ];

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

  const handleProfileUpdate = () => {
    toast({
      title: "Profile Updated",
      description: "Your profile information has been successfully updated"
    });
    setIsEditProfileOpen(false);
  };

  const handleAddEducation = () => {
    setProfileData(prev => ({
      ...prev,
      educationalBackground: [...prev.educationalBackground, { degree: "", institution: "", year: "" }]
    }));
  };

  const handleUpdateEducation = (index: number, field: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      educationalBackground: prev.educationalBackground.map((edu, i) =>
        i === index ? { ...edu, [field]: value } : edu
      )
    }));
  };

  const handleRemoveEducation = (index: number) => {
    setProfileData(prev => ({
      ...prev,
      educationalBackground: prev.educationalBackground.filter((_, i) => i !== index)
    }));
  };

  const handleAddWorkExperience = () => {
    setProfileData(prev => ({
      ...prev,
      workExperience: [...prev.workExperience, { position: "", company: "", period: "" }]
    }));
  };

  const handleUpdateWorkExperience = (index: number, field: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      workExperience: prev.workExperience.map((exp, i) =>
        i === index ? { ...exp, [field]: value } : exp
      )
    }));
  };

  const handleRemoveWorkExperience = (index: number) => {
    setProfileData(prev => ({
      ...prev,
      workExperience: prev.workExperience.filter((_, i) => i !== index)
    }));
  };

  const handleAddAward = () => {
    setProfileData(prev => ({
      ...prev,
      awards: [...prev.awards, { title: "", organization: "", year: "" }]
    }));
  };

  const handleUpdateAward = (index: number, field: string, value: string) => {
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

  const handleAddPublication = () => {
    setProfileData(prev => ({
      ...prev,
      publications: [...prev.publications, { title: "", journal: "", year: "" }]
    }));
  };

  const handleUpdatePublication = (index: number, field: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      publications: prev.publications.map((pub, i) =>
        i === index ? { ...pub, [field]: value } : pub
      )
    }));
  };

  const handleRemovePublication = (index: number) => {
    setProfileData(prev => ({
      ...prev,
      publications: prev.publications.filter((_, i) => i !== index)
    }));
  };

  const handleAddScholarship = () => {
    setProfileData(prev => ({
      ...prev,
      scholarships: [...prev.scholarships, { title: "", organization: "", period: "" }]
    }));
  };

  const handleUpdateScholarship = (index: number, field: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      scholarships: prev.scholarships.map((scholarship, i) =>
        i === index ? { ...scholarship, [field]: value } : scholarship
      )
    }));
  };

  const handleRemoveScholarship = (index: number) => {
    setProfileData(prev => ({
      ...prev,
      scholarships: prev.scholarships.filter((_, i) => i !== index)
    }));
  };

  const handleAddAffiliation = () => {
    setProfileData(prev => ({
      ...prev,
      affiliations: [...prev.affiliations, ""]
    }));
  };

  const handleUpdateAffiliation = (index: number, value: string) => {
    setProfileData(prev => ({
      ...prev,
      affiliations: prev.affiliations.map((aff, i) =>
        i === index ? value : aff
      )
    }));
  };

  const handleRemoveAffiliation = (index: number) => {
    setProfileData(prev => ({
      ...prev,
      affiliations: prev.affiliations.filter((_, i) => i !== index)
    }));
  };

  const handleAddLanguage = () => {
    setProfileData(prev => ({
      ...prev,
      languages: [...prev.languages, ""]
    }));
  };

  const handleUpdateLanguage = (index: number, value: string) => {
    setProfileData(prev => ({
      ...prev,
      languages: prev.languages.map((lang, i) =>
        i === index ? value : lang
      )
    }));
  };

  const handleRemoveLanguage = (index: number) => {
    setProfileData(prev => ({
      ...prev,
      languages: prev.languages.filter((_, i) => i !== index)
    }));
  };

  const handleAddSkill = () => {
    setProfileData(prev => ({
      ...prev,
      skills: [...prev.skills, ""]
    }));
  };

  const handleUpdateSkill = (index: number, value: string) => {
    setProfileData(prev => ({
      ...prev,
      skills: prev.skills.map((skill, i) =>
        i === index ? value : skill
      )
    }));
  };

  const handleRemoveSkill = (index: number) => {
    setProfileData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">My Profile & Ratings</h2>
        <Dialog open={isEditProfileOpen} onOpenChange={setIsEditProfileOpen}>
          <DialogTrigger asChild>
            <Button>
              <Edit2 className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Profile</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Select
                      value={profileData.title}
                      onValueChange={(value) => setProfileData(prev => ({ ...prev, title: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
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
                      value={profileData.name}
                      onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="jobTitle">Professional Title</Label>
                  <Input
                    id="jobTitle"
                    value={profileData.jobTitle}
                    onChange={(e) => setProfileData(prev => ({ ...prev, jobTitle: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="bio">Professional Bio</Label>
                  <Textarea
                    id="bio"
                    value={profileData.bio}
                    onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                    rows={4}
                  />
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={profileData.location}
                    onChange={(e) => setProfileData(prev => ({ ...prev, location: e.target.value }))}
                  />
                </div>
              </div>

              {/* Educational Background */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Educational Background</h3>
                  <Button type="button" variant="outline" size="sm" onClick={handleAddEducation}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Education
                  </Button>
                </div>
                {profileData.educationalBackground.map((edu, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-lg">
                    <div>
                      <Label>Degree</Label>
                      <Input
                        value={edu.degree}
                        onChange={(e) => handleUpdateEducation(index, 'degree', e.target.value)}
                        placeholder="e.g., PhD in Computer Science"
                      />
                    </div>
                    <div>
                      <Label>Institution</Label>
                      <Input
                        value={edu.institution}
                        onChange={(e) => handleUpdateEducation(index, 'institution', e.target.value)}
                        placeholder="University name"
                      />
                    </div>
                    <div>
                      <Label>Year</Label>
                      <Input
                        value={edu.year}
                        onChange={(e) => handleUpdateEducation(index, 'year', e.target.value)}
                        placeholder="2023"
                      />
                    </div>
                    <div className="flex items-end">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemoveEducation(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Work Experience */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Work Experience</h3>
                  <Button type="button" variant="outline" size="sm" onClick={handleAddWorkExperience}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Experience
                  </Button>
                </div>
                {profileData.workExperience.map((exp, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-lg">
                    <div>
                      <Label>Position</Label>
                      <Input
                        value={exp.position}
                        onChange={(e) => handleUpdateWorkExperience(index, 'position', e.target.value)}
                        placeholder="Job title"
                      />
                    </div>
                    <div>
                      <Label>Company</Label>
                      <Input
                        value={exp.company}
                        onChange={(e) => handleUpdateWorkExperience(index, 'company', e.target.value)}
                        placeholder="Company name"
                      />
                    </div>
                    <div>
                      <Label>Period</Label>
                      <Input
                        value={exp.period}
                        onChange={(e) => handleUpdateWorkExperience(index, 'period', e.target.value)}
                        placeholder="2020-2023"
                      />
                    </div>
                    <div className="flex items-end">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemoveWorkExperience(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Awards and Recognitions */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Awards and Recognitions</h3>
                  <Button type="button" variant="outline" size="sm" onClick={handleAddAward}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Award
                  </Button>
                </div>
                {profileData.awards.map((award, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-lg">
                    <div>
                      <Label>Award Title</Label>
                      <Input
                        value={award.title}
                        onChange={(e) => handleUpdateAward(index, 'title', e.target.value)}
                        placeholder="Award name"
                      />
                    </div>
                    <div>
                      <Label>Organization</Label>
                      <Input
                        value={award.organization}
                        onChange={(e) => handleUpdateAward(index, 'organization', e.target.value)}
                        placeholder="Awarding organization"
                      />
                    </div>
                    <div>
                      <Label>Year</Label>
                      <Input
                        value={award.year}
                        onChange={(e) => handleUpdateAward(index, 'year', e.target.value)}
                        placeholder="2023"
                      />
                    </div>
                    <div className="flex items-end">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemoveAward(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Publications */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Publications</h3>
                  <Button type="button" variant="outline" size="sm" onClick={handleAddPublication}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Publication
                  </Button>
                </div>
                {profileData.publications.map((pub, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-lg">
                    <div>
                      <Label>Title</Label>
                      <Input
                        value={pub.title}
                        onChange={(e) => handleUpdatePublication(index, 'title', e.target.value)}
                        placeholder="Publication title"
                      />
                    </div>
                    <div>
                      <Label>Journal</Label>
                      <Input
                        value={pub.journal}
                        onChange={(e) => handleUpdatePublication(index, 'journal', e.target.value)}
                        placeholder="Journal name"
                      />
                    </div>
                    <div>
                      <Label>Year</Label>
                      <Input
                        value={pub.year}
                        onChange={(e) => handleUpdatePublication(index, 'year', e.target.value)}
                        placeholder="2023"
                      />
                    </div>
                    <div className="flex items-end">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemovePublication(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Scholarships and Fellowships */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Scholarships and Fellowships</h3>
                  <Button type="button" variant="outline" size="sm" onClick={handleAddScholarship}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Scholarship
                  </Button>
                </div>
                {profileData.scholarships.map((scholarship, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-lg">
                    <div>
                      <Label>Title</Label>
                      <Input
                        value={scholarship.title}
                        onChange={(e) => handleUpdateScholarship(index, 'title', e.target.value)}
                        placeholder="Scholarship/Fellowship title"
                      />
                    </div>
                    <div>
                      <Label>Organization</Label>
                      <Input
                        value={scholarship.organization}
                        onChange={(e) => handleUpdateScholarship(index, 'organization', e.target.value)}
                        placeholder="Granting organization"
                      />
                    </div>
                    <div>
                      <Label>Period</Label>
                      <Input
                        value={scholarship.period}
                        onChange={(e) => handleUpdateScholarship(index, 'period', e.target.value)}
                        placeholder="2020-2023"
                      />
                    </div>
                    <div className="flex items-end">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemoveScholarship(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Professional Affiliations */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Professional Affiliations</h3>
                  <Button type="button" variant="outline" size="sm" onClick={handleAddAffiliation}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Affiliation
                  </Button>
                </div>
                {profileData.affiliations.map((affiliation, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <Input
                      value={affiliation}
                      onChange={(e) => handleUpdateAffiliation(index, e.target.value)}
                      placeholder="Professional organization"
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoveAffiliation(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              {/* Languages */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Languages</h3>
                  <Button type="button" variant="outline" size="sm" onClick={handleAddLanguage}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Language
                  </Button>
                </div>
                {profileData.languages.map((language, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <Input
                      value={language}
                      onChange={(e) => handleUpdateLanguage(index, e.target.value)}
                      placeholder="Language"
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoveLanguage(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              {/* Skills */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Skills</h3>
                  <Button type="button" variant="outline" size="sm" onClick={handleAddSkill}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Skill
                  </Button>
                </div>
                {profileData.skills.map((skill, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <Input
                      value={skill}
                      onChange={(e) => handleUpdateSkill(index, e.target.value)}
                      placeholder="Skill"
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoveSkill(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              <div className="flex space-x-2">
                <Button onClick={handleProfileUpdate} className="flex-1">
                  Save Changes
                </Button>
                <Button variant="outline" onClick={() => setIsEditProfileOpen(false)} className="flex-1">
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Profile Overview */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start space-x-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src="/placeholder-avatar.jpg" alt={`${profileData.title} ${profileData.name}`} />
              <AvatarFallback className="text-lg">
                {profileData.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h3 className="text-xl font-bold">{profileData.title} {profileData.name}</h3>
                <Badge className="bg-green-600">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Verified
                </Badge>
              </div>
              
              <p className="text-gray-600 font-medium mb-3">{profileData.jobTitle}</p>
              <p className="text-gray-700 mb-4">{profileData.bio}</p>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span>{profileData.location}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span>{profileData.experience} experience</span>
                </div>
                <div className="flex items-center space-x-2">
                  <BookOpen className="h-4 w-4 text-gray-500" />
                  <span>{profileData.education}</span>
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <div className="flex items-center space-x-1 mb-1">
                {renderStars(Math.floor(profileStats.averageRating))}
              </div>
              <p className="text-lg font-bold">{profileStats.averageRating}/5.0</p>
              <p className="text-sm text-gray-600">{profileStats.completedJobs} reviews</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <Award className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Completed Jobs</p>
                <p className="text-2xl font-bold">{profileStats.completedJobs}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <Users className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Total Earnings</p>
                <p className="text-2xl font-bold">{profileStats.totalEarnings}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Success Rate</p>
                <p className="text-2xl font-bold">{profileStats.completionRate}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Profile Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Educational Background */}
        <Card>
          <CardHeader>
            <CardTitle>Educational Background</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {profileData.educationalBackground.map((edu, index) => (
                <div key={index} className="border-l-2 border-blue-600 pl-4 py-2">
                  <h4 className="font-medium">{edu.degree}</h4>
                  <p className="text-sm text-gray-600">{edu.institution}</p>
                  <p className="text-xs text-gray-500">{edu.year}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Work Experience */}
        <Card>
          <CardHeader>
            <CardTitle>Work Experience</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {profileData.workExperience.map((exp, index) => (
                <div key={index} className="border-l-2 border-green-600 pl-4 py-2">
                  <h4 className="font-medium">{exp.position}</h4>
                  <p className="text-sm text-gray-600">{exp.company}</p>
                  <p className="text-xs text-gray-500">{exp.period}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Awards and Recognitions */}
        <Card>
          <CardHeader>
            <CardTitle>Awards and Recognitions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {profileData.awards.map((award, index) => (
                <div key={index} className="border-l-2 border-yellow-500 pl-4 py-2">
                  <h4 className="font-medium">{award.title}</h4>
                  <p className="text-sm text-gray-600">{award.organization}</p>
                  <p className="text-xs text-gray-500">{award.year}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Publications */}
        <Card>
          <CardHeader>
            <CardTitle>Publications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {profileData.publications.map((pub, index) => (
                <div key={index} className="border-l-2 border-purple-600 pl-4 py-2">
                  <h4 className="font-medium">{pub.title}</h4>
                  <p className="text-sm text-gray-600">{pub.journal}</p>
                  <p className="text-xs text-gray-500">{pub.year}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Scholarships and Fellowships */}
        <Card>
          <CardHeader>
            <CardTitle>Scholarships and Fellowships</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {profileData.scholarships.map((scholarship, index) => (
                <div key={index} className="border-l-2 border-indigo-600 pl-4 py-2">
                  <h4 className="font-medium">{scholarship.title}</h4>
                  <p className="text-sm text-gray-600">{scholarship.organization}</p>
                  <p className="text-xs text-gray-500">{scholarship.period}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Professional Affiliations */}
        <Card>
          <CardHeader>
            <CardTitle>Professional Affiliations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {profileData.affiliations.map((affiliation, index) => (
                <Badge key={index} variant="outline" className="text-sm">
                  {affiliation}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Skills & Languages */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Skills & Expertise</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {profileData.skills.map((skill, index) => (
                <Badge key={index} variant="secondary" className="px-3 py-1">
                  {skill}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Languages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {profileData.languages.map((language, index) => (
                <Badge key={index} variant="outline" className="px-3 py-1">
                  {language}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Reviews */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Client Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentReviews.map((review) => (
              <div key={review.id} className="border-b pb-4 last:border-b-0">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-medium">{review.client}</p>
                    <p className="text-sm text-gray-600">{review.project}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-1">
                      {renderStars(review.rating)}
                    </div>
                    <p className="text-sm text-gray-500">{review.date}</p>
                  </div>
                </div>
                <p className="text-gray-700 italic">"{review.review}"</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResearchAidsProfileRatings;
