import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "lucide-react";

interface PersonalInformationSectionProps {
  formData: {
    title: string;
    subtitle: string;
    department: string;
    years_experience: number;
    students_supervised: number;
    hourly_rate: number;
    response_time: string;
  };
  isEditing: boolean;
  onInputChange: (field: string, value: string | number) => void;
}

const PersonalInformationSection = ({ formData, isEditing, onInputChange }: PersonalInformationSectionProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <User className="h-5 w-5 mr-2" />
          Professional Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* <div>
            <Label htmlFor="title">Title</Label>
            <Select
              value={formData.title}
              onValueChange={(value) => onInputChange("title", value)}
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
          </div> */}
          <div>
            <Label htmlFor="subtitle">Subtitle</Label>
            <Select
              value={formData.subtitle}
              onValueChange={(value) => onInputChange("subtitle", value)}
              disabled={!isEditing}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select subtitle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Dr.">Dr.</SelectItem>
                <SelectItem value="Prof.">Prof.</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="department">Department</Label>
            <Input
              id="department"
              value={formData.department}
              onChange={(e) => onInputChange("department", e.target.value)}
              disabled={!isEditing}
              placeholder="e.g. Computer Science"
            />
          </div>
        </div>
        {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="years_experience">Years of Experience</Label>
            <Input
              id="years_experience"
              type="number"
              value={formData.years_experience}
              onChange={(e) => onInputChange("years_experience", parseInt(e.target.value) || 0)}
              disabled={!isEditing}
              min="0"
            />
          </div>
          <div>
            <Label htmlFor="students_supervised">Students Supervised</Label>
            <Input
              id="students_supervised"
              type="number"
              value={formData.students_supervised}
              onChange={(e) => onInputChange("students_supervised", parseInt(e.target.value) || 0)}
              disabled={!isEditing}
              min="0"
            />
          </div>
          <div>
            <Label htmlFor="hourly_rate">Hourly Rate (XAF)</Label>
            <Input
              id="hourly_rate"
              type="number"
              value={formData.hourly_rate}
              onChange={(e) => onInputChange("hourly_rate", parseFloat(e.target.value) || 0)}
              disabled={!isEditing}
              min="0"
              step="0.01"
            />
          </div>
        </div> */}
        <div className="grid grid-cols-1 gap-4">
          <div>
            <Label htmlFor="response_time">Response Time</Label>
            <Select
              value={formData.response_time}
              onValueChange={(value) => onInputChange("response_time", value)}
              disabled={!isEditing}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select response time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Usually responds within 1 hour">Usually responds within 1 hour</SelectItem>
                <SelectItem value="Usually responds within 24 hours">Usually responds within 24 hours</SelectItem>
                <SelectItem value="Usually responds within 3 days">Usually responds within 3 days</SelectItem>
                <SelectItem value="Usually responds within 1 week">Usually responds within 1 week</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PersonalInformationSection;
