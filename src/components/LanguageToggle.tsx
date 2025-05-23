
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

const LanguageToggle = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setLanguage(language === 'en' ? 'fr' : 'en')}
      className="text-white hover:bg-blue-700"
    >
      {language === 'en' ? 'FR' : 'EN'}
    </Button>
  );
};

export default LanguageToggle;
