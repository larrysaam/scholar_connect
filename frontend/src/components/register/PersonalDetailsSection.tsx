
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PersonalDetailsSectionProps {
  formData: {
    fullName: string;
    email: string;
    phoneNumber: string;
    country: string;
    institution: string;
    faculty: string;
    studyLevel: string;
    sex: string;
    dateOfBirth: string;
  };
  onInputChange: (field: string, value: string) => void;
}

const PersonalDetailsSection = ({ formData, onInputChange }: PersonalDetailsSectionProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold border-b pb-2">🔸 Personal Details</h3>
      
      <div>
        <Label htmlFor="fullName">Full Name *</Label>
        <Input 
          id="fullName" 
          value={formData.fullName}
          onChange={(e) => onInputChange("fullName", e.target.value)}
          required 
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="email">Email Address *</Label>
          <Input 
            id="email" 
            type="email" 
            value={formData.email}
            onChange={(e) => onInputChange("email", e.target.value)}
            placeholder="your.email@university.edu"
            required 
          />
          <p className="text-xs text-gray-500 mt-1">Required, with verification</p>
        </div>
        
        <div>
          <Label htmlFor="phoneNumber">Phone Number (WhatsApp)</Label>
          <Input 
            id="phoneNumber" 
            type="tel"
            value={formData.phoneNumber}
            onChange={(e) => onInputChange("phoneNumber", e.target.value)}
            placeholder="+237 6XX XXX XXX"
          />
          <p className="text-xs text-gray-500 mt-1">Optional but encouraged for ease</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="country">Country of Study *</Label>
          <Select onValueChange={(value) => onInputChange("country", value)} required>
            <SelectTrigger>
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cameroon">🇨🇲 Cameroon</SelectItem>
              <SelectItem value="nigeria">🇳🇬 Nigeria</SelectItem>
              <SelectItem value="ghana">🇬🇭 Ghana</SelectItem>
              <SelectItem value="kenya">🇰🇪 Kenya</SelectItem>
              <SelectItem value="south-africa">🇿🇦 South Africa</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="institution">Institution Name *</Label>
          <Input 
            id="institution"
            value={formData.institution}
            onChange={(e) => onInputChange("institution", e.target.value)}
            placeholder="University of..."
            required
          />
          <p className="text-xs text-gray-500 mt-1">Typeahead or free input</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="faculty">Faculty / Department</Label>
          <Input 
            id="faculty"
            value={formData.faculty}
            onChange={(e) => onInputChange("faculty", e.target.value)}
            placeholder="e.g., Faculty of Science"
          />
          <p className="text-xs text-gray-500 mt-1">Optional</p>
        </div>
        
        <div>
          <Label>Level of Study *</Label>
          <Select onValueChange={(value) => onInputChange("studyLevel", value)} required>
            <SelectTrigger>
              <SelectValue placeholder="Select level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bachelors">Bachelors</SelectItem>
              <SelectItem value="masters">Masters</SelectItem>
              <SelectItem value="phd">PhD</SelectItem>
              <SelectItem value="postdoc">Post-Doctoral</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label>Sex</Label>
          <Select onValueChange={(value) => onInputChange("sex", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label>Date of Birth</Label>
          <Input 
            type="date"
            value={formData.dateOfBirth}
            onChange={(e) => onInputChange("dateOfBirth", e.target.value)}
          />
          <p className="text-xs text-gray-500 mt-1">Optional, but useful for analytics</p>
        </div>
      </div>
    </div>
  );
};

export default PersonalDetailsSection;
