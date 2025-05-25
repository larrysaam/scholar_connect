
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { Globe } from "lucide-react";

const LanguageToggle = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setLanguage(language === 'en' ? 'fr' : 'en')}
      className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 flex items-center space-x-1"
    >
      <Globe className="h-4 w-4" />
      <span className="font-medium">{language === 'en' ? 'FR' : 'EN'}</span>
    </Button>
  );
};

export default LanguageToggle;
