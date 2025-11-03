
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell } from "lucide-react";

interface NotificationHeaderProps {
  unreadCount: number;
  onMarkAllAsRead: () => void;
}

const NotificationHeader = ({ unreadCount, onMarkAllAsRead }: NotificationHeaderProps) => {
  return (
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
      <Button variant="outline" size="sm" onClick={onMarkAllAsRead}>
        Mark All as Read
      </Button>
    </div>
  );
};

export default NotificationHeader;
