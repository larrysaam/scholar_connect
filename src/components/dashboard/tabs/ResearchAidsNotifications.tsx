import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Bell, Calendar, MessageSquare, DollarSign, UserCheck, AlertTriangle, CheckCircle, Video } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ResearchAidsNotifications = () => {
  const [filter, setFilter] = useState("all");
  const [replyText, setReplyText] = useState("");
  const [selectedNotification, setSelectedNotification] = useState<number | null>(null);
  const { toast } = useToast();

  const [notifications, setNotifications] = useState([
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
    
    // Mark notification as read
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, isNew: false } : n)
    );
  };

  const handleJoinMeeting = (meetingLink: string, notificationId: number) => {
    toast({
      title: "Joining Meeting",
      description: "Opening meeting in new window"
    });
    
    // Open meeting link
    window.open(meetingLink, '_blank');
    
    // Mark notification as read
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, isNew: false } : n)
    );
  };

  const handleReply = (clientId: string, notificationId: number) => {
    if (!replyText.trim()) {
      toast({
        title: "Error",
        description: "Please enter a reply message",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Reply Sent",
      description: `Your message has been sent to the client`
    });
    
    setReplyText("");
    setSelectedNotification(null);
    
    // Mark notification as read
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, isNew: false } : n)
    );
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "job_invitation":
        return "bg-blue-100 text-blue-800";
      case "payment_received":
        return "bg-green-100 text-green-800";
      case "appointment_reminder":
        return "bg-purple-100 text-purple-800";
      case "message_received":
        return "bg-yellow-100 text-yellow-800";
      case "project_completed":
        return "bg-emerald-100 text-emerald-800";
      case "deadline_reminder":
        return "bg-red-100 text-red-800";
      case "profile_view":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge className="bg-red-600">High</Badge>;
      case "medium":
        return <Badge className="bg-yellow-600">Medium</Badge>;
      case "low":
        return <Badge variant="secondary">Low</Badge>;
      default:
        return <Badge variant="outline">Normal</Badge>;
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === "all") return true;
    if (filter === "unread") return notification.isNew;
    return notification.type === filter;
  });

  const handleMarkAsRead = (id: number) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, isNew: false } : n)
    );
    toast({
      title: "Marked as Read",
      description: "Notification has been marked as read"
    });
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, isNew: false }))
    );
    toast({
      title: "All Notifications Read",
      description: "All notifications have been marked as read"
    });
  };

  const unreadCount = notifications.filter(n => n.isNew).length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold flex items-center">
            <Bell className="mr-2 h-6 w-6" />
            Notifications
            {unreadCount > 0 && (
              <Badge className="ml-2 bg-red-600">{unreadCount} new</Badge>
            )}
          </h2>
          <p className="text-gray-600">Stay updated with your latest activities</p>
        </div>
        <Button variant="outline" size="sm" onClick={handleMarkAllAsRead}>
          Mark All as Read
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button 
          variant={filter === "all" ? "default" : "outline"} 
          size="sm"
          onClick={() => setFilter("all")}
        >
          All
        </Button>
        <Button 
          variant={filter === "unread" ? "default" : "outline"} 
          size="sm"
          onClick={() => setFilter("unread")}
        >
          Unread ({unreadCount})
        </Button>
        <Button 
          variant={filter === "job_invitation" ? "default" : "outline"} 
          size="sm"
          onClick={() => setFilter("job_invitation")}
        >
          Job Invitations
        </Button>
        <Button 
          variant={filter === "payment_received" ? "default" : "outline"} 
          size="sm"
          onClick={() => setFilter("payment_received")}
        >
          Payments
        </Button>
        <Button 
          variant={filter === "appointment_reminder" ? "default" : "outline"} 
          size="sm"
          onClick={() => setFilter("appointment_reminder")}
        >
          Appointments
        </Button>
        <Button 
          variant={filter === "message_received" ? "default" : "outline"} 
          size="sm"
          onClick={() => setFilter("message_received")}
        >
          Messages
        </Button>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {filteredNotifications.map((notification) => (
          <Card key={notification.id} className={notification.isNew ? "border-blue-200 bg-blue-50" : ""}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  <div className="flex-shrink-0">
                    <notification.icon className="h-5 w-5 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-medium text-gray-900">{notification.title}</h4>
                      {notification.isNew && (
                        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                          New
                        </Badge>
                      )}
                      {getPriorityBadge(notification.priority)}
                      <Badge className={getNotificationColor(notification.type)}>
                        {notification.type.replace("_", " ")}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                    <p className="text-xs text-gray-500">{notification.time}</p>
                  </div>
                </div>
                <div className="flex flex-col space-y-2">
                  {notification.isNew && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleMarkAsRead(notification.id)}
                    >
                      Mark as Read
                    </Button>
                  )}
                  {notification.type === "job_invitation" && notification.jobId && (
                    <Button 
                      size="sm"
                      onClick={() => handleViewJob(notification.jobId!, notification.id)}
                    >
                      View Job
                    </Button>
                  )}
                  {notification.type === "message_received" && notification.clientId && (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          size="sm"
                          onClick={() => setSelectedNotification(notification.id)}
                        >
                          Reply
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Reply to Message</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <p className="text-sm text-gray-600 mb-2">Original message:</p>
                            <p className="text-sm italic border-l-2 border-gray-200 pl-3">{notification.message}</p>
                          </div>
                          <Textarea
                            placeholder="Type your reply..."
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            rows={4}
                          />
                          <div className="flex space-x-2">
                            <Button 
                              onClick={() => handleReply(notification.clientId!, notification.id)}
                              className="flex-1"
                            >
                              Send Reply
                            </Button>
                            <Button variant="outline" className="flex-1">
                              Cancel
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}
                  {notification.type === "appointment_reminder" && notification.meetingLink && (
                    <Button 
                      size="sm"
                      onClick={() => handleJoinMeeting(notification.meetingLink!, notification.id)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Video className="h-4 w-4 mr-1" />
                      Join Meeting
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredNotifications.length === 0 && (
        <div className="text-center py-8">
          <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No notifications found for the selected filter.</p>
        </div>
      )}
    </div>
  );
};

export default ResearchAidsNotifications;
