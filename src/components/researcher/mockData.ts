
export const mockResearcher = {
  id: "1",
  name: "Dr. Sarah Johnson",
  title: "Associate Professor",
  institution: "Stanford University", 
  department: "Computer Science Department",
  field: "Computer Science",
  specialties: ["Machine Learning", "AI Ethics", "Data Mining"],
  hourlyRate: 120,
  rating: 4.9,
  reviews: [
    {
      name: "Alice Chen",
      rating: 5,
      comment: "Dr. Johnson provided excellent guidance on my machine learning project. Her insights were invaluable!"
    },
    {
      name: "John Smith", 
      rating: 5,
      comment: "Amazing session! Really helped me understand the ethical implications of AI in my research."
    },
    {
      name: "Maria Garcia",
      rating: 4,
      comment: "Very knowledgeable and patient. Great help with data mining techniques."
    }
  ],
  imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1376&q=80",
  bio: "Dr. Sarah Johnson is a leading researcher in machine learning and AI ethics with over 15 years of experience in the field. She has published over 50 peer-reviewed papers and has been involved in groundbreaking research on responsible AI development.",
  education: [
    { degree: "Ph.D. in Computer Science", institution: "MIT", year: "2008" },
    { degree: "M.S. in Computer Science", institution: "Stanford University", year: "2004" },
    { degree: "B.S. in Mathematics", institution: "UC Berkeley", year: "2002" }
  ],
  experience: [
    { position: "Associate Professor", institution: "Stanford University", period: "2018 - Present" },
    { position: "Assistant Professor", institution: "Stanford University", period: "2012 - 2018" },
    { position: "Research Scientist", institution: "Google DeepMind", period: "2008 - 2012" }
  ],
  publications: [
    { title: "Ethics in Machine Learning: A Comprehensive Framework", journal: "Nature Machine Intelligence", year: "2023" },
    { title: "Bias Detection in Neural Networks", journal: "Journal of AI Research", year: "2022" },
    { title: "Responsible AI Development Practices", journal: "AI & Society", year: "2021" }
  ],
  availableTimes: [
    {
      date: new Date(2025, 4, 26), // Monday
      slots: ["9:00 AM", "10:00 AM", "2:00 PM", "3:00 PM"]
    },
    {
      date: new Date(2025, 4, 27), // Tuesday
      slots: ["11:00 AM", "1:00 PM", "4:00 PM"]
    },
    {
      date: new Date(2025, 4, 28), // Wednesday
      slots: ["9:00 AM", "10:00 AM", "3:00 PM"]
    },
    {
      date: new Date(2025, 4, 29), // Thursday
      slots: ["10:00 AM", "2:00 PM", "4:00 PM"]
    },
    {
      date: new Date(2025, 4, 30), // Friday
      slots: ["9:00 AM", "11:00 AM", "1:00 PM"]
    },
    {
      date: new Date(2025, 4, 31), // Saturday
      slots: ["10:00 AM", "11:00 AM", "2:00 PM"]
    },
    {
      date: new Date(2025, 5, 1), // Sunday
      slots: ["11:00 AM", "1:00 PM", "3:00 PM"]
    }
  ]
};
