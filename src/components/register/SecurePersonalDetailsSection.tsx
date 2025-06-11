
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { sanitizeInput } from "@/utils/security";

interface SecurePersonalDetailsSectionProps {
  formData: any;
  onInputChange: (field: string, value: string) => void;
}

const SecurePersonalDetailsSection = ({ formData, onInputChange }: SecurePersonalDetailsSectionProps) => {
  const handleSecureInputChange = (field: string, value: string) => {
    const sanitizedValue = sanitizeInput(value);
    onInputChange(field, sanitizedValue);
  };

  return (
    <div className="space-y-6">
      <div className="border-b pb-4">
        <h3 className="text-lg font-semibold mb-4">Personal Details</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name *</Label>
            <Input 
              id="fullName"
              type="text"
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={(e) => handleSecureInputChange("fullName", e.target.value)}
              required
              maxLength={100}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address *</Label>
            <Input 
              id="email"
              type="email"
              placeholder="your.email@example.com"
              value={formData.email}
              onChange={(e) => handleSecureInputChange("email", e.target.value)}
              required
              maxLength={254}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Phone Number *</Label>
            <Input 
              id="phoneNumber"
              type="tel"
              placeholder="+1234567890"
              value={formData.phoneNumber}
              onChange={(e) => handleSecureInputChange("phoneNumber", e.target.value)}
              required
              maxLength={20}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="country">Country *</Label>
            <Select value={formData.country} onValueChange={(value) => onInputChange("country", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select your country" />
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
            <Label htmlFor="sex">Gender *</Label>
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

          <div className="space-y-2">
            <Label htmlFor="dateOfBirth">Date of Birth *</Label>
            <Input 
              id="dateOfBirth"
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) => onInputChange("dateOfBirth", e.target.value)}
              required
              max={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="institution">Institution *</Label>
            <Input 
              id="institution"
              type="text"
              placeholder="Your university or institution"
              value={formData.institution}
              onChange={(e) => handleSecureInputChange("institution", e.target.value)}
              required
              maxLength={200}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="faculty">Faculty/Department *</Label>
            <Input 
              id="faculty"
              type="text"
              placeholder="Your faculty or department"
              value={formData.faculty}
              onChange={(e) => handleSecureInputChange("faculty", e.target.value)}
              required
              maxLength={100}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="studyLevel">Study Level *</Label>
            <Select value={formData.studyLevel} onValueChange={(value) => onInputChange("studyLevel", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select your study level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="undergraduate">Undergraduate</SelectItem>
                <SelectItem value="masters">Master's</SelectItem>
                <SelectItem value="phd">PhD</SelectItem>
                <SelectItem value="postdoc">Post-doctoral</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurePersonalDetailsSection;
