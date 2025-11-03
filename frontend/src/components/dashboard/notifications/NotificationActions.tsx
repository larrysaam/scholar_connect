
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Video } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { NotificationItem } from "@/types/notificationTypes";

interface NotificationActionsProps {
  notification: NotificationItem;
  onMarkAsRead: (id: number) => void;
  onViewJob: (jobId: string, notificationId: number) => void;
  onJoinMeeting: (meetingLink: string, notificationId: number) => void;
  onReply: (clientId: string, notificationId: number, replyText: string) => void;
}

const NotificationActions = ({ 
  notification, 
  onMarkAsRead, 
  onViewJob, 
  onJoinMeeting, 
  onReply 
}: NotificationActionsProps) => {
  const [replyText, setReplyText] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleReply = () => {
    if (!replyText.trim()) {
      toast({
        title: "Error",
        description: "Please enter a reply message",
        variant: "destructive"
      });
      return;
    }

    onReply(notification.clientId!, notification.id, replyText);
    setReplyText("");
    setIsDialogOpen(false);
  };

  return (
    <div className="flex flex-col space-y-2">
      {notification.isNew && (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => onMarkAsRead(notification.id)}
        >
          Mark as Read
        </Button>
      )}
      
      {notification.type === "job_invitation" && notification.jobId && (
        <Button 
          size="sm"
          onClick={() => onViewJob(notification.jobId!, notification.id)}
        >
          View Job
        </Button>
      )}
      
      {notification.type === "message_received" && notification.clientId && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
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
                <Button onClick={handleReply} className="flex-1">
                  Send Reply
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setIsDialogOpen(false)}
                >
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
          onClick={() => onJoinMeeting(notification.meetingLink!, notification.id)}
          className="bg-green-600 hover:bg-green-700"
        >
          <Video className="h-4 w-4 mr-1" />
          Join Meeting
        </Button>
      )}
    </div>
  );
};

export default NotificationActions;
