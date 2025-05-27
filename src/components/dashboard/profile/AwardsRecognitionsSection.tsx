
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";

interface Award {
  title: string;
  organization: string;
  year: string;
}

interface AwardsRecognitionsSectionProps {
  awards: Award[];
  isEditing: boolean;
  onAdd: () => void;
  onUpdate: (index: number, field: string, value: string) => void;
  onRemove: (index: number) => void;
}

const AwardsRecognitionsSection = ({ 
  awards, 
  isEditing, 
  onAdd, 
  onUpdate, 
  onRemove 
}: AwardsRecognitionsSectionProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Awards and Recognitions</CardTitle>
          {isEditing && (
            <Button variant="outline" size="sm" onClick={onAdd}>
              <Plus className="h-4 w-4 mr-2" />
              Add Award
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {awards.map((award, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-lg">
              <div>
                <Label>Award Title</Label>
                <Input
                  value={award.title}
                  onChange={(e) => onUpdate(index, 'title', e.target.value)}
                  disabled={!isEditing}
                  placeholder="Award name"
                />
              </div>
              <div>
                <Label>Organization</Label>
                <Input
                  value={award.organization}
                  onChange={(e) => onUpdate(index, 'organization', e.target.value)}
                  disabled={!isEditing}
                  placeholder="Awarding organization"
                />
              </div>
              <div>
                <Label>Year</Label>
                <Input
                  value={award.year}
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

export default AwardsRecognitionsSection;
