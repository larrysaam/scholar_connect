
export class NotificationPriorityService {
  // Determine notification priority based on type and urgency
  static determinePriority(type: string, urgency?: string): "high" | "medium" | "low" {
    switch (type) {
      case "job_request":
        return "high"; // New opportunities are high priority
      case "delivery_pending":
        return "high"; // Deadlines are critical
      case "payment_received":
        return "medium"; // Important but not urgent
      case "appointment_reminder":
        return urgency === "soon" ? "high" : "medium"; // Time-sensitive
      case "message_received":
        return "medium"; // Communication is important
      default:
        return "low";
    }
  }
}
