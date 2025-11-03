
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MessageModalProps {
  researcher: {
    id: string;
    name: string;
  };
}

const MessageModal = ({ researcher }: MessageModalProps) => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");

  const handleSendMessage = () => {
    if (!message.trim()) {
      toast({
        title: "Empty Message",
        description: "Please enter a message before sending",
        variant: "destructive"
      });
      return;
    }

    console.log("Sending message to researcher:", researcher.id, "Message:", message);

    toast({
      title: "Message Sent!",
      description: `Your message has been sent to ${researcher.name}`,
    });
    
    setIsOpen(false);
    setMessage("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <MessageSquare className="h-4 w-4 mr-2" />
          Send Message
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Send Message to {researcher.name}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div>
            <Label htmlFor="message" className="font-medium">Your Message</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message here..."
              rows={6}
              className="mt-2"
            />
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={handleSendMessage} 
              className="flex-1"
              disabled={!message.trim()}
            >
              Send Message
            </Button>
            <Button 
              variant="outline" 
              onClick={() => {
                setIsOpen(false);
                setMessage("");
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MessageModal;
