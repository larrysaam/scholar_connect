
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, X } from "lucide-react";

interface ProfessionalAffiliationsSectionProps {
  affiliations: string[];
  isEditing: boolean;
  onAdd: () => void;
  onUpdate: (index: number, value: string) => void;
  onRemove: (index: number) => void;
}

const ProfessionalAffiliationsSection = ({ 
  affiliations, 
  isEditing, 
  onAdd, 
  onUpdate, 
  onRemove 
}: ProfessionalAffiliationsSectionProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Professional Affiliations</CardTitle>
          {isEditing && (
            <Button variant="outline" size="sm" onClick={onAdd}>
              <Plus className="h-4 w-4 mr-2" />
              Add Affiliation
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {affiliations.map((affiliation, index) => (
            <div key={index} className="flex gap-2 items-center">
              <Input
                value={affiliation}
                onChange={(e) => onUpdate(index, e.target.value)}
                disabled={!isEditing}
                placeholder="Professional organization"
                className="flex-1"
              />
              {isEditing && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onRemove(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfessionalAffiliationsSection;
