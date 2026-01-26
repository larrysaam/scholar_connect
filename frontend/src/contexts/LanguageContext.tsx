
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { translations } from '@/contexts/translations';
import { googleTranslate } from '@/services/googleTranslate';

export type Language = 'en' | 'fr';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isTranslating: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  // Initialize with language from Google Translate cookie
  const [language, setLanguage] = useState<Language>(() => {
    return googleTranslate.getCurrentLanguage();
  });
  const [isTranslating, setIsTranslating] = useState(false);
  // Initialize Google Translate on mount
  useEffect(() => {
    googleTranslate.initialize(() => {
      console.log('Google Translate initialized');
      // Hide the Google Translate widget and protect brand names
      const style = document.createElement('style');
      style.innerHTML = `
        #google_translate_element {
          display: none !important;
        }
        .goog-te-banner-frame {
          display: none !important;
        }
        .goog-te-balloon-frame {
          display: none !important;
        }
        body {
          top: 0 !important;
        }
        .skiptranslate {
          display: none !important;
        }
        .goog-logo-link {
          display: none !important;
        }
        .goog-te-gadget {
          display: none !important;
        }
        /* Protect brand names from translation */
        .notranslate,
        .notranslate * {
          translate: no !important;
        }
      `;
      document.head.appendChild(style);
    });

    // Cleanup function
    return () => {
      googleTranslate.cleanup();
    };
  }, []);

  // Handle language change
  useEffect(() => {
    const currentGoogleLang = googleTranslate.getCurrentLanguage();
    
    // Only change if different from current Google Translate language
    if (language !== currentGoogleLang) {
      setIsTranslating(true);
      
      // Change Google Translate language
      googleTranslate.changeLanguage(language);
      
      // Reset translating state after delay
      setTimeout(() => {
        setIsTranslating(false);
      }, 2000);
    }
  }, [language]);

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations[language];
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        // Fallback to English if key not found in current language
        value = translations.en;
        for (const fallbackKey of keys) {
          if (value && typeof value === 'object' && fallbackKey in value) {
            value = value[fallbackKey];
          } else {
            return key; // Return key if not found anywhere
          }
        }
        break;
      }
    }
    
    return typeof value === 'string' ? value : key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isTranslating }}>
      {/* Hidden Google Translate Element */}
      <div id="google_translate_element" style={{ display: 'none' }}></div>
      {children}
    </LanguageContext.Provider>
  );
};
