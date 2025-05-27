
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Phone, MapPin, Calendar, Briefcase } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ProfileTab = () => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "Dr. John Researcher",
    email: "john.researcher@university.cm",
    phone: "+237 6XX XXX XXX",
    location: "Yaoundé, Cameroon",
    institution: "University of Yaoundé I",
    department: "Computer Science",
    title: "Associate Professor",
    bio: "Specialized in artificial intelligence and machine learning with over 10 years of research experience in healthcare applications.",
    employmentStatus: "actively-employed",
    expertise: ["Machine Learning", "Healthcare AI", "Data Science"],
    hourlyRate: "15000",
    availability: "Available weekdays 9 AM - 5 PM"
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveProfile = () => {
    // Basic validation
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

  const handleAddExpertise = () => {
    const newExpertise = prompt("Enter new expertise area:");
    if (newExpertise && !formData.expertise.includes(newExpertise)) {
      setFormData(prev => ({
        ...prev,
        expertise: [...prev.expertise, newExpertise]
      }));
    }
  };

  const handleRemoveExpertise = (expertiseToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      expertise: prev.expertise.filter(exp => exp !== expertiseToRemove)
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                disabled={!isEditing}
              />
            </div>
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

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Briefcase className="h-5 w-5 mr-2" />
            Professional Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="institution">Institution</Label>
              <Input
                id="institution"
                value={formData.institution}
                onChange={(e) => handleInputChange("institution", e.target.value)}
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                value={formData.department}
                onChange={(e) => handleInputChange("department", e.target.value)}
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label htmlFor="title">Title/Position</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label htmlFor="employment-status">Employment Status</Label>
              <Select 
                value={formData.employmentStatus} 
                onValueChange={(value) => handleInputChange("employmentStatus", value)}
                disabled={!isEditing}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select employment status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="actively-employed">Actively Employed</SelectItem>
                  <SelectItem value="retired">Retired</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="hourly-rate">Hourly Rate (XAF)</Label>
              <Input
                id="hourly-rate"
                type="number"
                value={formData.hourlyRate}
                onChange={(e) => handleInputChange("hourlyRate", e.target.value)}
                disabled={!isEditing}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="bio">Professional Bio</Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => handleInputChange("bio", e.target.value)}
              disabled={!isEditing}
              rows={4}
            />
          </div>

          <div>
            <Label htmlFor="availability">Availability</Label>
            <Input
              id="availability"
              value={formData.availability}
              onChange={(e) => handleInputChange("availability", e.target.value)}
              disabled={!isEditing}
              placeholder="e.g., Available weekdays 9 AM - 5 PM"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Areas of Expertise</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-4">
            {formData.expertise.map((exp, index) => (
              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                {exp}
                {isEditing && (
                  <button
                    onClick={() => handleRemoveExpertise(exp)}
                    className="ml-1 text-red-500 hover:text-red-700"
                  >
                    ×
                  </button>
                )}
              </Badge>
            ))}
          </div>
          {isEditing && (
            <Button variant="outline" onClick={handleAddExpertise}>
              Add Expertise Area
            </Button>
          )}
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
