import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Bell, 
  BellOff, 
  Check, 
  CheckCheck, 
  Trash2, 
  Filter, 
  Search, 
  Settings, 
  ExternalLink,
  Loader2, 
  RefreshCw,
  ArrowRight,
  Megaphone
} from "lucide-react";
import { useNotifications } from "@/hooks/useNotifications";
import { formatDistanceToNow } from "date-fns";
import AnnouncementsTab from "@/components/notifications/AnnouncementsTab";

interface NotificationsTabProps {
  setActiveTab: (tab: string) => void;
}

const NotificationsTab = ({ setActiveTab }: NotificationsTabProps) => {
  const {
    notifications,
    preferences,
    loading,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    updatePreferences,
    fetchNotifications,
    createNotification
  } = useNotifications();

  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showPreferences, setShowPreferences] = useState(false);

  // Filter notifications
  const filteredNotifications = notifications.filter(notif => {
    const matchesReadFilter = 
      filter === "all" || 
      (filter === "unread" && !notif.is_read) || 
      (filter === "read" && notif.is_read);
    
    const matchesCategoryFilter = 
      categoryFilter === "all" || notif.category === categoryFilter;
    
    const matchesSearch = 
      searchTerm === "" ||
      notif.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notif.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesReadFilter && matchesCategoryFilter && matchesSearch;
  });

  const handleMarkAsRead = async (id: string) => {
    await markAsRead(id);
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
  };

  const handleDeleteNotification = async (id: string) => {
    await deleteNotification(id);
  };

  const handleUpdatePreferences = async (updates: any) => {
    await updatePreferences(updates);
  };

  const handleRefresh = async () => {
    await fetchNotifications();
  };

  const handleActionClick = (actionUrl: string | null | undefined) => {
    if (!actionUrl) return;

    // Check for external links
    if (actionUrl.startsWith('http')) {
      window.open(actionUrl, '_blank');
      return;
    }

    // Handle internal navigation for tab switching
    try {
      const url = new URL(actionUrl, window.location.origin);
      const tab = url.searchParams.get('tab');

      if (tab) {
        setActiveTab(tab);
      }
    } catch (e) {
      console.error("Could not handle notification action:", e);
    }
  };

  // --- DEMO: Trigger all notification types for this user ---
  const handleTriggerAllNotifications = async () => {
    if (!preferences) return;
    // Use the createNotification function from the hook instance
    if (typeof createNotification !== 'function') return;
    const trigger = async (data: any) => {
      await createNotification(data);
    };
    const now = new Date();
    await trigger({
      title: "New Message Received",
      message: "You have a new message from Dr. Smith.",
      type: "info",
      category: "message",
      action_url: "/dashboard?tab=messages",
      action_label: "View Message"
    });
    await trigger({
      title: "Message Read Receipt",
      message: "Your message to Dr. Smith was read.",
      type: "info",
      category: "message",
      action_url: "/dashboard?tab=messages",
      action_label: "View Conversation"
    });
    await trigger({
        title: "Booking Confirmed",
        message: "Your consultation with Dr. Smith is confirmed for tomorrow.",
        type: "success",
        category: "consultation",
        action_url: "/dashboard?tab=my-bookings",
        action_label: "View Booking"
    });
    await trigger({
        title: "Booking Cancelled",
        message: "Your booking with Dr. Smith was cancelled.",
        type: "warning",
        category: "consultation",
        action_url: "/dashboard?tab=my-bookings",
        action_label: "View Details"
    });
    await trigger({
        title: "Booking Reminder",
        message: "Reminder: You have a consultation scheduled with Dr. Smith in 1 hour.",
        type: "warning",
        category: "consultation",
        action_url: "/dashboard?tab=upcoming",
        action_label: "View Details"
    });
    await trigger({
      title: "Payment Received",
      message: "Payment of $100 received for your consultation.",
      type: "success",
      category: "payment",
      action_url: "/dashboard?tab=payments",
      action_label: "View Payments"
    });
    await trigger({
      title: "Payment Failed/Refunded",
      message: "Payment for your booking failed/refunded.",
      type: "error",
      category: "payment"
    });
    await trigger({
      title: "Job Application Update",
      message: "Your application for Research Assistant has been accepted.",
      type: "success",
      category: "application"
    });
    await trigger({
      title: "Collaboration Invitation",
      message: "Dr. Smith invited you to collaborate on a project.",
      type: "info",
      category: "collaboration"
    });
    await trigger({
      title: "Collaboration Accepted/Declined",
      message: "Dr. Smith accepted your collaboration request.",
      type: "success",
      category: "collaboration"
    });
    await trigger({
      title: "System Announcement",
      message: "Scheduled maintenance on 2025-08-20. Some features may be unavailable.",
      type: "warning",
      category: "system"
    });
    await trigger({
      title: "Profile Approved/Verified",
      message: "Your researcher profile has been approved.",
      type: "success",
      category: "system"
    });
    await trigger({
      title: "Document Uploaded/Reviewed",
      message: "Your uploaded document has been reviewed.",
      type: "info",
      category: "system"
    });
    await trigger({
      title: "Consultation Feedback Received",
      message: "You received feedback for your recent consultation.",
      type: "success",
      category: "consultation"
    });
    await trigger({
      title: "Security Alert",
      message: "New login detected from a new device/location.",
      type: "warning",
      category: "system"
    });
    await trigger({
      title: "Welcome to ResearchTandem!",
      message: "Explore features and connect with others.",
      type: "info",
      category: "system"
    });
  };

  const readCount = notifications.filter(notif => notif.is_read).length;

  const getTypeColor = (type: string) => {
    const colors =    {
      info: "bg-blue-100 text-blue-800",
      success: "bg-green-100 text-green-800",
      warning: "bg-yellow-100 text-yellow-800",
      error: "bg-red-100 text-red-800"
    };
    return colors[type as keyof typeof colors] || colors.info;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        <span className="ml-2 text-gray-500">Loading notifications...</span>
      </div>
    );
  }
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold">Notifications & Announcements</h2>
          <p className="text-gray-600 text-sm sm:text-base">Stay updated with your latest activities and important announcements</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary" className="text-xs">
            {unreadCount} unread
          </Badge>
          <Button onClick={handleRefresh} variant="outline" size="sm" className="text-xs">
            <RefreshCw className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            Refresh
          </Button>
          {/* <Button onClick={handleTriggerAllNotifications} variant="outline" size="sm">
            <Bell className="h-4 w-4 mr-2" />
            Trigger All Notifications
          </Button> */}
          {unreadCount > 0 && (
            <Button onClick={handleMarkAllAsRead} variant="outline" size="sm" className="text-xs">
              <CheckCheck className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Mark all as read</span>
              <span className="sm:hidden">Mark all</span>
            </Button>
          )}
          <Dialog open={showPreferences} onOpenChange={setShowPreferences}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="text-xs">
                <Settings className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                Settings
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Notification Preferences</DialogTitle>
                <DialogDescription>
                  Customize how you receive notifications
                </DialogDescription>
              </DialogHeader>
              {preferences && (
                <div className="space-y-4">
                  <div className="space-y-3">
                    <h4 className="font-medium">Delivery Methods</h4>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="email-notifications">Email Notifications</Label>
                      <Switch
                        id="email-notifications"
                        checked={preferences.email_notifications}
                        onCheckedChange={(checked) => 
                          handleUpdatePreferences({ email_notifications: checked })
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="push-notifications">Push Notifications</Label>
                      <Switch
                        id="push-notifications"
                        checked={preferences.push_notifications}
                        onCheckedChange={(checked) => 
                          handleUpdatePreferences({ push_notifications: checked })
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="sms-notifications">SMS Notifications</Label>
                      <Switch
                        id="sms-notifications"
                        checked={preferences.sms_notifications}
                        onCheckedChange={(checked) => 
                          handleUpdatePreferences({ sms_notifications: checked })
                        }
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-medium">Categories</h4>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="consultation-notifications">Consultations</Label>
                      <Switch
                        id="consultation-notifications"
                        checked={preferences.consultation_notifications}
                        onCheckedChange={(checked) => 
                          handleUpdatePreferences({ consultation_notifications: checked })
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="payment-notifications">Payments</Label>
                      <Switch
                        id="payment-notifications"
                        checked={preferences.payment_notifications}
                        onCheckedChange={(checked) => 
                          handleUpdatePreferences({ payment_notifications: checked })
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="job-notifications">Jobs</Label>
                      <Switch
                        id="job-notifications"
                        checked={preferences.job_notifications}
                        onCheckedChange={(checked) => 
                          handleUpdatePreferences({ job_notifications: checked })
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="collaboration-notifications">Collaborations</Label>
                      <Switch
                        id="collaboration-notifications"
                        checked={preferences.collaboration_notifications}
                        onCheckedChange={(checked) => 
                          handleUpdatePreferences({ collaboration_notifications: checked })
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="message-notifications">Messages</Label>
                      <Switch
                        id="message-notifications"
                        checked={preferences.message_notifications}
                        onCheckedChange={(checked) => 
                          handleUpdatePreferences({ message_notifications: checked })
                        }
                      />
                    </div>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>        </div>
      </div>

      {/* Tabs for Notifications and Announcements */}
      <Tabs defaultValue="notifications" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifications
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-1 h-5 w-5 rounded-full p-0 text-xs">
                {unreadCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="announcements" className="flex items-center gap-2">
            <Megaphone className="h-4 w-4" />
            Announcements
          </TabsTrigger>
        </TabsList>

        <TabsContent value="notifications" className="mt-6">
          {/* Search and Filters */}
      <Card>
        <CardContent className="p-3 sm:p-4 overflow-hidden">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-3 w-3 sm:h-4 sm:w-4" />
                <Input
                  placeholder="Search notifications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 sm:pl-10 text-sm"
                />
              </div>
            </div>
            <div className="w-full sm:w-48">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="text-sm">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="consultation">Consultations</SelectItem>
                  <SelectItem value="payment">Payments</SelectItem>
                  <SelectItem value="job">Jobs</SelectItem>
                  <SelectItem value="application">Applications</SelectItem>
                  <SelectItem value="collaboration">Collaborations</SelectItem>
                  <SelectItem value="message">Messages</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filter buttons */}
      <div className="flex flex-wrap gap-2">
        <Button 
          variant={filter === "all" ? "default" : "outline"} 
          size="sm"
          onClick={() => setFilter("all")}
          className="text-xs"
        >
          All ({notifications.length})
        </Button>
        <Button 
          variant={filter === "unread" ? "default" : "outline"} 
          size="sm"
          onClick={() => setFilter("unread")}
          className="text-xs"
        >
          Unread ({unreadCount})
        </Button>
        <Button 
          variant={filter === "read" ? "default" : "outline"} 
          size="sm"
          onClick={() => setFilter("read")}
          className="text-xs"
        >
          Read ({readCount})
        </Button>
      </div>

      {/* Notifications list */}
      <div className="space-y-3 sm:space-y-4">
        {filteredNotifications.length === 0 ? (
          <Card>
            <CardContent className="text-center py-6 sm:py-8">
              <BellOff className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
              <p className="text-gray-500 text-sm sm:text-base">
                {searchTerm || categoryFilter !== "all" 
                  ? "No notifications match your search criteria"
                  : "No notifications to show"
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredNotifications.map((notification) => (
            <Card 
              key={notification.id} 
              className={`${!notification.is_read ? 'border-l-4 border-l-blue-500 bg-blue-50' : ''} hover:shadow-md transition-shadow`}
            >
              <CardContent className="p-3 sm:p-4 overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-0">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-1 sm:gap-2 mb-2">
                      <h4 className="font-semibold text-sm sm:text-base truncate">{notification.title}</h4>
                      <Badge className={`${getTypeColor(notification.type)} text-xs`}>
                        {notification.type}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {notification.category}
                      </Badge>
                      {!notification.is_read && (
                        <Badge className="bg-blue-600 text-xs">New</Badge>
                      )}
                    </div>
                    <p className="text-gray-700 text-xs sm:text-sm mb-2 break-words">{notification.message}</p>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs text-gray-500">
                      <span>{formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}</span>
                      <span className="hidden sm:inline">{formatDate(notification.created_at)}</span>
                    </div>
                    {notification.action_url && notification.action_label && (
                      <div className="mt-2">
                        <Button
                          size="sm"
                          variant="link"
                          className="p-0 h-auto text-blue-600 font-medium text-xs sm:text-sm"
                          onClick={() => handleActionClick(notification.action_url)}
                        >
                          {notification.action_label}
                          <ArrowRight className="h-3 w-3 ml-1" />
                        </Button>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-1 sm:gap-2 sm:ml-4">
                    {!notification.is_read && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleMarkAsRead(notification.id)}
                        className="text-xs w-full sm:w-auto"
                      >
                        <Check className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                        <span className="hidden sm:inline">Mark as read</span>
                        <span className="sm:hidden">Read</span>
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteNotification(notification.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))        )}
      </div>
        </TabsContent>

        <TabsContent value="announcements" className="mt-6">
          <AnnouncementsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NotificationsTab;
