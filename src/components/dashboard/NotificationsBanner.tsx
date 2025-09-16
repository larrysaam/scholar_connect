
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, X, MessageSquare, Calendar, UserCheck } from "lucide-react";
import AnnouncementsBanner from "@/components/notifications/AnnouncementsBanner";

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
  return (
    <div>
      {/* Announcements Banner */}
      <AnnouncementsBanner />
      
      {/* Regular Notifications Banner */}
      {showBanner && newNotificationsCount > 0 && (
    <Card className="mb-4 sm:mb-6 border-blue-200 bg-blue-50 max-w-full overflow-hidden">
      <CardContent className="p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
          <div className="flex items-start sm:items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
            <Bell className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 flex-shrink-0 mt-0.5 sm:mt-0" />
            <div className="min-w-0 flex-1">
              <h4 className="font-medium text-blue-900 text-sm sm:text-base">
                You have {newNotificationsCount} new notification{newNotificationsCount > 1 ? 's' : ''}
              </h4>
              <div className="flex flex-col sm:flex-row flex-wrap gap-1 sm:gap-2 mt-2">
                {notifications.filter(n => n.isNew).slice(0, 2).map((notification) => (
                  <div key={notification.id} className="flex items-center space-x-1 sm:space-x-2 bg-white px-2 sm:px-3 py-1 rounded-full max-w-full">
                    <notification.icon className="h-3 w-3 text-blue-600 flex-shrink-0" />
                    <span className="text-xs sm:text-sm text-blue-800 truncate">{notification.title}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-3 w-3 sm:h-4 sm:w-4 p-0 hover:bg-blue-100 flex-shrink-0"
                      onClick={() => handleDismissNotification(notification.id)}
                    >
                      <X className="h-2 w-2 sm:h-3 sm:w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex items-center justify-end space-x-2 sm:space-x-2 flex-shrink-0">
            <Button 
              variant="outline" 
              size="sm" 
              className="bg-white text-xs sm:text-sm px-2 sm:px-3 h-7 sm:h-8"
            >
              View All
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDismissBanner}
              className="hover:bg-blue-100 h-7 w-7 sm:h-8 sm:w-8 p-0"
            >
              <X className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </div>        </div>
      </CardContent>
    </Card>
      )}
    </div>
  );
};

export default NotificationsBanner;
