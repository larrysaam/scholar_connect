import { Notification, JobMatch, WeeklyEmailSummary } from "@/types/notifications";

export class EmailService {
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

  // Send discussion reply notification
  async sendDiscussionReplyNotification(
    postAuthorEmail: string,
    postAuthorName: string,
    postTitle: string,
    replyAuthorName: string,
    replyContent: string,
    postId: string
  ): Promise<boolean> {
    const subject = `New reply to your discussion: "${postTitle}"`;
    
    const content = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">New Reply to Your Discussion</h2>
        
        <p>Hi ${postAuthorName},</p>
        
        <p>Someone has replied to your discussion post on Scholar Consult Connect!</p>
        
        <div style="background-color: #f8fafc; border-left: 4px solid #2563eb; padding: 16px; margin: 20px 0;">
          <h3 style="margin: 0 0 8px 0; color: #1e40af;">Your Post: "${postTitle}"</h3>
          <p style="margin: 0; color: #64748b; font-size: 14px;">
            <strong>${replyAuthorName}</strong> replied:
          </p>
          <p style="margin: 8px 0 0 0; color: #334155;">
            "${replyContent}"
          </p>
        </div>
        
        <div style="margin: 24px 0;">
          <a href="${window.location.origin}/dashboard?tab=discussions&post=${postId}" 
             style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            View Discussion
          </a>
        </div>
        
        <p style="color: #64748b; font-size: 14px; margin-top: 24px;">
          You're receiving this email because someone replied to your discussion post. 
          You can manage your email preferences in your dashboard settings.
        </p>
        
        <hr style="margin: 20px 0; border: none; border-top: 1px solid #e2e8f0;">
        
        <p style="color: #94a3b8; font-size: 12px; text-align: center;">
          Scholar Consult Connect - Connecting Researchers Worldwide
        </p>
      </div>
    `;

    return this.sendEmailNotification(postAuthorEmail, subject, content);
  }

  // Generate weekly email summary
  generateWeeklyEmailSummary(
    weeklyNotifications: Notification[],
    matchedJobs: JobMatch[]
  ): WeeklyEmailSummary {
    const content = `
      <h2>Your Weekly ResearchTandem Summary</h2>
      
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
        <a href="https://ResearchTandem.com/research-aids-dashboard">Visit your dashboard</a> to see all updates and apply for jobs.
      </p>
    `;

    return {
      subject: `Weekly Summary: ${weeklyNotifications.length} updates and ${matchedJobs.length} job matches`,
      content,
      notifications: weeklyNotifications,
      jobMatches: matchedJobs
    };
  }
}
