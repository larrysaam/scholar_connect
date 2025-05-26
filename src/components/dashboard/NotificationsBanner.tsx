
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, X, MessageSquare, Calendar, UserCheck } from "lucide-react";

const NotificationsBanner = () => {
  const [notifications, setNotifications] = useState([
    {
      id: "1",
      type: "consultation_request",
      title: "New Consultation Request",
      message: "Sarah Johnson has requested a consultation",
      isNew: true,
      icon: Calendar
    },
    {
      id: "2", 
      type: "co_author_invitation",
      title: "Co-authorship Response",
      message: "Dr. Michael Brown accepted your invitation",
      isNew: true,
      icon: UserCheck
    }
  ]);

  const [showBanner, setShowBanner] = useState(true);

  const newNotificationsCount = notifications.filter(n => n.isNew).length;

  const handleDismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleDismissBanner = () => {
    setShowBanner(false);
  };

  if (!showBanner || newNotificationsCount === 0) {
    return null;
  }

  return (
    <Card className="mb-6 border-blue-200 bg-blue-50">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Bell className="h-5 w-5 text-blue-600" />
            <div>
              <h4 className="font-medium text-blue-900">
                You have {newNotificationsCount} new notification{newNotificationsCount > 1 ? 's' : ''}
              </h4>
              <div className="flex flex-wrap gap-2 mt-2">
                {notifications.filter(n => n.isNew).slice(0, 2).map((notification) => (
                  <div key={notification.id} className="flex items-center space-x-2 bg-white px-3 py-1 rounded-full">
                    <notification.icon className="h-3 w-3 text-blue-600" />
                    <span className="text-sm text-blue-800">{notification.title}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 hover:bg-blue-100"
                      onClick={() => handleDismissNotification(notification.id)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" className="bg-white">
              View All
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDismissBanner}
              className="hover:bg-blue-100"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationsBanner;
