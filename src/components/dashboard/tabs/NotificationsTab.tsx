
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, BellOff, Check, CheckCheck, Trash2, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  isRead: boolean;
  createdAt: string;
  category: "consultation" | "payment" | "system" | "collaboration";
}

const NotificationsTab = () => {
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "New Consultation Request",
      message: "You have a new consultation request from Marie Dupont for Machine Learning guidance.",
      type: "info",
      isRead: false,
      createdAt: "2024-06-18T10:30:00Z",
      category: "consultation"
    },
    {
      id: "2",
      title: "Payment Received",
      message: "Payment of 45,000 XAF has been received for your consultation with James Wilson.",
      type: "success",
      isRead: false,
      createdAt: "2024-06-18T09:15:00Z",
      category: "payment"
    },
    {
      id: "3",
      title: "Co-author Invitation",
      message: "Dr. Sarah Johnson has invited you to collaborate on a research project.",
      type: "info",
      isRead: true,
      createdAt: "2024-06-17T16:45:00Z",
      category: "collaboration"
    }
  ]);

  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");

  const markAsRead = (id: string) => {
    setNotifications(prevNotifications => 
      prevNotifications.map(notif => 
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );
    toast({
      title: "Notification marked as read",
      description: "The notification has been marked as read"
    });
  };

  const markAllAsRead = () => {
    setNotifications(prevNotifications => 
      prevNotifications.map(notif => ({ ...notif, isRead: true }))
    );
    toast({
      title: "All notifications marked as read",
      description: "All notifications have been marked as read"
    });
  };

  const deleteNotification = (id: string) => {
    setNotifications(prevNotifications => 
      prevNotifications.filter(notif => notif.id !== id)
    );
    toast({
      title: "Notification deleted",
      description: "The notification has been deleted"
    });
  };

  const filteredNotifications = notifications.filter(notif => {
    if (filter === "unread") return !notif.isRead;
    if (filter === "read") return notif.isRead;
    return true;
  });

  const unreadCount = notifications.filter(notif => !notif.isRead).length;

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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Notifications</h2>
          <p className="text-gray-600">Stay updated with your latest activities</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">
            {unreadCount} unread
          </Badge>
          {unreadCount > 0 && (
            <Button onClick={markAllAsRead} variant="outline" size="sm">
              <CheckCheck className="h-4 w-4 mr-2" />
              Mark all as read
            </Button>
          )}
        </div>
      </div>

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
          Read ({notifications.length - unreadCount})
        </Button>
      </div>

      {/* Notifications list */}
      <div className="space-y-4">
        {filteredNotifications.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <BellOff className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No notifications to show</p>
            </CardContent>
          </Card>
        ) : (
          filteredNotifications.map((notification) => (
            <Card key={notification.id} className={`${!notification.isRead ? 'border-l-4 border-l-blue-500 bg-blue-50' : ''}`}>
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
                      {!notification.isRead && (
                        <Badge className="bg-blue-600">New</Badge>
                      )}
                    </div>
                    <p className="text-gray-700 text-sm mb-2">{notification.message}</p>
                    <p className="text-xs text-gray-500">{formatDate(notification.createdAt)}</p>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    {!notification.isRead && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => markAsRead(notification.id)}
                      >
                        <Check className="h-4 w-4" />
                        Mark as read
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => deleteNotification(notification.id)}
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
