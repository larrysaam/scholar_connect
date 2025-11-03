
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";

interface WorkExperience {
  position: string;
  company: string;
  period: string;
}

interface WorkExperienceSectionProps {
  workExperience: WorkExperience[];
  isEditing: boolean;
  onAdd: () => void;
  onUpdate: (index: number, field: string, value: string) => void;
  onRemove: (index: number) => void;
}

const WorkExperienceSection = ({ 
  workExperience, 
  isEditing, 
  onAdd, 
  onUpdate, 
  onRemove 
}: WorkExperienceSectionProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Work Experience</CardTitle>
          {isEditing && (
            <Button variant="outline" size="sm" onClick={onAdd}>
              <Plus className="h-4 w-4 mr-2" />
              Add Experience
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {workExperience.map((exp, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-lg">
              <div>
                <Label>Position</Label>
                <Input
                  value={exp.position}
                  onChange={(e) => onUpdate(index, 'position', e.target.value)}
                  disabled={!isEditing}
                  placeholder="Job title"
                />
              </div>
              <div>
                <Label>Company/Institution</Label>
                <Input
                  value={exp.company}
                  onChange={(e) => onUpdate(index, 'company', e.target.value)}
                  disabled={!isEditing}
                  placeholder="Company name"
                />
              </div>
              <div>
                <Label>Period</Label>
                <Input
                  value={exp.period}
                  onChange={(e) => onUpdate(index, 'period', e.target.value)}
                  disabled={!isEditing}
                  placeholder="2020-2023"
                />
              </div>
              {isEditing && (
                <div className="flex items-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onRemove(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default WorkExperienceSection;
