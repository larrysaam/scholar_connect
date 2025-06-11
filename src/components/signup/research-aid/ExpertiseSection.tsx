
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface ExpertiseSectionProps {
  formData: {
    expertise: string[];
    otherExpertise: string;
  };
  expertiseAreas: string[];
  onInputChange: (field: string, value: string | boolean) => void;
  onToggleExpertise: (expertise: string) => void;
  onRemoveExpertise: (expertise: string) => void;
}

const ExpertiseSection = ({
  formData,
  expertiseAreas,
  onInputChange,
  onToggleExpertise,
  onRemoveExpertise
}: ExpertiseSectionProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold border-b pb-2">🔸 Area of Expertise</h3>
      
      <div>
        <Label>Select one or more roles:</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
          {expertiseAreas.map((area) => (
            <div key={area} className="flex items-center space-x-2">
              <Checkbox
                id={area}
                checked={formData.expertise.includes(area)}
                onCheckedChange={() => onToggleExpertise(area)}
              />
              <Label htmlFor={area} className="text-sm">
                {area}
              </Label>
            </div>
          ))}
        </div>
        
        <div className="mt-3">
          <Label htmlFor="otherExpertise">Other (specify)</Label>
          <Input 
            id="otherExpertise"
            value={formData.otherExpertise}
            onChange={(e) => onInputChange("otherExpertise", e.target.value)}
            placeholder="Describe other expertise areas"
          />
        </div>
        
        {formData.expertise.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {formData.expertise.map((area) => (
              <Badge key={area} variant="secondary" className="flex items-center space-x-1">
                <span>{area}</span>
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => onRemoveExpertise(area)}
                />
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpertiseSection;
