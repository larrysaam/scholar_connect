
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
    'challenge.mediaVisibility': 'Media visibility',
    'about.title': 'About ScholarConnect',
    'about.subtitle': 'Bridging the gap in research guidance to elevate research quality, mentorship, and academic excellence',
    'about.whoWeAre': 'Who We Are',
    'about.description': 'ScholarConnect is a digital platform where researchers, students, and lecturers connect for paid, flexible research and thesis defense consultations.',
    'about.vision': 'Our Vision',
    'about.visionText': 'To become Africa\'s leading academic support platform, empowering every student to conduct impactful research, access expert mentorship, and confidently defend their work in a digitally inclusive environment.',
    'about.mission': 'Our Mission',
    'about.missionText': 'To provide a full-spectrum academic ecosystem that connects students with expert researchers to elevate research quality, mentorship, and academic excellence across the continent.',
    'about.valueProposition': 'Value Proposition',
    'about.valuePropositionText': 'Empowering students to move from research ideation to confident project defense while enabling institutions to digitise and standardise mentorship and evaluation.',
    'about.coreValues': 'Our Core Values',
    'about.access': 'Access',
    'about.accessText': 'We believe every student, regardless of background or location, deserves access to quality academic support.',
    'about.integrity': 'Integrity',
    'about.integrityText': 'We promote honest, ethical academic collaboration and mentorship, upholding academic integrity at every level.',
    'about.excellence': 'Excellence',
    'about.excellenceText': 'We are committed to raising the standard of research and defense across Africa\'s higher education systems.',
    'about.innovation': 'Innovation',
    'about.innovationText': 'We use cutting-edge technology, including AI, to reimagine how students learn, research, and defend their ideas.',
    'about.collaboration': 'Collaboration',
    'about.collaborationText': 'We foster strong partnerships between students, lecturers, and institutions to enhance academic and societal outcomes.',
    'about.empowerment': 'Empowerment',
    'about.empowermentText': 'We empower students to grow intellectually and professionally by building confidence in their research capabilities.'
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
    'challenge.mediaVisibility': 'Visibilité médiatique',
    'about.title': 'À propos de ScholarConnect',
    'about.subtitle': 'Combler le fossé dans l\'orientation de la recherche pour élever la qualité de la recherche, le mentorat et l\'excellence académique',
    'about.whoWeAre': 'Qui nous sommes',
    'about.description': 'ScholarConnect est une plateforme numérique où les chercheurs, étudiants et enseignants se connectent pour des consultations payées et flexibles de recherche et de soutenance de thèse.',
    'about.vision': 'Notre Vision',
    'about.visionText': 'Devenir la principale plateforme de soutien académique en Afrique, permettant à chaque étudiant de mener des recherches d\'impact, d\'accéder au mentorat d\'experts et de défendre son travail avec confiance dans un environnement numérique inclusif.',
    'about.mission': 'Notre Mission',
    'about.missionText': 'Fournir un écosystème académique complet qui connecte les étudiants avec des chercheurs experts pour élever la qualité de la recherche, le mentorat et l\'excellence académique à travers le continent.',
    'about.valueProposition': 'Proposition de valeur',
    'about.valuePropositionText': 'Permettre aux étudiants de passer de l\'idéation de recherche à la défense confiante de projet tout en permettant aux institutions de numériser et de standardiser le mentorat et l\'évaluation.',
    'about.coreValues': 'Nos valeurs fondamentales',
    'about.access': 'Accès',
    'about.accessText': 'Nous croyons que chaque étudiant, indépendamment de son origine ou de sa localisation, mérite l\'accès à un soutien académique de qualité.',
    'about.integrity': 'Intégrité',
    'about.integrityText': 'Nous promouvons une collaboration académique et un mentorat honnêtes et éthiques, maintenant l\'intégrité académique à tous les niveaux.',
    'about.excellence': 'Excellence',
    'about.excellenceText': 'Nous nous engageons à élever le standard de recherche et de défense dans les systèmes d\'enseignement supérieur africains.',
    'about.innovation': 'Innovation',
    'about.innovationText': 'Nous utilisons une technologie de pointe, y compris l\'IA, pour réinventer la façon dont les étudiants apprennent, recherchent et défendent leurs idées.',
    'about.collaboration': 'Collaboration',
    'about.collaborationText': 'Nous favorisons des partenariats solides entre étudiants, enseignants et institutions pour améliorer les résultats académiques et sociétaux.',
    'about.empowerment': 'Autonomisation',
    'about.empowermentText': 'Nous autonomisons les étudiants à croître intellectuellement et professionnellement en renforçant la confiance en leurs capacités de recherche.'
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
