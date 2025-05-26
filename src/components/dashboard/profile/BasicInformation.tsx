
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
  };
  isEditing: boolean;
  onUpdate: (field: string, value: string) => void;
}

const BasicInformation = ({ profileData, isEditing, onUpdate }: BasicInformationProps) => {
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
          <div>
            <Label htmlFor="hourlyRate">Hourly Rate (XAF)</Label>
            <Input
              id="hourlyRate"
              value={profileData.hourlyRate}
              onChange={(e) => onUpdate('hourlyRate', e.target.value)}
              disabled={!isEditing}
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="bio">Bio</Label>
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
      </CardContent>
    </Card>
  );
};

export default BasicInformation;
