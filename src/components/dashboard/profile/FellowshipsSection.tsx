
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, X } from "lucide-react";

interface Fellowship {
  title: string;
  period: string;
}

interface FellowshipsSectionProps {
  fellowships: Fellowship[];
  isEditing: boolean;
  onAdd: () => void;
  onRemove: (index: number) => void;
  onUpdate: (index: number, field: keyof Fellowship, value: string) => void;
}

const FellowshipsSection = ({ fellowships, isEditing, onAdd, onRemove, onUpdate }: FellowshipsSectionProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Fellowships</CardTitle>
          {isEditing && (
            <Button size="sm" variant="outline" onClick={onAdd}>
              <Plus className="h-4 w-4 mr-2" />
              Add Fellowship
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {fellowships.map((fellowship, index) => (
          <div key={index} className="border rounded-lg p-4">
            {isEditing && (
              <div className="flex justify-end mb-2">
                <Button size="sm" variant="ghost" onClick={() => onRemove(index)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Title</Label>
                <Input
                  value={fellowship.title}
                  onChange={(e) => onUpdate(index, 'title', e.target.value)}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <Label>Period</Label>
                <Input
                  value={fellowship.period}
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

export default FellowshipsSection;
