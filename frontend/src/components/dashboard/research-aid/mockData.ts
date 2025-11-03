
export interface ResearchAid {
  id: string;
  name: string;
  title: string;
  specializations: string[];
  rating: number;
  reviewCount: number;
  hourlyRate: number;
  location: string;
  imageUrl: string;
  completedJobs: number;
  responseTime: string;
  featured: boolean;
}

export const researchAidsData: ResearchAid[] = [
  {
    id: "1",
    name: "Sarah Mballa",
    title: "Statistics & Data Analysis Specialist",
    specializations: ["SPSS", "R Programming", "Survey Analysis"],
    rating: 4.9,
    reviewCount: 127,
    hourlyRate: 8000,
    location: "Cameroon",
    imageUrl: "/lovable-uploads/35d6300d-047f-404d-913c-ec65831f7973.png",
    completedJobs: 89,
    responseTime: "< 2 hours",
    featured: true
  },
  {
    id: "2",
    name: "Jean-Claude Fokou",
    title: "Academic Editor & Translator",
    specializations: ["Academic Writing", "French-English Translation", "APA Style"],
    rating: 4.8,
    reviewCount: 95,
    hourlyRate: 6000,
    location: "Cameroon",
    imageUrl: "/lovable-uploads/35d6300d-047f-404d-913c-ec65831f7973.png",
    completedJobs: 156,
    responseTime: "< 1 hour",
    featured: true
  },
  {
    id: "3",
    name: "Marie Tchounga",
    title: "GIS & Mapping Expert",
    specializations: ["ArcGIS", "QGIS", "Remote Sensing"],
    rating: 4.7,
    reviewCount: 73,
    hourlyRate: 10000,
    location: "Cameroon",
    imageUrl: "/lovable-uploads/35d6300d-047f-404d-913c-ec65831f7973.png",
    completedJobs: 64,
    responseTime: "< 4 hours",
    featured: false
  }
];

export const categories = [
  "Statistics & Data Analysis",
  "Academic Editing",
  "GIS Specialists",
  "Research Assistants",
  "Transcription Services",
  "Translation Services",
  "Literature Review",
  "Data Collection",
  "Report Writing"
];
