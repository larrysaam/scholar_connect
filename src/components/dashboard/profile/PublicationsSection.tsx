
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, X } from "lucide-react";

interface Publication {
  title: string;
  journal: string;
  year: string;
}

interface PublicationsSectionProps {
  publications: Publication[];
  isEditing: boolean;
  onAdd: () => void;
  onRemove: (index: number) => void;
  onUpdate: (index: number, field: keyof Publication, value: string) => void;
}

const PublicationsSection = ({ publications, isEditing, onAdd, onRemove, onUpdate }: PublicationsSectionProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Publications</CardTitle>
          {isEditing && (
            <Button size="sm" variant="outline" onClick={onAdd}>
              <Plus className="h-4 w-4 mr-2" />
              Add Publication
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {publications.map((pub, index) => (
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
                <Label>Title</Label>
                <Input
                  value={pub.title}
                  onChange={(e) => onUpdate(index, 'title', e.target.value)}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <Label>Journal</Label>
                <Input
                  value={pub.journal}
                  onChange={(e) => onUpdate(index, 'journal', e.target.value)}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <Label>Year</Label>
                <Input
                  value={pub.year}
                  onChange={(e) => onUpdate(index, 'year', e.target.value)}
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

export default PublicationsSection;
