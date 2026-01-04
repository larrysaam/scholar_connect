
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { Globe, Loader2 } from "lucide-react";

const LanguageToggle = () => {
  const { language, setLanguage, isTranslating } = useLanguage();

  const handleToggle = () => {
    setLanguage(language === 'en' ? 'fr' : 'en');
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleToggle}
      disabled={isTranslating}
      className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 flex items-center space-x-1"
    >
      {isTranslating ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Globe className="h-4 w-4" />
      )}
      <span className="font-medium">{language === 'en' ? 'FR' : 'EN'}</span>
    </Button>
  );
};

export default LanguageToggle;
