
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";

interface Supervision {
  level: string;
  count: number;
}

interface StudentSupervisionSummaryProps {
  supervision: Supervision[];
  isEditing: boolean;
  onAdd: () => void;
  onUpdate: (index: number, field: string, value: string | number) => void;
  onRemove: (index: number) => void;
}

const StudentSupervisionSummary = ({ 
  supervision, 
  isEditing, 
  onAdd, 
  onUpdate, 
  onRemove 
}: StudentSupervisionSummaryProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Student Supervision</CardTitle>
          {isEditing && (
            <Button variant="outline" size="sm" onClick={onAdd}>
              <Plus className="h-4 w-4 mr-2" />
              Add Level
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {supervision.map((sup, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg">
              <div>
                <Label>Academic Level</Label>
                <Select
                  value={sup.level}
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
                <Label>Number of Students</Label>
                <Input
                  type="number"
                  value={sup.count}
                  onChange={(e) => onUpdate(index, 'count', parseInt(e.target.value) || 0)}
                  disabled={!isEditing}
                  placeholder="0"
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

export default StudentSupervisionSummary;
