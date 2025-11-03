
export const mockResearcher = {
  id: "123",
  name: "Dr. Marcel Tchinda",
  title: "Professor",
  institution: "University of Dschang",
  department: "Department of Economics",
  field: "Economics",
  specialties: ["Macroeconomics", "Economic Policy", "Development Economics", "International Trade"],
  hourlyRate: 32000,
  rating: 4.9,
  reviews: [
    { id: "1", name: "Jean Mbarga", rating: 5, date: "2023-11-15", comment: "Extremely helpful with my macroeconomic models. Clear explanations and great insights." },
    { id: "2", name: "Yvette Nkolo", rating: 5, date: "2023-10-22", comment: "Dr. Tchinda's expertise in economic policy analysis was invaluable for my research project." },
    { id: "3", name: "Emmanuel Foko", rating: 4, date: "2023-09-30", comment: "Knowledgeable and professional. Would highly recommend for research consultation." }
  ],
  bio: "Professor Marcel Tchinda is a leading expert in macroeconomics and economic policy with over 15 years of teaching and research experience at the University of Dschang. His research focuses on development economics in sub-Saharan Africa, monetary policy, and international trade relations. Dr. Tchinda has published extensively in leading economic journals and has consulted for international organizations on issues related to economic development in Africa.",
  availableTimes: [
    { date: new Date(2023, 11, 10), slots: ["09:00 - 10:00", "11:00 - 12:00", "15:00 - 16:00"] },
    { date: new Date(2023, 11, 12), slots: ["10:00 - 11:00", "14:00 - 15:00"] },
    { date: new Date(2023, 11, 15), slots: ["09:00 - 10:00", "13:00 - 14:00", "16:00 - 17:00"] }
  ],
  education: [
    { degree: "PhD in Economics", institution: "University of Yaoundé II", year: "2010", description: "Dissertation on \"Economic Growth Patterns in Central African States: A Comparative Analysis\"" },
    { degree: "Master's in Economics", institution: "University of Douala", year: "2006", description: "Thesis on Fiscal Policy and Economic Development" },
    { degree: "Bachelor's in Economics", institution: "University of Dschang", year: "2004", description: "Graduated with First Class Honours" }
  ],
  experience: [
    { position: "Professor of Economics", institution: "University of Dschang", period: "2015 - Present", description: "Teaching advanced macroeconomics and economic policy courses at undergraduate and graduate levels. Leading research projects on regional economic development." },
    { position: "Associate Professor", institution: "University of Yaoundé II", period: "2010 - 2015", description: "Taught courses in economics and conducted research on monetary policy in developing economies." },
    { position: "Economic Consultant", institution: "Ministry of Economy and Planning", period: "2008 - 2010", description: "Provided analysis and recommendations on economic policies and development strategies." }
  ],
  publications: [
    { title: "Regional Economic Integration in Central Africa: Challenges and Opportunities", journal: "Journal of African Economies", year: "2022", link: "#" },
    { title: "Fiscal Policy and Economic Growth: Evidence from Cameroon", journal: "African Development Review", year: "2020", link: "#" },
    { title: "Inflation Targeting and Monetary Policy in Developing Economies", journal: "Economic Modelling", year: "2018", link: "#" },
    { title: "Trade Liberalization and Industrial Development in Cameroon", journal: "Journal of International Trade and Economic Development", year: "2016", link: "#" }
  ],
  awards: [
    { name: "Excellence in Economic Research Award", organization: "African Economic Research Consortium", year: "2021", description: "Recognized for outstanding contributions to economic research in Africa" },
    { name: "Distinguished Teaching Award", organization: "University of Dschang", year: "2019", description: "Awarded for exceptional teaching and mentorship" },
    { name: "Best Paper Award", organization: "Central African Economic Association", year: "2017", description: "For the paper on 'Monetary Policy Frameworks in Central African States'" }
  ],
  imageUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
  contactInfo: {
    email: "marcel.tchinda@univ-dschang.cm",
    phone: "+237 699 123 456",
    office: "Faculty of Economics, Block B, Office 203"
  },
  onlineStatus: "online" as const,
  verifications: {
    academic: "verified" as const,
    publication: "verified" as const, 
    institutional: "verified" as const
  },
  trustScore: 95,
  areas: ["Macroeconomic Theory", "Policy Analysis", "Developmental Economics", "International Trade", "Monetary Economics"],
  languages: ["English", "French"]
};

export const mockSchedule = {
  upcomingSessions: [
    {
      id: "s1",
      researcher: "Dr. Marcel Tchinda",
      topic: "Macroeconomic Policy Analysis",
      date: "December 10, 2023",
      time: "09:00 - 10:00",
      status: "confirmed",
      price: 32000,
    },
    {
      id: "s2",
      researcher: "Dr. Fadimatou Bello",
      topic: "Cognitive Psychology Research Methods",
      date: "December 15, 2023",
      time: "14:00 - 15:00",
      status: "pending",
      price: 25000,
    }
  ],
  pastSessions: [
    {
      id: "p1",
      researcher: "Dr. Angeline Nkomo",
      topic: "AI Ethics in Research",
      date: "November 25, 2023",
      time: "10:00 - 11:00",
      status: "completed",
      price: 25000,
    },
    {
      id: "p2",
      researcher: "Dr. Emmanuel Mbarga",
      topic: "Quantum Computing Fundamentals",
      date: "November 18, 2023",
      time: "15:00 - 16:00",
      status: "completed",
      price: 30000,
    },
    {
      id: "p3",
      researcher: "Dr. Solange Ebang",
      topic: "Molecular Biology Techniques",
      date: "November 10, 2023",
      time: "09:00 - 10:00",
      status: "cancelled",
      price: 27000,
    }
  ]
};
