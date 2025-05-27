
export interface Job {
  id: string;
  title: string;
  description: string;
  category: string;
  budget: number;
  duration: string;
  postedBy: string;
  postedDate: string;
  deadline: string;
  location: string;
  urgency: "low" | "medium" | "high";
  status: "open" | "in_progress" | "completed";
  skills: string[];
  applicants: number;
}

export const jobs: Job[] = [
  {
    id: "1",
    title: "Statistical Analysis for Climate Change Research",
    description: "Need help with SPSS analysis of climate data collected over 5 years. Require correlation analysis, regression modeling, and interpretation of results for my PhD thesis.",
    category: "Statistics",
    budget: 75000,
    duration: "2 weeks",
    postedBy: "Dr. Amina Kone",
    postedDate: "2024-01-15",
    deadline: "2024-02-01",
    location: "Remote",
    urgency: "high",
    status: "open",
    skills: ["SPSS", "Regression Analysis", "Climate Data", "Statistical Modeling"],
    applicants: 8
  },
  {
    id: "2",
    title: "GIS Mapping for Urban Planning Study",
    description: "Create detailed maps showing urban development patterns in Yaoundé. Need spatial analysis and visualization using ArcGIS or QGIS.",
    category: "GIS",
    budget: 120000,
    duration: "3 weeks",
    postedBy: "Prof. Jean Baptiste",
    postedDate: "2024-01-14",
    deadline: "2024-02-15",
    location: "Cameroon",
    urgency: "medium",
    status: "open",
    skills: ["ArcGIS", "QGIS", "Urban Planning", "Spatial Analysis"],
    applicants: 12
  },
  {
    id: "3",
    title: "Academic Editing for Journal Submission",
    description: "Need professional editing for a 8,000-word research paper on renewable energy. Paper is ready for submission to an international journal.",
    category: "Editing",
    budget: 45000,
    duration: "1 week",
    postedBy: "Dr. Sarah Mbeki",
    postedDate: "2024-01-13",
    deadline: "2024-01-25",
    location: "Remote",
    urgency: "high",
    status: "open",
    skills: ["Academic Editing", "Journal Standards", "Technical Writing", "Renewable Energy"],
    applicants: 15
  },
  {
    id: "4",
    title: "Survey Design and Data Collection",
    description: "Design a comprehensive survey for agricultural research and collect data from 200 farmers across 3 regions. Include questionnaire design and field data collection.",
    category: "Research Assistance",
    budget: 200000,
    duration: "6 weeks",
    postedBy: "Prof. Emmanuel Talla",
    postedDate: "2024-01-12",
    deadline: "2024-03-01",
    location: "Multi-region",
    urgency: "medium",
    status: "open",
    skills: ["Survey Design", "Data Collection", "Agricultural Research", "Field Work"],
    applicants: 6
  },
  {
    id: "5",
    title: "Interview Transcription - Qualitative Research",
    description: "Transcribe 15 hours of interviews in French and English. Interviews are about healthcare access in rural areas. Need verbatim transcription with timestamps.",
    category: "Transcription",
    budget: 60000,
    duration: "10 days",
    postedBy: "Dr. Grace Nyong",
    postedDate: "2024-01-11",
    deadline: "2024-01-30",
    location: "Remote",
    urgency: "medium",
    status: "open",
    skills: ["Transcription", "French", "English", "Healthcare Research"],
    applicants: 9
  },
  {
    id: "6",
    title: "Research Poster Design for Conference",
    description: "Create a professional research poster for presentation at the African Development Conference. Need compelling visual design with charts and infographics.",
    category: "Design",
    budget: 35000,
    duration: "5 days",
    postedBy: "Dr. Paul Biya",
    postedDate: "2024-01-10",
    deadline: "2024-01-22",
    location: "Remote",
    urgency: "high",
    status: "open",
    skills: ["Poster Design", "Infographics", "Academic Presentation", "Visual Design"],
    applicants: 11
  }
];
