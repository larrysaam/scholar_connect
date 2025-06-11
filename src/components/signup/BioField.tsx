
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface BioFieldProps {
  formData: any;
  onInputChange: (field: string, value: string) => void;
}

const BioField = ({ formData, onInputChange }: BioFieldProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="bio">Professional Bio *</Label>
      <Textarea 
        id="bio"
        placeholder="Tell us about your background and expertise..."
        value={formData.bio}
        onChange={(e) => onInputChange("bio", e.target.value)}
        rows={4}
        required
      />
    </div>
  );
};

export default BioField;
