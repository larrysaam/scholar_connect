
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MessageSquare } from "lucide-react";

interface ContactDialogProps {
  personName: string;
  personType: "student" | "researcher";
  consultationId: string;
  onSendMessage: (consultationId: string, message: string) => void;
  onOpenChat: (personId: string, consultationId: string) => void;
  personId: string;
}

const ContactDialog = ({ 
  personName, 
  personType, 
  consultationId, 
  onSendMessage, 
  onOpenChat, 
  personId 
}: ContactDialogProps) => {
  const [messageContent, setMessageContent] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleSendMessage = () => {
    if (!messageContent.trim()) return;
    onSendMessage(consultationId, messageContent);
    setMessageContent("");
    setIsOpen(false);
  };

  const handleCancel = () => {
    setMessageContent("");
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <MessageSquare className="h-4 w-4 mr-2" />
          Contact {personType === "student" ? "Student" : "Researcher"}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Send Message to {personName}</DialogTitle>
          <DialogDescription>
            Send a follow-up message to the {personType} through the platform messaging system.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              value={messageContent}
              onChange={(e) => setMessageContent(e.target.value)}
              placeholder="Type your message here..."
              rows={4}
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={handleSendMessage}>
              Send Message
            </Button>
            <Button 
              variant="outline" 
              onClick={() => onOpenChat(personId, consultationId)}
            >
              Open Chat
            </Button>
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContactDialog;
