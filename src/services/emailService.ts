
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

  // Generate weekly email summary
  generateWeeklyEmailSummary(
    weeklyNotifications: Notification[],
    matchedJobs: JobMatch[]
  ): WeeklyEmailSummary {
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
}
