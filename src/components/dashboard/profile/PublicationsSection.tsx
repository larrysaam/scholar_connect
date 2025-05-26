
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, X, ExternalLink } from "lucide-react";

interface Publication {
  title: string;
  journal: string;
  year: string;
  link?: string;
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
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
              <div className="md:col-span-2">
                <Label>Publication Link</Label>
                <div className="flex gap-2">
                  <Input
                    value={pub.link || ''}
                    onChange={(e) => onUpdate(index, 'link', e.target.value)}
                    disabled={!isEditing}
                    placeholder="https://..."
                  />
                  {!isEditing && pub.link && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(pub.link, '_blank')}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default PublicationsSection;
