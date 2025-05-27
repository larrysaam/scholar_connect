
export interface NotificationItem {
  id: number;
  type: "job_invitation" | "payment_received" | "appointment_reminder" | "message_received" | "project_completed" | "deadline_reminder" | "profile_view";
  title: string;
  message: string;
  time: string;
  isNew: boolean;
  icon: any;
  priority: "high" | "medium" | "low";
  jobId?: string;
  clientId?: string;
  meetingLink?: string;
}

export interface NotificationFilters {
  all: string;
  unread: string;
  job_invitation: string;
  payment_received: string;
  appointment_reminder: string;
  message_received: string;
}
