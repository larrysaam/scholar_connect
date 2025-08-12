
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
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
  RefreshCw
} from "lucide-react";
import { useNotifications } from "@/hooks/useNotifications";
import { formatDistanceToNow } from "date-fns";

const NotificationsTab = () => {
  const {
    notifications,
    preferences,
    loading,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    updatePreferences,
    fetchNotifications
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Notifications</h2>
          <p className="text-gray-600">Stay updated with your latest activities</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">
            {unreadCount} unread
          </Badge>
          <Button onClick={handleRefresh} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          {unreadCount > 0 && (
            <Button onClick={handleMarkAllAsRead} variant="outline" size="sm">
              <CheckCheck className="h-4 w-4 mr-2" />
              Mark all as read
            </Button>
          )}
          <Dialog open={showPreferences} onOpenChange={setShowPreferences}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
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
          </Dialog>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search notifications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-full md:w-48">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
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
      <div className="flex gap-2">
        <Button 
          variant={filter === "all" ? "default" : "outline"} 
          size="sm"
          onClick={() => setFilter("all")}
        >
          All ({notifications.length})
        </Button>
        <Button 
          variant={filter === "unread" ? "default" : "outline"} 
          size="sm"
          onClick={() => setFilter("unread")}
        >
          Unread ({unreadCount})
        </Button>
        <Button 
          variant={filter === "read" ? "default" : "outline"} 
          size="sm"
          onClick={() => setFilter("read")}
        >
          Read ({readCount})
        </Button>
      </div>

      {/* Notifications list */}
      <div className="space-y-4">
        {filteredNotifications.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <BellOff className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">
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
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold">{notification.title}</h4>
                      <Badge className={getTypeColor(notification.type)}>
                        {notification.type}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {notification.category}
                      </Badge>
                      {!notification.is_read && (
                        <Badge className="bg-blue-600">New</Badge>
                      )}
                    </div>
                    <p className="text-gray-700 text-sm mb-2">{notification.message}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>{formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}</span>
                      <span>{formatDate(notification.created_at)}</span>
                    </div>
                    {notification.action_url && notification.action_label && (
                      <div className="mt-2">
                        <Button
                          size="sm"
                          variant="link"
                          className="p-0 h-auto text-blue-600"
                          onClick={() => window.open(notification.action_url, '_blank')}
                        >
                          <ExternalLink className="h-3 w-3 mr-1" />
                          {notification.action_label}
                        </Button>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    {!notification.is_read && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleMarkAsRead(notification.id)}
                      >
                        <Check className="h-4 w-4" />
                        Mark as read
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteNotification(notification.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationsTab;
