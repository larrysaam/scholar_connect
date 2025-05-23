
// Mock data for a researcher
export const researcherData = {
  id: "1",
  name: "Dr. Sarah Johnson",
  title: "Associate Professor",
  institution: "Stanford University",
  department: "Computer Science Department",
  field: "Computer Science",
  specialties: ["Machine Learning", "AI Ethics", "Data Mining", "Neural Networks", "Computer Vision"],
  bio: "Dr. Sarah Johnson is an Associate Professor at Stanford University with over 10 years of experience in machine learning research. She leads the AI Ethics Lab, focusing on responsible AI development and algorithmic fairness. Dr. Johnson has published over 50 papers in top journals and conferences, and has worked with leading tech companies on implementing ethical AI frameworks.",
  education: [
    { degree: "Ph.D. Computer Science", institution: "MIT", year: "2010" },
    { degree: "M.S. Computer Science", institution: "Stanford University", year: "2006" },
    { degree: "B.S. Mathematics", institution: "UC Berkeley", year: "2004" }
  ],
  publications: [
    { title: "Ethical Considerations in Deep Learning Models", journal: "Nature Machine Intelligence", year: "2022" },
    { title: "Advances in Fairness-aware Machine Learning", journal: "Journal of Artificial Intelligence Research", year: "2021" },
    { title: "Interpretable AI for Healthcare Applications", journal: "IEEE Transactions on Medical Imaging", year: "2020" }
  ],
  hourlyRate: 120,
  rating: 4.9,
  reviews: [
    { name: "Alex Smith", rating: 5, comment: "Dr. Johnson provided incredibly valuable insights for my research project. Her expertise in AI ethics helped me navigate complex issues I hadn't considered." },
    { name: "Jamie Lee", rating: 5, comment: "Exceptional consultation! Dr. Johnson explained complex concepts clearly and provided practical guidance for implementing machine learning techniques in my project." },
    { name: "Taylor Wong", rating: 4, comment: "Very knowledgeable and patient. Helped me understand the limitations of my research approach and suggested alternative methodologies." },
  ],
  availableTimes: [
    { date: new Date(2025, 5, 22), slots: ["10:00 AM", "1:00 PM", "3:00 PM"] },
    { date: new Date(2025, 5, 24), slots: ["9:00 AM", "11:00 AM", "2:00 PM"] },
    { date: new Date(2025, 5, 25), slots: ["10:00 AM", "4:00 PM"] },
    { date: new Date(2025, 5, 28), slots: ["1:00 PM", "3:00 PM", "5:00 PM"] }
  ],
  imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1376&q=80"
};
