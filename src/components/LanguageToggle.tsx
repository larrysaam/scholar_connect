
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { Languages } from "lucide-react";

const LanguageToggle = () => {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    const newLanguage = language === 'en' ? 'fr' : 'en';
    setLanguage(newLanguage);
    
    // Store preference in localStorage
    localStorage.setItem('preferred-language', newLanguage);
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 flex items-center space-x-2"
      title={language === 'en' ? 'Switch to French' : 'Passer à l\'anglais'}
    >
      <Languages className="h-4 w-4" />
      <span className="font-medium">
        {language === 'en' ? 'Français' : 'English'}
      </span>
    </Button>
  );
};

export default LanguageToggle;
