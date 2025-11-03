
export interface Notification {
  id: string;
  type: "job_request" | "delivery_pending" | "payment_received" | "appointment_reminder" | "message_received";
  title: string;
  message: string;
  isNew: boolean;
  priority: "high" | "medium" | "low";
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface UserSkills {
  skills: string[];
  categories: string[];
  experience_level: string;
}

export interface JobMatch {
  jobId: string;
  title: string;
  description: string;
  skillsMatch: number;
  client: string;
  budget: string;
  deadline: string;
}

export interface WeeklyEmailSummary {
  subject: string;
  content: string;
  notifications: Notification[];
  jobMatches: JobMatch[];
}
