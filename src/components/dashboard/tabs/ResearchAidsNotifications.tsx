import { useState } from "react";
import NotificationHeader from "../notifications/NotificationHeader";
import NotificationFilters from "../notifications/NotificationFilters";
import NotificationCard from "../notifications/NotificationCard";
import EmptyNotifications from "../notifications/EmptyNotifications";
import { useNotifications } from "@/hooks/useNotifications";
import { Calendar, MessageSquare, DollarSign, Bell } from "lucide-react";
import { NotificationItem } from "@/types/notificationTypes";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

const getIcon = (type: string) => {
  switch (type) {
    case "job_invitation": return MessageSquare;
    case "payment_received": return DollarSign;
    case "appointment_reminder": return Calendar;
    case "message_received": return MessageSquare;
    default: return Bell;
  }
};

const ResearchAidsNotifications = () => {
  const [filter, setFilter] = useState("all");
  const { user } = useAuth();
  const { toast } = useToast();
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
  } = useNotifications();

  // Filtering logic (real data, as in researcher tab)
  const filteredNotifications = notifications.filter((notif) => {
    if (filter === "all") return true;
    if (filter === "unread") return !notif.is_read;
    if (filter === "read") return notif.is_read;
    if (filter === notif.type || filter === notif.category) return true;
    return false;
  });

  // Map backend notification type/category to NotificationItem type
  const mapToNotificationItemType = (notif: any): NotificationItem["type"] => {
    // Prefer category for mapping, fallback to type
    switch (notif.type) {
      case "info":
      case "success":
      case "warning":
      case "error":
        // Try to map by category
        switch (notif.category) {
          case "job": return "job_invitation";
          case "payment": return "payment_received";
          case "consultation": return "appointment_reminder";
          case "message": return "message_received";
          default: return "message_received";
        }
      case "job_invitation": return "job_invitation";
      case "payment_received": return "payment_received";
      case "appointment_reminder": return "appointment_reminder";
      case "message_received": return "message_received";
      case "project_completed": return "project_completed";
      case "deadline_reminder": return "deadline_reminder";
      case "profile_view": return "profile_view";
      default: return "message_received";
    }
  };

  // Map real notification data to NotificationItem for NotificationCard
  const notificationItems = filteredNotifications.map((notif) => ({
    id: Number(typeof notif.id === 'string' ? notif.id.replace(/\D/g, '') || '0' : notif.id),
    type: mapToNotificationItemType(notif),
    title: notif.title,
    message: notif.message,
    time: new Date(notif.created_at).toLocaleString(),
    isNew: !notif.is_read,
    icon: getIcon(mapToNotificationItemType(notif)),
    priority: 'medium' as const,
    jobId: notif.metadata?.jobId,
    clientId: notif.metadata?.clientId,
    meetingLink: notif.metadata?.meetingLink,
  }));

  // Handler for NotificationCard (number id)
  const handleMarkAsRead = (id: number) => {
    const notif = filteredNotifications.find(n => n.id.replace(/\D/g, '') === String(id));
    if (notif) markAsRead(notif.id);
  };

  // Dummy handlers for job, meeting
  const handleViewJob = () => {};
  const handleJoinMeeting = (meetingLink: string) => { window.open(meetingLink, '_blank'); };

  // Real handler for reply (messaging notification)
  const handleReply = async (clientId: string, notificationId: number, replyText: string) => {
    if (!user || !clientId || !replyText.trim()) {
      toast({ title: 'Error', description: 'Missing user, client, or message', variant: 'destructive' });
      return;
    }
    const { error } = await supabase.from('messages').insert({
      sender_id: user.id,
      recipient_id: clientId,
      content: replyText
    });
    if (error) {
      toast({ title: 'Error', description: 'Failed to send message', variant: 'destructive' });
    } else {
      toast({ title: 'Message Sent', description: 'Your reply was sent successfully.' });
    }
  };

  // --- Messaging and Appointment Notification Support ---
  // The mapping logic already supports both message and appointment notifications:
  // - message: type/category 'message' -> NotificationItem type 'message_received'
  // - appointment: type/category 'consultation' -> NotificationItem type 'appointment_reminder'
  // The NotificationCard will show reply and join meeting actions if the notification has clientId/meetingLink

  return (
    <div className="space-y-6">
      <NotificationHeader 
        unreadCount={unreadCount}
        onMarkAllAsRead={markAllAsRead}
      />
      <NotificationFilters
        filter={filter}
        setFilter={setFilter}
        unreadCount={unreadCount}
      />
      <div className="space-y-4">
        {notificationItems.map((notification) => (
          <NotificationCard
            key={notification.id}
            notification={notification}
            onMarkAsRead={handleMarkAsRead}
            onViewJob={handleViewJob}
            onJoinMeeting={handleJoinMeeting}
            onReply={handleReply}
          />
        ))}
      </div>
      {notificationItems.length === 0 && <EmptyNotifications />}
    </div>
  );
};

export default ResearchAidsNotifications;
