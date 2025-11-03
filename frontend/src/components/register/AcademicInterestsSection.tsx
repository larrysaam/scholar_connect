
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface AcademicInterestsSectionProps {
  formData: {
    researchAreas: string[];
    topicTitle: string;
    researchStage: string;
  };
  researchAreaOptions: string[];
  onInputChange: (field: string, value: string) => void;
  onToggleResearchArea: (area: string) => void;
  onRemoveResearchArea: (area: string) => void;
}

const AcademicInterestsSection = ({
  formData,
  researchAreaOptions,
  onInputChange,
  onToggleResearchArea,
  onRemoveResearchArea
}: AcademicInterestsSectionProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold border-b pb-2">🔸 Academic Interests</h3>
      
      <div>
        <Label>Research Area(s) (Select multiple)</Label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2 p-4 border rounded-lg max-h-48 overflow-y-auto">
          {researchAreaOptions.map((area) => (
            <div key={area} className="flex items-center space-x-2">
              <Checkbox
                id={area}
                checked={formData.researchAreas.includes(area)}
                onCheckedChange={() => onToggleResearchArea(area)}
              />
              <Label htmlFor={area} className="text-sm">
                {area}
              </Label>
            </div>
          ))}
        </div>
        
        {formData.researchAreas.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {formData.researchAreas.map((area) => (
              <Badge key={area} variant="secondary" className="flex items-center space-x-1">
                <span>{area}</span>
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => onRemoveResearchArea(area)}
                />
              </Badge>
            ))}
          </div>
        )}
      </div>

      <div>
        <Label htmlFor="topicTitle">Topic or Working Title</Label>
        <Textarea 
          id="topicTitle"
          value={formData.topicTitle}
          onChange={(e) => onInputChange("topicTitle", e.target.value)}
          placeholder="Describe your research topic or working title..."
          className="min-h-[80px]"
        />
        <p className="text-xs text-gray-500 mt-1">Optional, helps personalize offers</p>
      </div>

      <div>
        <Label>Stage of Research</Label>
        <Select onValueChange={(value) => onInputChange("researchStage", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select research stage" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="just-starting">Just starting</SelectItem>
            <SelectItem value="proposal">Proposal</SelectItem>
            <SelectItem value="data-collection">Data collection</SelectItem>
            <SelectItem value="analysis">Analysis</SelectItem>
            <SelectItem value="writing">Writing</SelectItem>
            <SelectItem value="revision">Revision</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default AcademicInterestsSection;
