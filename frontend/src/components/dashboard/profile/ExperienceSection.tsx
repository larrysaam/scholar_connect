
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, X } from "lucide-react";

interface Experience {
  position: string;
  institution: string;
  period: string;
}

interface ExperienceSectionProps {
  experience: Experience[];
  isEditing: boolean;
  onAdd: () => void;
  onRemove: (index: number) => void;
  onUpdate: (index: number, field: keyof Experience, value: string) => void;
}

const ExperienceSection = ({ experience, isEditing, onAdd, onRemove, onUpdate }: ExperienceSectionProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Experience</CardTitle>
          {isEditing && (
            <Button size="sm" variant="outline" onClick={onAdd}>
              <Plus className="h-4 w-4 mr-2" />
              Add Experience
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {experience.map((exp, index) => (
          <div key={index} className="border rounded-lg p-4">
            {isEditing && (
              <div className="flex justify-end mb-2">
                <Button size="sm" variant="ghost" onClick={() => onRemove(index)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Position</Label>
                <Input
                  value={exp.position}
                  onChange={(e) => onUpdate(index, 'position', e.target.value)}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <Label>Institution</Label>
                <Input
                  value={exp.institution}
                  onChange={(e) => onUpdate(index, 'institution', e.target.value)}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <Label>Period</Label>
                <Input
                  value={exp.period}
                  onChange={(e) => onUpdate(index, 'period', e.target.value)}
                  disabled={!isEditing}
                />
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default ExperienceSection;
