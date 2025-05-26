
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Camera, Save, Plus, X } from "lucide-react";

const ProfileTab = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "Dr. Alex Smith",
    title: "Senior Research Scientist",
    institution: "University of Technology",
    department: "Computer Science Department",
    email: "alex.smith@university.edu",
    phone: "+237 650 123 456",
    bio: "Experienced researcher with over 10 years in artificial intelligence and machine learning. Passionate about advancing the field of computer vision and natural language processing.",
    specialties: ["Artificial Intelligence", "Machine Learning", "Computer Vision"],
    hourlyRate: "15000",
    languages: ["English", "French"],
    experience: [
      { position: "Senior Research Scientist", institution: "University of Technology", period: "2020-Present" }
    ],
    publications: [
      { title: "AI in Modern Computing", journal: "Tech Journal", year: "2023" }
    ],
    awards: [
      { title: "Best Researcher Award", year: "2022" }
    ],
    fellowships: [
      { title: "AI Research Fellowship", period: "2021-2022" }
    ],
    grants: [
      { title: "Research Innovation Grant", amount: "500,000 XAF", period: "2022-2024" }
    ],
    memberships: ["International AI Association", "Computer Science Society"],
    supervision: {
      hnd: "2",
      undergraduate: "5",
      masters: "3",
      phd: "1",
      postdoc: "0"
    }
  });

  const handleSave = () => {
    console.log("Saving profile data:", profileData);
    setIsEditing(false);
  };

  const handleImageUpload = () => {
    console.log("Opening image upload dialog");
  };

  const addArrayItem = (field: string, newItem: any) => {
    setProfileData(prev => ({
      ...prev,
      [field]: [...prev[field as keyof typeof prev] as any[], newItem]
    }));
  };

  const removeArrayItem = (field: string, index: number) => {
    setProfileData(prev => ({
      ...prev,
      [field]: (prev[field as keyof typeof prev] as any[]).filter((_, i) => i !== index)
    }));
  };

  const updateArrayItem = (field: string, index: number, newItem: any) => {
    setProfileData(prev => ({
      ...prev,
      [field]: (prev[field as keyof typeof prev] as any[]).map((item, i) => i === index ? newItem : item)
    }));
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Profile Information</h2>
        <Button
          onClick={() => setIsEditing(!isEditing)}
          variant={isEditing ? "outline" : "default"}
        >
          {isEditing ? "Cancel" : "Edit Profile"}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Image */}
        <div className="md:col-span-1">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="relative inline-block">
                <div className="w-32 h-32 mx-auto rounded-full overflow-hidden bg-gray-200">
                  <img 
                    src="/lovable-uploads/83e0a07d-3527-4693-8172-d7d181156044.png" 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                </div>
                {isEditing && (
                  <Button
                    size="sm"
                    className="absolute -bottom-2 -right-2 rounded-full p-2"
                    onClick={handleImageUpload}
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <h3 className="mt-4 font-semibold">{profileData.name}</h3>
              <p className="text-gray-600">{profileData.title}</p>
            </CardContent>
          </Card>
        </div>

        {/* Profile Details */}
        <div className="md:col-span-2 space-y-6">
          {/* Basic Information */}
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
                    onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={profileData.title}
                    onChange={(e) => setProfileData(prev => ({ ...prev, title: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="institution">Institution</Label>
                  <Input
                    id="institution"
                    value={profileData.institution}
                    onChange={(e) => setProfileData(prev => ({ ...prev, institution: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="department">Department</Label>
                  <Input
                    id="department"
                    value={profileData.department}
                    onChange={(e) => setProfileData(prev => ({ ...prev, department: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={profileData.phone}
                    onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="hourlyRate">Hourly Rate (XAF)</Label>
                  <Input
                    id="hourlyRate"
                    value={profileData.hourlyRate}
                    onChange={(e) => setProfileData(prev => ({ ...prev, hourlyRate: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={profileData.bio}
                  onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
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
            </CardContent>
          </Card>

          {/* Experience Section */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Experience</CardTitle>
                {isEditing && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => addArrayItem('experience', { position: '', institution: '', period: '' })}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Experience
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {profileData.experience.map((exp, index) => (
                <div key={index} className="border rounded-lg p-4">
                  {isEditing && (
                    <div className="flex justify-end mb-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeArrayItem('experience', index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label>Position</Label>
                      <Input
                        value={exp.position}
                        onChange={(e) => updateArrayItem('experience', index, { ...exp, position: e.target.value })}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label>Institution</Label>
                      <Input
                        value={exp.institution}
                        onChange={(e) => updateArrayItem('experience', index, { ...exp, institution: e.target.value })}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label>Period</Label>
                      <Input
                        value={exp.period}
                        onChange={(e) => updateArrayItem('experience', index, { ...exp, period: e.target.value })}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Publications Section */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Publications</CardTitle>
                {isEditing && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => addArrayItem('publications', { title: '', journal: '', year: '' })}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Publication
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {profileData.publications.map((pub, index) => (
                <div key={index} className="border rounded-lg p-4">
                  {isEditing && (
                    <div className="flex justify-end mb-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeArrayItem('publications', index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label>Title</Label>
                      <Input
                        value={pub.title}
                        onChange={(e) => updateArrayItem('publications', index, { ...pub, title: e.target.value })}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label>Journal</Label>
                      <Input
                        value={pub.journal}
                        onChange={(e) => updateArrayItem('publications', index, { ...pub, journal: e.target.value })}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label>Year</Label>
                      <Input
                        value={pub.year}
                        onChange={(e) => updateArrayItem('publications', index, { ...pub, year: e.target.value })}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Awards Section */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Awards</CardTitle>
                {isEditing && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => addArrayItem('awards', { title: '', year: '' })}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Award
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {profileData.awards.map((award, index) => (
                <div key={index} className="border rounded-lg p-4">
                  {isEditing && (
                    <div className="flex justify-end mb-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeArrayItem('awards', index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Title</Label>
                      <Input
                        value={award.title}
                        onChange={(e) => updateArrayItem('awards', index, { ...award, title: e.target.value })}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label>Year</Label>
                      <Input
                        value={award.year}
                        onChange={(e) => updateArrayItem('awards', index, { ...award, year: e.target.value })}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Fellowships Section */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Fellowships</CardTitle>
                {isEditing && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => addArrayItem('fellowships', { title: '', period: '' })}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Fellowship
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {profileData.fellowships.map((fellowship, index) => (
                <div key={index} className="border rounded-lg p-4">
                  {isEditing && (
                    <div className="flex justify-end mb-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeArrayItem('fellowships', index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Title</Label>
                      <Input
                        value={fellowship.title}
                        onChange={(e) => updateArrayItem('fellowships', index, { ...fellowship, title: e.target.value })}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label>Period</Label>
                      <Input
                        value={fellowship.period}
                        onChange={(e) => updateArrayItem('fellowships', index, { ...fellowship, period: e.target.value })}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Research Grants Section */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Research Grants</CardTitle>
                {isEditing && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => addArrayItem('grants', { title: '', amount: '', period: '' })}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Grant
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {profileData.grants.map((grant, index) => (
                <div key={index} className="border rounded-lg p-4">
                  {isEditing && (
                    <div className="flex justify-end mb-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeArrayItem('grants', index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label>Title</Label>
                      <Input
                        value={grant.title}
                        onChange={(e) => updateArrayItem('grants', index, { ...grant, title: e.target.value })}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label>Amount</Label>
                      <Input
                        value={grant.amount}
                        onChange={(e) => updateArrayItem('grants', index, { ...grant, amount: e.target.value })}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label>Period</Label>
                      <Input
                        value={grant.period}
                        onChange={(e) => updateArrayItem('grants', index, { ...grant, period: e.target.value })}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Professional Memberships Section */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Professional Memberships</CardTitle>
                {isEditing && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => addArrayItem('memberships', '')}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Membership
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {profileData.memberships.map((membership, index) => (
                <div key={index} className="flex items-center gap-4">
                  <Input
                    value={membership}
                    onChange={(e) => updateArrayItem('memberships', index, e.target.value)}
                    disabled={!isEditing}
                    className="flex-1"
                  />
                  {isEditing && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeArrayItem('memberships', index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Supervision Section */}
          <Card>
            <CardHeader>
              <CardTitle>Supervision</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div>
                  <Label htmlFor="hnd">HND</Label>
                  <Input
                    id="hnd"
                    type="number"
                    value={profileData.supervision.hnd}
                    onChange={(e) => setProfileData(prev => ({
                      ...prev,
                      supervision: { ...prev.supervision, hnd: e.target.value }
                    }))}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="undergraduate">Undergraduate</Label>
                  <Input
                    id="undergraduate"
                    type="number"
                    value={profileData.supervision.undergraduate}
                    onChange={(e) => setProfileData(prev => ({
                      ...prev,
                      supervision: { ...prev.supervision, undergraduate: e.target.value }
                    }))}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="masters">Master's</Label>
                  <Input
                    id="masters"
                    type="number"
                    value={profileData.supervision.masters}
                    onChange={(e) => setProfileData(prev => ({
                      ...prev,
                      supervision: { ...prev.supervision, masters: e.target.value }
                    }))}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="phd">PhD</Label>
                  <Input
                    id="phd"
                    type="number"
                    value={profileData.supervision.phd}
                    onChange={(e) => setProfileData(prev => ({
                      ...prev,
                      supervision: { ...prev.supervision, phd: e.target.value }
                    }))}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="postdoc">Post Doctorate</Label>
                  <Input
                    id="postdoc"
                    type="number"
                    value={profileData.supervision.postdoc}
                    onChange={(e) => setProfileData(prev => ({
                      ...prev,
                      supervision: { ...prev.supervision, postdoc: e.target.value }
                    }))}
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {isEditing && (
            <div className="flex justify-end">
              <Button onClick={handleSave} className="flex items-center">
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileTab;
