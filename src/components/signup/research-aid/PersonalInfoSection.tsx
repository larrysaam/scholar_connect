
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface PersonalInfoSectionProps {
  formData: {
    fullName: string;
    sex: string;
    dateOfBirth: string;
    email: string;
    password: string;
    confirmPassword: string;
    phoneNumber: string;
    country: string;
    languages: string[];
  };
  availableLanguages: string[];
  onInputChange: (field: string, value: string | boolean) => void;
  onToggleLanguage: (language: string) => void;
  onRemoveLanguage: (language: string) => void;
}

const PersonalInfoSection = ({
  formData,
  availableLanguages,
  onInputChange,
  onToggleLanguage,
  onRemoveLanguage
}: PersonalInfoSectionProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold border-b pb-2">🔸 Personal Information</h3>
      
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="fullName">Full Name *</Label>
          <Input 
            id="fullName" 
            value={formData.fullName}
            onChange={(e) => onInputChange("fullName", e.target.value)}
            required 
          />
        </div>
        
        <div>
          <Label>Sex *</Label>
          <Select onValueChange={(value) => onInputChange("sex", value)} required>
            <SelectTrigger>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label>Date of Birth *</Label>
        <Input 
          type="date"
          value={formData.dateOfBirth}
          onChange={(e) => onInputChange("dateOfBirth", e.target.value)}
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
            placeholder="your.email@example.com"
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
          <p className="text-xs text-gray-500 mt-1">Optional, but encouraged</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="password">Password *</Label>
          <Input 
            id="password" 
            type="password"
            value={formData.password}
            onChange={(e) => onInputChange("password", e.target.value)}
            required 
          />
          <p className="text-xs text-gray-500 mt-1">With strength meter</p>
        </div>
        
        <div>
          <Label htmlFor="confirmPassword">Confirm Password *</Label>
          <Input 
            id="confirmPassword" 
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => onInputChange("confirmPassword", e.target.value)}
            required 
          />
          <p className="text-xs text-gray-500 mt-1">Must match</p>
        </div>
      </div>

      <div>
        <Label htmlFor="country">Country of Residence *</Label>
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
        <Label>Language(s) Spoken (Select multiple)</Label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
          {availableLanguages.map((language) => (
            <div key={language} className="flex items-center space-x-2">
              <Checkbox
                id={language}
                checked={formData.languages.includes(language)}
                onCheckedChange={() => onToggleLanguage(language)}
              />
              <Label htmlFor={language} className="text-sm">
                {language}
              </Label>
            </div>
          ))}
        </div>
        
        {formData.languages.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {formData.languages.map((language) => (
              <Badge key={language} variant="outline" className="flex items-center space-x-1">
                <span>{language}</span>
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => onRemoveLanguage(language)}
                />
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PersonalInfoSection;
