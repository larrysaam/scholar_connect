
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { NotificationItem } from "@/types/notificationTypes";
import { getNotificationColor, getPriorityBadge } from "@/utils/notificationUtils";
import NotificationActions from "./NotificationActions";

interface NotificationCardProps {
  notification: NotificationItem;
  onMarkAsRead: (id: number) => void;
  onViewJob: (jobId: string, notificationId: number) => void;
  onJoinMeeting: (meetingLink: string, notificationId: number) => void;
  onReply: (clientId: string, notificationId: number, replyText: string) => void;
}

const NotificationCard = ({ 
  notification, 
  onMarkAsRead, 
  onViewJob, 
  onJoinMeeting, 
  onReply 
}: NotificationCardProps) => {
  const priorityBadge = getPriorityBadge(notification.priority);

  return (
    <Card className={notification.isNew ? "border-blue-200 bg-blue-50" : ""}>
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
                <Badge 
                  className={priorityBadge.className}
                  variant={priorityBadge.variant}
                >
                  {priorityBadge.text}
                </Badge>
                <Badge className={getNotificationColor(notification.type)}>
                  {notification.type.replace("_", " ")}
                </Badge>
              </div>
              <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
              <p className="text-xs text-gray-500">{notification.time}</p>
            </div>
          </div>
          <NotificationActions
            notification={notification}
            onMarkAsRead={onMarkAsRead}
            onViewJob={onViewJob}
            onJoinMeeting={onJoinMeeting}
            onReply={onReply}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationCard;
