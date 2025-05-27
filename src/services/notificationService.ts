
import { Notification } from "@/types/notifications";
import { NotificationPriorityService } from "./notificationPriorityService";
import { JobMatchingService } from "./jobMatchingService";
import { EmailService } from "./emailService";

class NotificationService {
  private notifications: Notification[] = [];
  private jobMatchingService: JobMatchingService;
  private emailService: EmailService;

  constructor() {
    this.jobMatchingService = new JobMatchingService();
    this.emailService = new EmailService();
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
    const priority = NotificationPriorityService.determinePriority(
      notification.type, 
      notification.metadata?.urgency
    );
    
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

  // Generate weekly email summary
  generateWeeklyEmailSummary() {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    const weeklyNotifications = this.notifications.filter(
      n => n.timestamp >= weekAgo
    );

    const potentialJobs = this.jobMatchingService.getSampleJobs();
    const matchedJobs = this.jobMatchingService.findJobMatches(potentialJobs);

    return this.emailService.generateWeeklyEmailSummary(weeklyNotifications, matchedJobs);
  }

  // Schedule weekly email summary
  scheduleWeeklyEmail(userEmail: string): void {
    const summary = this.generateWeeklyEmailSummary();
    
    // In a real implementation, this would be scheduled
    // For now, we'll just log it
    console.log(`Scheduled weekly email for ${userEmail}:`, summary);
    
    // Mock sending the email
    this.emailService.sendEmailNotification(userEmail, summary.subject, summary.content);
  }

  // Limit notifications to prevent memory issues
  private limitNotifications(): void {
    if (this.notifications.length > 100) {
      this.notifications = this.notifications.slice(0, 100);
    }
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
