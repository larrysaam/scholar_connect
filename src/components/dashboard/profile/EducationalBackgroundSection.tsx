
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";

interface Education {
  degree: string;
  institution: string;
  year: string;
}

interface EducationalBackgroundSectionProps {
  education: Education[];
  isEditing: boolean;
  onAdd: () => void;
  onUpdate: (index: number, field: string, value: string) => void;
  onRemove: (index: number) => void;
}

const EducationalBackgroundSection = ({ 
  education, 
  isEditing, 
  onAdd, 
  onUpdate, 
  onRemove 
}: EducationalBackgroundSectionProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Educational Background</CardTitle>
          {isEditing && (
            <Button variant="outline" size="sm" onClick={onAdd}>
              <Plus className="h-4 w-4 mr-2" />
              Add Education
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {education.map((edu, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-lg">
              <div>
                <Label>Degree</Label>
                <Input
                  value={edu.degree}
                  onChange={(e) => onUpdate(index, 'degree', e.target.value)}
                  disabled={!isEditing}
                  placeholder="e.g., PhD in Computer Science"
                />
              </div>
              <div>
                <Label>Institution</Label>
                <Input
                  value={edu.institution}
                  onChange={(e) => onUpdate(index, 'institution', e.target.value)}
                  disabled={!isEditing}
                  placeholder="University name"
                />
              </div>
              <div>
                <Label>Year</Label>
                <Input
                  value={edu.year}
                  onChange={(e) => onUpdate(index, 'year', e.target.value)}
                  disabled={!isEditing}
                  placeholder="2023"
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

export default EducationalBackgroundSection;
