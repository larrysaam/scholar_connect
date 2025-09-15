
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
        </DialogHeader>        <div className="space-y-4">
          <div>
            <Label htmlFor="message" className="text-sm font-medium text-gray-700">Message</Label>
            <Textarea
              id="message"
              value={messageContent}
              onChange={(e) => setMessageContent(e.target.value)}
              placeholder="Type your message here..."
              rows={4}
              className="mt-1 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500 resize-none"
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button 
              onClick={handleSendMessage}
              className="bg-blue-500 hover:bg-blue-600 text-white rounded-full px-6 py-2 flex-1 sm:flex-none"
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Send Message
            </Button>
            <Button 
              variant="outline" 
              onClick={() => onOpenChat(personId, consultationId)}
              className="rounded-full px-6 py-2 border-blue-200 text-blue-600 hover:bg-blue-50 flex-1 sm:flex-none"
            >
              Open Chat
            </Button>
            <Button 
              variant="outline" 
              onClick={handleCancel}
              className="rounded-full px-6 py-2 text-gray-600 hover:bg-gray-50 flex-1 sm:flex-none"
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContactDialog;
