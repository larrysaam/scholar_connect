
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface OrganizationFieldsProps {
  formData: any;
  onInputChange: (field: string, value: string) => void;
}

const OrganizationFields = ({ formData, onInputChange }: OrganizationFieldsProps) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="country">Country *</Label>
          <Select value={formData.country} onValueChange={(value) => onInputChange("country", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cameroon">Cameroon</SelectItem>
              <SelectItem value="nigeria">Nigeria</SelectItem>
              <SelectItem value="ghana">Ghana</SelectItem>
              <SelectItem value="kenya">Kenya</SelectItem>
              <SelectItem value="south-africa">South Africa</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="institution">Institution/Organization *</Label>
          <Input 
            id="institution" 
            value={formData.institution || formData.organization || ''}
            onChange={(e) => onInputChange("institution", e.target.value)}
            placeholder="Enter your institution or organization"
            required 
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="fieldOfStudy">Field of Study</Label>
          <Input 
            id="fieldOfStudy" 
            value={formData.fieldOfStudy || ''}
            onChange={(e) => onInputChange("fieldOfStudy", e.target.value)}
            placeholder="Enter your field of study"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="sex">Gender</Label>
          <Select value={formData.sex} onValueChange={(value) => onInputChange("sex", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="dateOfBirth">Date of Birth</Label>
        <Input 
          id="dateOfBirth" 
          type="date"
          value={formData.dateOfBirth || ''}
          onChange={(e) => onInputChange("dateOfBirth", e.target.value)}
        />
      </div>
    </div>
  );
};

export default OrganizationFields;
