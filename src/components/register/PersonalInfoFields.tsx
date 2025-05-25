
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PersonalInfoFieldsProps {
  formData: any;
  onInputChange: (field: string, value: string) => void;
  countryCodes: Array<{ code: string; country: string }>;
}

const PersonalInfoFields = ({ formData, onInputChange, countryCodes }: PersonalInfoFieldsProps) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">Title *</Label>
          <Select onValueChange={(value) => onInputChange("title", value)} required>
            <SelectTrigger>
              <SelectValue placeholder="Select title" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dr">Dr</SelectItem>
              <SelectItem value="prof">Prof</SelectItem>
              <SelectItem value="mr">Mr</SelectItem>
              <SelectItem value="mrs">Mrs</SelectItem>
              <SelectItem value="miss">Miss</SelectItem>
              <SelectItem value="ms">Ms</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="firstName">First name *</Label>
          <Input 
            id="firstName" 
            value={formData.firstName}
            onChange={(e) => onInputChange("firstName", e.target.value)}
            required 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last name *</Label>
          <Input 
            id="lastName" 
            value={formData.lastName}
            onChange={(e) => onInputChange("lastName", e.target.value)}
            required 
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Sex *</Label>
          <Select onValueChange={(value) => onInputChange("sex", value)} required>
            <SelectTrigger>
              <SelectValue placeholder="Select sex" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="contact">Contact *</Label>
          <div className="flex">
            <Select onValueChange={(value) => onInputChange("countryCode", value)} required>
              <SelectTrigger className="w-1/3">
                <SelectValue placeholder="Code" />
              </SelectTrigger>
              <SelectContent className="max-h-[200px] overflow-y-auto">
                {countryCodes.map((item) => (
                  <SelectItem key={item.code} value={item.code}>
                    {item.code} {item.country}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input 
              id="contact" 
              type="tel" 
              placeholder="XXX XXX XXX"
              value={formData.contact}
              onChange={(e) => onInputChange("contact", e.target.value)}
              className="ml-2 flex-1"
              required 
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default PersonalInfoFields;
