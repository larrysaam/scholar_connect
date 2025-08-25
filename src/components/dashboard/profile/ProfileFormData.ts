
export interface EducationEntry {
  degree: string;
  institution: string;
  year: string;
}

export interface WorkExperienceEntry {
  position: string;
  company: string;
  period: string;
}

export interface AwardEntry {
  title: string;
  organization: string;
  year: string;
}

export interface PublicationEntry {
  title: string;
  journal: string;
  year: string;
}

export interface ScholarshipEntry {
  title: string;
  organization: string;
  period: string;
}

export interface SupervisionEntry {
  level: string;
  count: number;
}

export interface SupervisionDetailEntry {
  name: string;
  level: string;
  thesisTitle: string;
  year: string;
}

export interface ProfileFormData {
  title: string;
  subtitle: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
  educationalBackground: EducationEntry[];
  workExperience: WorkExperienceEntry[];
  awards: AwardEntry[];
  publications: PublicationEntry[];
  scholarships: ScholarshipEntry[];
  affiliations: string[];
  languages: string[];
  supervision: SupervisionEntry[];
  supervisionDetails: SupervisionDetailEntry[];
}

export const defaultProfileFormData: ProfileFormData = {
  title: "Dr.",
  subtitle: "Dr.",
  name: "John Researcher",
  email: "john.researcher@university.cm",
  phone: "+237 6XX XXX XXX",
  location: "Yaoundé, Cameroon",
  bio: "Specialized in artificial intelligence and machine learning with over 10 years of research experience in healthcare applications.",
  educationalBackground: [
    { degree: "PhD in Computer Science", institution: "University of Yaoundé I", year: "2015" },
    { degree: "MSc in Information Systems", institution: "University of Buea", year: "2010" }
  ],
  workExperience: [
    { position: "Associate Professor", company: "University of Yaoundé I", period: "2018-Present" },
    { position: "Assistant Professor", company: "University of Buea", period: "2015-2018" }
  ],
  awards: [
    { title: "Best Research Paper Award", organization: "IEEE Conference", year: "2023" },
    { title: "Excellence in Teaching Award", organization: "University of Yaoundé I", year: "2022" }
  ],
  publications: [
    { title: "AI in Healthcare: A Comprehensive Review", journal: "Nature AI", year: "2023" },
    { title: "Machine Learning Applications in Medical Diagnosis", journal: "IEEE Transactions", year: "2022" }
  ],
  scholarships: [
    { title: "Government Research Fellowship", organization: "Ministry of Higher Education", period: "2020-2023" },
    { title: "UNESCO Research Grant", organization: "UNESCO", period: "2019-2020" }
  ],
  affiliations: [
    "IEEE Computer Society",
    "Association for Computing Machinery",
    "Cameroon Computer Science Association"
  ],
  languages: ["English", "French", "Spanish"],
  supervision: [
    { level: "PhD", count: 5 },
    { level: "Master's", count: 12 },
    { level: "Undergraduate", count: 25 },
    { level: "Higher National Diploma", count: 8 }
  ],
  supervisionDetails: [
    { name: "Marie Dupont", level: "PhD", thesisTitle: "Machine Learning Applications in Agricultural Prediction", year: "2023" },
    { name: "Paul Ngozi", level: "Master's", thesisTitle: "Data Mining Techniques for Healthcare Analytics", year: "2023" },
    { name: "Sarah Mballa", level: "PhD", thesisTitle: "AI-Driven Climate Change Modeling", year: "2022" }
  ]
};
