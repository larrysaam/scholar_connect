
import React, { createContext, useContext, useState } from 'react';

type Language = 'en' | 'fr';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    'nav.home': 'Home',
    'nav.researchers': 'Researchers',
    'nav.about': 'About Us',
    'nav.login': 'Login',
    'nav.register': 'Register',
    'hero.title': 'Connecting students with research experts',
    'hero.subtitle': 'Book one-on-one consultations with research experts across various fields. Get personalized guidance for your research projects.',
    'hero.findResearchers': 'Find Researchers',
    'hero.joinAsResearcher': 'Join as a Researcher',
    'booking.title': 'Book a Consultation',
    'booking.selectDate': 'Select a Date:',
    'booking.selectTime': 'Select a Time:',
    'booking.challenge': "What's your challenge? (Select all that apply)",
    'booking.comment': 'Leave a comment:',
    'booking.fee': 'Consultation Fee:',
    'booking.complete': 'Complete Booking',
    'challenge.generateIdea': 'Generate a research idea',
    'challenge.proposalWriting': 'Proposal writing',
    'challenge.literatureReview': 'Literature review',
    'challenge.frameworks': 'Conceptual and theoretical frameworks',
    'challenge.methodology': 'Methodology',
    'challenge.reportWriting': 'Report writing',
    'challenge.documentReview': 'Live document review',
    'challenge.guidance': 'General research guidance',
    'challenge.coAuthor': 'Co-author an article',
    'challenge.expertKnowledge': 'Expert knowledge',
    'challenge.interview': 'Interview a researcher',
    'challenge.mediaVisibility': 'Media visibility'
  },
  fr: {
    'nav.home': 'Accueil',
    'nav.researchers': 'Chercheurs',
    'nav.about': 'À propos',
    'nav.login': 'Connexion',
    'nav.register': "S'inscrire",
    'hero.title': 'Connecter les étudiants avec des experts en recherche',
    'hero.subtitle': 'Réservez des consultations individuelles avec des experts en recherche dans divers domaines. Obtenez des conseils personnalisés pour vos projets de recherche.',
    'hero.findResearchers': 'Trouver des chercheurs',
    'hero.joinAsResearcher': 'Rejoindre en tant que chercheur',
    'booking.title': 'Réserver une consultation',
    'booking.selectDate': 'Sélectionnez une date :',
    'booking.selectTime': 'Sélectionnez une heure :',
    'booking.challenge': 'Quel est votre défi ? (Sélectionnez tous ceux qui s\'appliquent)',
    'booking.comment': 'Laissez un commentaire :',
    'booking.fee': 'Frais de consultation :',
    'booking.complete': 'Finaliser la réservation',
    'challenge.generateIdea': 'Générer une idée de recherche',
    'challenge.proposalWriting': 'Rédaction de proposition',
    'challenge.literatureReview': 'Revue de littérature',
    'challenge.frameworks': 'Cadres conceptuels et théoriques',
    'challenge.methodology': 'Méthodologie',
    'challenge.reportWriting': 'Rédaction de rapport',
    'challenge.documentReview': 'Révision de document en direct',
    'challenge.guidance': 'Conseils généraux de recherche',
    'challenge.coAuthor': 'Co-auteur d\'un article',
    'challenge.expertKnowledge': 'Connaissances d\'expert',
    'challenge.interview': 'Interviewer un chercheur',
    'challenge.mediaVisibility': 'Visibilité médiatique'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
