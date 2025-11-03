export interface JobApplication {
  id: string;
  jobId: string;
  jobTitle: string;
  studentId: string;
  studentName: string;
  status: "pending" | "approved" | "rejected" | "completed";
  appliedDate: string;
  coverLetter: string;
  file_path?: string; // Added file_path to JobApplication
}

export interface Job {
  id: string;
  title: string;
  description: string;
  budget: string;
  deadline: string;
  // Add other job-related fields as needed
}
