
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";

interface Publication {
  title: string;
  journal: string;
  year: string;
}

interface PublicationsSectionProfileProps {
  publications: Publication[];
  isEditing: boolean;
  onAdd: () => void;
  onUpdate: (index: number, field: string, value: string) => void;
  onRemove: (index: number) => void;
}

const PublicationsSectionProfile = ({ 
  publications, 
  isEditing, 
  onAdd, 
  onUpdate, 
  onRemove 
}: PublicationsSectionProfileProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Publications</CardTitle>
          {isEditing && (
            <Button variant="outline" size="sm" onClick={onAdd}>
              <Plus className="h-4 w-4 mr-2" />
              Add Publication
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {publications.map((pub, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-lg">
              <div>
                <Label>Title</Label>
                <Input
                  value={pub.title}
                  onChange={(e) => onUpdate(index, 'title', e.target.value)}
                  disabled={!isEditing}
                  placeholder="Publication title"
                />
              </div>
              <div>
                <Label>Journal/Conference</Label>
                <Input
                  value={pub.journal}
                  onChange={(e) => onUpdate(index, 'journal', e.target.value)}
                  disabled={!isEditing}
                  placeholder="Journal name"
                />
              </div>
              <div>
                <Label>Year</Label>
                <Input
                  value={pub.year}
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

export default PublicationsSectionProfile;
