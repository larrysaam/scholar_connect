
import { useToast } from "@/hooks/use-toast";

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

class NotificationService {
  private notifications: Notification[] = [];
  private userSkills: UserSkills = {
    skills: ["Statistical Analysis", "Data Analysis", "Literature Review", "Academic Writing"],
    categories: ["Statistics", "Research", "Agriculture"],
    experience_level: "intermediate"
  };

  // Determine notification priority based on type and urgency
  private determinePriority(type: string, urgency?: string): "high" | "medium" | "low" {
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

  // Generate summary notification with better logic
  generateSummaryNotification(): Notification {
    const jobRequests = this.notifications.filter(n => n.type === "job_request" && n.isNew).length;
    const pendingDeliveries = this.notifications.filter(n => n.type === "delivery_pending" && n.isNew).length;
    
    const summary = [];
    if (jobRequests > 0) summary.push(`${jobRequests} new job request${jobRequests > 1 ? 's' : ''}`);
    if (pendingDeliveries > 0) summary.push(`${pendingDeliveries} pending deliver${pendingDeliveries > 1 ? 'ies' : 'y'}`);
    
    const message = summary.length > 0 
      ? `You have ${summary.join(' and ')}.`
      : "No new notifications at this time.";

    return {
      id: `summary_${Date.now()}`,
      type: "job_request",
      title: "Notification Summary",
      message,
      isNew: true,
      priority: summary.length > 0 ? "medium" : "low",
      timestamp: new Date()
    };
  }

  // Add notification with smart priority assignment
  addNotification(notification: Omit<Notification, 'id' | 'timestamp' | 'priority'>): void {
    const priority = this.determinePriority(notification.type, notification.metadata?.urgency);
    
    const newNotification: Notification = {
      ...notification,
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      priority
    };
    
    this.notifications.unshift(newNotification);
    this.limitNotifications();
  }

  // Generate sample notifications for testing with proper priorities
  generateSampleNotifications(): void {
    // Add 3 job requests (high priority - new opportunities)
    for (let i = 1; i <= 3; i++) {
      this.addNotification({
        type: "job_request",
        title: `New Job Request #${i}`,
        message: `You have received a new job request for statistical analysis project from Client ${i}`,
        isNew: true
      });
    }

    // Add 1 pending delivery (high priority - deadline approaching)
    this.addNotification({
      type: "delivery_pending",
      title: "Delivery Pending",
      message: "Your deliverable for 'Agricultural Data Analysis' project is due in 2 days",
      isNew: true,
      metadata: { urgency: "soon" }
    });
  }

  // Match jobs based on user skills
  findJobMatches(availableJobs: JobMatch[]): JobMatch[] {
    return availableJobs.filter(job => {
      const skillsInDescription = this.userSkills.skills.some(skill => 
        job.description.toLowerCase().includes(skill.toLowerCase()) ||
        job.title.toLowerCase().includes(skill.toLowerCase())
      );
      
      return skillsInDescription;
    }).sort((a, b) => b.skillsMatch - a.skillsMatch);
  }

  // Generate weekly email summary
  generateWeeklyEmailSummary(): {
    subject: string;
    content: string;
    notifications: Notification[];
    jobMatches: JobMatch[];
  } {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    const weeklyNotifications = this.notifications.filter(
      n => n.timestamp >= weekAgo
    );

    // Sample job matches based on user skills
    const potentialJobs: JobMatch[] = [
      {
        jobId: "job_001",
        title: "Statistical Analysis for Agricultural Research",
        description: "Need help with statistical analysis of crop yield data using SPSS",
        skillsMatch: 95,
        client: "Dr. Sarah Johnson",
        budget: "75,000 XAF",
        deadline: "2024-02-15"
      },
      {
        jobId: "job_002", 
        title: "Literature Review on Climate Change Impact",
        description: "Comprehensive literature review on climate change effects on agriculture",
        skillsMatch: 85,
        client: "Prof. Michael Chen",
        budget: "50,000 XAF",
        deadline: "2024-02-20"
      }
    ];

    const matchedJobs = this.findJobMatches(potentialJobs);

    const content = `
      <h2>Your Weekly ScholarConnect Summary</h2>
      
      <h3>📊 Activity Summary</h3>
      <ul>
        <li>Total notifications: ${weeklyNotifications.length}</li>
        <li>New job requests: ${weeklyNotifications.filter(n => n.type === "job_request").length}</li>
        <li>Pending deliveries: ${weeklyNotifications.filter(n => n.type === "delivery_pending").length}</li>
        <li>Messages received: ${weeklyNotifications.filter(n => n.type === "message_received").length}</li>
      </ul>

      <h3>🎯 Jobs Matching Your Skills</h3>
      ${matchedJobs.length > 0 ? `
        <p>We found ${matchedJobs.length} job(s) that match your skills:</p>
        <ul>
          ${matchedJobs.map(job => `
            <li>
              <strong>${job.title}</strong> - ${job.budget}<br>
              Client: ${job.client}<br>
              Deadline: ${job.deadline}<br>
              Match: ${job.skillsMatch}%
            </li>
          `).join('')}
        </ul>
      ` : '<p>No new jobs matching your skills this week.</p>'}

      <h3>🔔 Recent Notifications</h3>
      ${weeklyNotifications.length > 0 ? `
        <ul>
          ${weeklyNotifications.slice(0, 5).map(n => `
            <li>
              <strong>${n.title}</strong><br>
              ${n.message}<br>
              <small>${n.timestamp.toLocaleDateString()}</small>
            </li>
          `).join('')}
        </ul>
      ` : '<p>No new notifications this week.</p>'}

      <p>
        <a href="https://scholarconnect.com/research-aids-dashboard">Visit your dashboard</a> to see all updates and apply for jobs.
      </p>
    `;

    return {
      subject: `Weekly Summary: ${weeklyNotifications.length} updates and ${matchedJobs.length} job matches`,
      content,
      notifications: weeklyNotifications,
      jobMatches: matchedJobs
    };
  }

  // Limit notifications to prevent memory issues
  private limitNotifications(): void {
    if (this.notifications.length > 100) {
      this.notifications = this.notifications.slice(0, 100);
    }
  }

  // Send email notification (mock implementation)
  async sendEmailNotification(
    email: string, 
    subject: string, 
    content: string
  ): Promise<boolean> {
    console.log(`Sending email to ${email}`);
    console.log(`Subject: ${subject}`);
    console.log(`Content: ${content}`);
    
    // Mock successful send
    return true;
  }

  // Schedule weekly email summary
  scheduleWeeklyEmail(userEmail: string): void {
    const summary = this.generateWeeklyEmailSummary();
    
    // In a real implementation, this would be scheduled
    // For now, we'll just log it
    console.log(`Scheduled weekly email for ${userEmail}:`, summary);
    
    // Mock sending the email
    this.sendEmailNotification(userEmail, summary.subject, summary.content);
  }

  // Get notifications
  getNotifications(): Notification[] {
    return this.notifications;
  }

  // Mark notification as read
  markAsRead(notificationId: string): void {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.isNew = false;
    }
  }

  // Get unread count
  getUnreadCount(): number {
    return this.notifications.filter(n => n.isNew).length;
  }
}

// Create singleton instance
export const notificationService = new NotificationService();

// Initialize with sample data for demonstration
notificationService.generateSampleNotifications();

// Schedule weekly email for current user (mock)
notificationService.scheduleWeeklyEmail("neba.emmanuel@example.com");
