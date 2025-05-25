
export const mockResearcher = {
  id: "1",
  name: "Dr. Sarah Johnson",
  title: "Associate Professor of Computer Science",
  institution: "Stanford University",
  department: "Department of Computer Science",
  field: "Computer Science",
  bio: "Dr. Sarah Johnson is a leading researcher in artificial intelligence and machine learning with over 15 years of experience in academia and industry. Her work focuses on ethical AI development, algorithmic fairness, and the societal impacts of machine learning systems. She has published over 100 peer-reviewed papers and has been recognized with numerous awards for her contributions to the field.",
  specialties: [
    "Machine Learning",
    "Artificial Intelligence",
    "Data Mining",
    "Natural Language Processing",
    "Computer Vision",
    "Algorithmic Ethics",
    "Deep Learning",
    "Neural Networks"
  ],
  hourlyRate: 120,
  rating: 4.9,
  imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1376&q=80",
  onlineStatus: "online" as const,
  verifications: {
    academic: "verified" as const,
    publication: "verified" as const,
    institutional: "verified" as const
  },
  education: [
    {
      degree: "Ph.D. in Computer Science",
      institution: "Massachusetts Institute of Technology",
      year: "2008"
    },
    {
      degree: "M.S. in Computer Science",
      institution: "Stanford University", 
      year: "2004"
    },
    {
      degree: "B.S. in Mathematics and Computer Science",
      institution: "University of California, Berkeley",
      year: "2002"
    }
  ],
  experience: [
    {
      position: "Associate Professor",
      institution: "Stanford University",
      period: "2015 - Present"
    },
    {
      position: "Assistant Professor",
      institution: "Stanford University",
      period: "2010 - 2015"
    },
    {
      position: "Senior Research Scientist",
      institution: "Google Research",
      period: "2008 - 2010"
    }
  ],
  awards: [
    {
      title: "NSF CAREER Award",
      year: "2018"
    },
    {
      title: "IEEE Intelligent Systems AI's 10 to Watch",
      year: "2017"
    },
    {
      title: "MIT Technology Review Innovators Under 35",
      year: "2016"
    }
  ],
  fellowships: [
    {
      title: "ACM Distinguished Scientist",
      period: "2020 - Present"
    },
    {
      title: "IEEE Senior Member",
      period: "2018 - Present"
    }
  ],
  grants: [
    {
      title: "NSF: Ethical AI Framework Development",
      amount: "$1.2M",
      period: "2020 - 2024"
    },
    {
      title: "Google Research Award: Fairness in ML",
      amount: "$150K",
      period: "2019 - 2021"
    }
  ],
  memberships: [
    "Association for Computing Machinery (ACM)",
    "Institute of Electrical and Electronics Engineers (IEEE)",
    "Association for the Advancement of Artificial Intelligence (AAAI)",
    "International Machine Learning Society (IMLS)"
  ],
  supervision: [
    {
      type: "PhD Students",
      count: 8
    },
    {
      type: "Master's Students", 
      count: 15
    },
    {
      type: "Postdocs",
      count: 3
    }
  ],
  publications: [
    {
      title: "Ethical Considerations in Machine Learning: A Comprehensive Framework",
      journal: "Nature Machine Intelligence",
      year: "2023"
    },
    {
      title: "Bias Detection and Mitigation in Deep Learning Models",
      journal: "Journal of Machine Learning Research",
      year: "2023"
    },
    {
      title: "Algorithmic Fairness: From Theory to Practice",
      journal: "Communications of the ACM",
      year: "2022"
    },
    {
      title: "Privacy-Preserving Machine Learning in Healthcare",
      journal: "IEEE Transactions on Biomedical Engineering",
      year: "2022"
    },
    {
      title: "Explainable AI: Methods and Applications",
      journal: "Artificial Intelligence Review",
      year: "2021"
    }
  ],
  reviews: [
    {
      name: "Michael Chen",
      rating: 5,
      comment: "Dr. Johnson provided exceptional guidance on my machine learning project. Her expertise in ethical AI helped me develop a more robust and fair algorithm."
    },
    {
      name: "Emily Rodriguez", 
      rating: 5,
      comment: "Outstanding mentor! Her deep knowledge of natural language processing and patient teaching style made complex concepts easy to understand."
    },
    {
      name: "David Kim",
      rating: 4,
      comment: "Very knowledgeable and professional. The consultation was well-structured and provided valuable insights for my research direction."
    },
    {
      name: "Lisa Wang",
      rating: 5,
      comment: "Dr. Johnson's expertise in computer vision was exactly what I needed. She provided practical advice and pointed me to relevant resources."
    },
    {
      name: "James Thompson",
      rating: 5,
      comment: "Excellent researcher and teacher. Her guidance on my thesis was invaluable, and her feedback was always constructive and detailed."
    }
  ],
  availableTimes: [
    {
      date: new Date("2024-02-15"),
      slots: ["10:00 AM", "2:00 PM", "4:00 PM"]
    },
    {
      date: new Date("2024-02-16"), 
      slots: ["9:00 AM", "11:00 AM", "3:00 PM"]
    },
    {
      date: new Date("2024-02-17"),
      slots: ["1:00 PM", "3:00 PM", "5:00 PM"]
    }
  ]
};
