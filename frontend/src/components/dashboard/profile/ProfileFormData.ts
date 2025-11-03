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

export interface FellowshipEntry {
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
  department: string;
  years_experience: number;
  students_supervised: number;
  hourly_rate: number;
  response_time: string;
  bio: string;
  research_interests: string[];
  specialties: string[];
  education: EducationEntry[];
  experience: WorkExperienceEntry[];
  publications: PublicationEntry[];
  awards: AwardEntry[];
  fellowships: FellowshipEntry[];
  memberships: string[];
  supervision: SupervisionEntry[];
  supervisionDetails: SupervisionDetailEntry[];
}

export const defaultProfileFormData: ProfileFormData = {
  title: "Dr.",
  subtitle: "Dr.",
  department: "Computer Science",
  years_experience: 10,
  students_supervised: 25,
  hourly_rate: 50,
  response_time: "Usually responds within 24 hours",
  bio: "Specialized in artificial intelligence and machine learning with over 10 years of research experience in healthcare applications.",
  research_interests: ["Artificial Intelligence", "Machine Learning", "Healthcare Analytics"],
  specialties: ["Data Mining", "Neural Networks", "Computer Vision"],
  education: [
    { degree: "PhD in Computer Science", institution: "University of Yaoundé I", year: "2015" },
    { degree: "MSc in Information Systems", institution: "University of Buea", year: "2010" }
  ],
  experience: [
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
  fellowships: [
    { title: "Government Research Fellowship", organization: "Ministry of Higher Education", period: "2020-2023" },
    { title: "UNESCO Research Grant", organization: "UNESCO", period: "2019-2020" }
  ],
  memberships: [
    "IEEE Computer Society",
    "Association for Computing Machinery",
    "Cameroon Computer Science Association"
  ],
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
