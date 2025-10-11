
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { UserPlus, Mail } from "lucide-react";

interface InviteModalProps {
  userType: "researcher" | "student" | "research-aid";
  triggerText: string;
}

const InviteModal = ({ userType, triggerText }: InviteModalProps) => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleSendInvite = () => {
    console.log(`Sending ${userType} invite to:`, { email, message });
    // In a real app, this would send an invitation email
    setIsOpen(false);
    setEmail("");
    setMessage("");
  };

  const getDefaultMessage = () => {
    switch (userType) {
      case "researcher":
        return "I'd like to invite you to join ResearchWow as a researcher. Your expertise would be valuable to our academic community.";
      case "student":
        return "I'd like to invite you to join ResearchWow as a student. You'll have access to expert researchers and valuable academic resources.";
      case "research-aid":
        return "I'd like to invite you to join ResearchWow as a research aid. Your skills would help students achieve their research goals.";
      default:
        return "";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center">
          <UserPlus className="mr-2 h-4 w-4" />
          {triggerText}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Mail className="mr-2 h-5 w-5" />
            {triggerText}
          </DialogTitle>
          <DialogDescription>
            Send an invitation to join ResearchWow as a {userType.replace("-", " ")}.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email address"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Invitation Message</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={getDefaultMessage()}
              rows={4}
            />
          </div>

          <Button 
            onClick={handleSendInvite} 
            className="w-full"
            disabled={!email.trim()}
          >
            Send Invitation
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InviteModal;
