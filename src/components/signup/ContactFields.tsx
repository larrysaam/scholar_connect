
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface ContactFieldsProps {
  formData: any;
  onInputChange: (field: string, value: string) => void;
}

const ContactFields = ({ formData, onInputChange }: ContactFieldsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email *</Label>
        <Input 
          id="email" 
          type="email" 
          value={formData.email}
          onChange={(e) => onInputChange("email", e.target.value)}
          required 
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number *</Label>
        <Input 
          id="phone" 
          type="tel" 
          value={formData.phone}
          onChange={(e) => onInputChange("phone", e.target.value)}
          required 
        />
      </div>
    </div>
  );
};

export default ContactFields;
