
// Mock data for upcoming consultations
export const upcomingConsultations = [
  {
    id: "1",
    researcher: {
      id: "1",
      name: "Dr. Sarah Johnson",
      field: "Computer Science",
      imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1376&q=80"
    },
    date: "May 24, 2025",
    time: "10:00 AM - 11:00 AM",
    topic: "Machine Learning Project Review",
    status: "confirmed" as const
  },
  {
    id: "2",
    researcher: {
      id: "2",
      name: "Dr. Michael Chen",
      field: "Physics",
      imageUrl: "https://images.unsplash.com/photo-1601582589907-f92af5ed9db8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1064&q=80"
    },
    date: "May 28, 2025",
    time: "1:00 PM - 2:00 PM",
    topic: "Quantum Computing Research Questions",
    status: "pending" as const
  }
];

// Mock data for past consultations
export const pastConsultations = [
  {
    id: "3",
    researcher: {
      id: "3",
      name: "Dr. Emily Rodriguez",
      field: "Biology",
      imageUrl: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80"
    },
    date: "May 10, 2025",
    time: "3:00 PM - 4:00 PM",
    topic: "Genetics Research Methodology",
    status: "completed" as const,
    notes: "Discussed research methodology for gene editing project. Dr. Rodriguez provided valuable insights on experimental design and recommended several key papers to review."
  },
  {
    id: "4",
    researcher: {
      id: "4",
      name: "Dr. James Wilson",
      field: "Economics",
      imageUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80"
    },
    date: "May 5, 2025",
    time: "11:00 AM - 12:00 PM",
    topic: "Economic Policy Analysis",
    status: "completed" as const,
    notes: "Reviewed data analysis approach for economic policy research. Dr. Wilson suggested alternative statistical methods and provided example code for implementation."
  }
];

// Mock data for payment history
export const paymentHistory = [
  {
    id: "p1",
    date: "May 10, 2025",
    researcher: "Dr. Emily Rodriguez",
    amount: 135,
    status: "completed" as const
  },
  {
    id: "p2",
    date: "May 5, 2025",
    researcher: "Dr. James Wilson",
    amount: 160,
    status: "completed" as const
  },
  {
    id: "p3",
    date: "April 28, 2025",
    researcher: "Dr. Amira Khan",
    amount: 125,
    status: "completed" as const
  }
];
