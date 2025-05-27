
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";

interface SupervisionDetail {
  name: string;
  level: string;
  thesisTitle: string;
  year: string;
}

interface StudentSupervisionDetailsProps {
  supervisionDetails: SupervisionDetail[];
  isEditing: boolean;
  onAdd: () => void;
  onUpdate: (index: number, field: string, value: string) => void;
  onRemove: (index: number) => void;
}

const StudentSupervisionDetails = ({ 
  supervisionDetails, 
  isEditing, 
  onAdd, 
  onUpdate, 
  onRemove 
}: StudentSupervisionDetailsProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Details of Student Supervision</CardTitle>
          {isEditing && (
            <Button variant="outline" size="sm" onClick={onAdd}>
              <Plus className="h-4 w-4 mr-2" />
              Add Student
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {supervisionDetails.map((detail, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 border rounded-lg">
              <div>
                <Label>Student Name</Label>
                <Input
                  value={detail.name}
                  onChange={(e) => onUpdate(index, 'name', e.target.value)}
                  disabled={!isEditing}
                  placeholder="Student full name"
                />
              </div>
              <div>
                <Label>Academic Level</Label>
                <Select
                  value={detail.level}
                  onValueChange={(value) => onUpdate(index, 'level', value)}
                  disabled={!isEditing}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Post Doctorate">Post Doctorate</SelectItem>
                    <SelectItem value="PhD">PhD</SelectItem>
                    <SelectItem value="Master's">Master's</SelectItem>
                    <SelectItem value="Undergraduate">Undergraduate</SelectItem>
                    <SelectItem value="Higher National Diploma">Higher National Diploma</SelectItem>
                    <SelectItem value="National Diploma">National Diploma</SelectItem>
                    <SelectItem value="DIPES">DIPES</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Thesis Title</Label>
                <Input
                  value={detail.thesisTitle}
                  onChange={(e) => onUpdate(index, 'thesisTitle', e.target.value)}
                  disabled={!isEditing}
                  placeholder="Research/thesis title"
                />
              </div>
              <div>
                <Label>Year</Label>
                <Input
                  value={detail.year}
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

export default StudentSupervisionDetails;
