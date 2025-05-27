
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";

interface Scholarship {
  title: string;
  organization: string;
  period: string;
}

interface ScholarshipsFellowshipsSectionProps {
  scholarships: Scholarship[];
  isEditing: boolean;
  onAdd: () => void;
  onUpdate: (index: number, field: string, value: string) => void;
  onRemove: (index: number) => void;
}

const ScholarshipsFellowshipsSection = ({ 
  scholarships, 
  isEditing, 
  onAdd, 
  onUpdate, 
  onRemove 
}: ScholarshipsFellowshipsSectionProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Scholarships and Fellowships</CardTitle>
          {isEditing && (
            <Button variant="outline" size="sm" onClick={onAdd}>
              <Plus className="h-4 w-4 mr-2" />
              Add Scholarship
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {scholarships.map((scholarship, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-lg">
              <div>
                <Label>Title</Label>
                <Input
                  value={scholarship.title}
                  onChange={(e) => onUpdate(index, 'title', e.target.value)}
                  disabled={!isEditing}
                  placeholder="Scholarship/Fellowship title"
                />
              </div>
              <div>
                <Label>Organization</Label>
                <Input
                  value={scholarship.organization}
                  onChange={(e) => onUpdate(index, 'organization', e.target.value)}
                  disabled={!isEditing}
                  placeholder="Granting organization"
                />
              </div>
              <div>
                <Label>Period</Label>
                <Input
                  value={scholarship.period}
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

export default ScholarshipsFellowshipsSection;
