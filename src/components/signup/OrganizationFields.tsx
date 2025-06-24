
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface OrganizationFieldsProps {
  formData: any;
  onInputChange: (field: string, value: string) => void;
}

const OrganizationFields = ({ formData, onInputChange }: OrganizationFieldsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="organization">Organization *</Label>
        <Input 
          id="organization" 
          value={formData.organization}
          onChange={(e) => onInputChange("organization", e.target.value)}
          required 
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="position">Position *</Label>
        <Input 
          id="position" 
          value={formData.position}
          onChange={(e) => onInputChange("position", e.target.value)}
          required 
        />
      </div>
    </div>
  );
};

export default OrganizationFields;
