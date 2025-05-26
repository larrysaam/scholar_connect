
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Camera, Save } from "lucide-react";

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
    languages: ["English", "French"]
  });

  const handleSave = () => {
    console.log("Saving profile data:", profileData);
    // In a real app, this would save to backend
    setIsEditing(false);
  };

  const handleImageUpload = () => {
    console.log("Opening image upload dialog");
    // In a real app, this would open file picker
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
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Professional Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
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
