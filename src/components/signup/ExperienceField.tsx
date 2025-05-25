
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ExperienceFieldProps {
  formData: any;
  onInputChange: (field: string, value: string) => void;
}

const ExperienceField = ({ formData, onInputChange }: ExperienceFieldProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="experience">Years of Experience *</Label>
      <Select onValueChange={(value) => onInputChange("experience", value)}>
        <SelectTrigger>
          <SelectValue placeholder="Select experience level" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="0-1">0-1 years</SelectItem>
          <SelectItem value="2-5">2-5 years</SelectItem>
          <SelectItem value="6-10">6-10 years</SelectItem>
          <SelectItem value="10+">10+ years</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default ExperienceField;
