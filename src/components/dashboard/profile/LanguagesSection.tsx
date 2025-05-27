
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, X } from "lucide-react";

interface LanguagesSectionProps {
  languages: string[];
  isEditing: boolean;
  onAdd: () => void;
  onUpdate: (index: number, value: string) => void;
  onRemove: (index: number) => void;
}

const LanguagesSection = ({ 
  languages, 
  isEditing, 
  onAdd, 
  onUpdate, 
  onRemove 
}: LanguagesSectionProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Languages</CardTitle>
          {isEditing && (
            <Button variant="outline" size="sm" onClick={onAdd}>
              <Plus className="h-4 w-4 mr-2" />
              Add Language
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {languages.map((language, index) => (
            <div key={index} className="flex gap-2 items-center">
              <Input
                value={language}
                onChange={(e) => onUpdate(index, e.target.value)}
                disabled={!isEditing}
                placeholder="Language"
                className="flex-1"
              />
              {isEditing && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onRemove(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default LanguagesSection;
