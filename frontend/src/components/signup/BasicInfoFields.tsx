
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import type { FormFieldProps } from '@/types/signup';

const BasicInfoFields = ({ formData, onInputChange }: FormFieldProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="firstName">First Name *</Label>
        <Input 
          id="firstName" 
          value={formData.firstName || ''}
          onChange={(e) => onInputChange("firstName", e.target.value)}
          required 
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="lastName">Last Name *</Label>
        <Input 
          id="lastName" 
          value={formData.lastName || ''}
          onChange={(e) => onInputChange("lastName", e.target.value)}
          required 
        />
      </div>
    </div>
  );
};

export default BasicInfoFields;
