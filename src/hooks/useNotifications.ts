
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { NotificationItem } from "@/types/notificationTypes";
import { Bell, Calendar, MessageSquare, DollarSign, UserCheck, AlertTriangle, CheckCircle } from "lucide-react";

export const useNotifications = () => {
  const { toast } = useToast();

  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 1,
      type: "job_invitation",
      title: "New Job Invitation",
      message: "Dr. Sarah Johnson invited you to apply for 'Advanced Statistical Analysis Project'",
      time: "5 minutes ago",
      isNew: true,
      icon: UserCheck,
      priority: "high",
      jobId: "job_001",
      clientId: "client_001"
    },
    {
      id: 2,
      type: "payment_received",
      title: "Payment Received",
      message: "Payment of 25,000 XAF for 'Literature Review Project' has been processed",
      time: "2 hours ago",
      isNew: true,
      icon: DollarSign,
      priority: "medium"
    },
    {
      id: 3,
      type: "appointment_reminder",
      title: "Appointment Reminder",
      message: "You have a meeting with Prof. Michael Chen in 30 minutes",
      time: "30 minutes",
      isNew: true,
      icon: Calendar,
      priority: "high",
      meetingLink: "https://meet.google.com/abc-defg-hij",
      clientId: "client_002"
    },
    {
      id: 4,
      type: "message_received",
      title: "New Message",
      message: "Dr. Marie Dubois sent you a message about the data collection project",
      time: "1 hour ago",
      isNew: true,
      icon: MessageSquare,
      priority: "medium",
      clientId: "client_003"
    },
    {
      id: 5,
      type: "project_completed",
      title: "Project Completed",
      message: "Your deliverable for 'Statistical Analysis Project' has been approved",
      time: "3 hours ago",
      isNew: false,
      icon: CheckCircle,
      priority: "low"
    },
    {
      id: 6,
      type: "deadline_reminder",
      title: "Deadline Reminder",
      message: "Literature Review project deadline is approaching (Due: Jan 30, 2024)",
      time: "6 hours ago",
      isNew: false,
      icon: AlertTriangle,
      priority: "high"
    },
    {
      id: 7,
      type: "profile_view",
      title: "Profile View",
      message: "5 new researchers viewed your profile today",
      time: "1 day ago",
      isNew: false,
      icon: UserCheck,
      priority: "low"
    }
  ]);

  const handleViewJob = (jobId: string, notificationId: number) => {
    toast({
      title: "Opening Job Details",
      description: `Redirecting to job: ${jobId}`
    });
    
    markAsRead(notificationId);
  };

  const handleJoinMeeting = (meetingLink: string, notificationId: number) => {
    toast({
      title: "Joining Meeting",
      description: "Opening meeting in new window"
    });
    
    window.open(meetingLink, '_blank');
    markAsRead(notificationId);
  };

  const handleReply = (clientId: string, notificationId: number, replyText: string) => {
    toast({
      title: "Reply Sent",
      description: "Your message has been sent to the client"
    });
    
    markAsRead(notificationId);
  };

  const markAsRead = (id: number) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, isNew: false } : n)
    );
    toast({
      title: "Marked as Read",
      description: "Notification has been marked as read"
    });
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, isNew: false }))
    );
    toast({
      title: "All Notifications Read",
      description: "All notifications have been marked as read"
    });
  };

  const getUnreadCount = () => notifications.filter(n => n.isNew).length;

  const getFilteredNotifications = (filter: string) => {
    if (filter === "all") return notifications;
    if (filter === "unread") return notifications.filter(n => n.isNew);
    return notifications.filter(n => n.type === filter);
  };

  return {
    notifications,
    handleViewJob,
    handleJoinMeeting,
    handleReply,
    markAsRead,
    markAllAsRead,
    getUnreadCount,
    getFilteredNotifications
  };
};
