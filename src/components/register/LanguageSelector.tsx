
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface LanguageSelectorProps {
  availableLanguages: string[];
  selectedLanguages: string[];
  onLanguageToggle: (language: string) => void;
  onRemoveLanguage: (language: string) => void;
}

const LanguageSelector = ({ 
  availableLanguages, 
  selectedLanguages, 
  onLanguageToggle, 
  onRemoveLanguage 
}: LanguageSelectorProps) => {
  return (
    <div className="space-y-2">
      <Label>Preferred Languages *</Label>
      <div className="border rounded-lg p-4 space-y-3">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {availableLanguages.map((language) => (
            <div key={language} className="flex items-center space-x-2">
              <Checkbox 
                id={language}
                checked={selectedLanguages.includes(language)}
                onCheckedChange={() => onLanguageToggle(language)}
              />
              <Label htmlFor={language} className="cursor-pointer text-sm">
                {language}
              </Label>
            </div>
          ))}
        </div>
        {selectedLanguages.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t">
            {selectedLanguages.map((language) => (
              <Badge key={language} variant="secondary" className="flex items-center gap-1">
                {language}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => onRemoveLanguage(language)}
                />
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LanguageSelector;
