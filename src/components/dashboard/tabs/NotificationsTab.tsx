
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, Calendar, MessageSquare, UserCheck, BookOpen, AlertTriangle } from "lucide-react";

const NotificationsTab = () => {
  const notifications = [
    {
      id: "1",
      type: "consultation_request",
      title: "New Consultation Request",
      message: "Sarah Johnson has requested a consultation on AI in Healthcare",
      time: "5 minutes ago",
      isNew: true,
      icon: Calendar
    },
    {
      id: "2", 
      type: "co_author_invitation",
      title: "Co-authorship Response",
      message: "Dr. Michael Brown accepted your co-authorship invitation",
      time: "2 hours ago",
      isNew: true,
      icon: UserCheck
    },
    {
      id: "3",
      type: "quality_feedback",
      title: "Quality Feedback Received", 
      message: "New feedback from your consultation with Alex Wilson",
      time: "1 day ago",
      isNew: false,
      icon: MessageSquare
    },
    {
      id: "4",
      type: "verification",
      title: "Verification Update",
      message: "Your publication verification has been approved",
      time: "2 days ago", 
      isNew: false,
      icon: BookOpen
    },
    {
      id: "5",
      type: "system",
      title: "System Maintenance",
      message: "Platform maintenance scheduled for this weekend",
      time: "3 days ago",
      isNew: false,
      icon: AlertTriangle
    }
  ];

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "consultation_request":
        return "bg-blue-100 text-blue-800";
      case "co_author_invitation":
        return "bg-green-100 text-green-800";
      case "quality_feedback":
        return "bg-purple-100 text-purple-800";
      case "verification":
        return "bg-yellow-100 text-yellow-800";
      case "system":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleMarkAsRead = (id: string) => {
    console.log("Marking notification as read:", id);
    // In a real app, this would update the notification status
  };

  const handleMarkAllAsRead = () => {
    console.log("Marking all notifications as read");
    // In a real app, this would update all notification statuses
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold flex items-center">
          <Bell className="mr-2 h-5 w-5" />
          Notifications
        </h2>
        <Button variant="outline" size="sm" onClick={handleMarkAllAsRead}>
          Mark All as Read
        </Button>
      </div>

      <div className="space-y-4">
        {notifications.map((notification) => (
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
                      <Badge className={getNotificationColor(notification.type)}>
                        {notification.type.replace("_", " ")}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                    <p className="text-xs text-gray-500">{notification.time}</p>
                  </div>
                </div>
                {notification.isNew && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleMarkAsRead(notification.id)}
                  >
                    Mark as Read
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {notifications.length === 0 && (
        <div className="text-center py-8">
          <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No notifications yet.</p>
        </div>
      )}
    </div>
  );
};

export default NotificationsTab;
