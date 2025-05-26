
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface ConsultationResponseDialogProps {
  type: 'accept' | 'decline';
  consultationId: string;
  onSubmit: (consultationId: string, comment: string) => void;
  trigger: React.ReactNode;
}

const ConsultationResponseDialog = ({
  type,
  consultationId,
  onSubmit,
  trigger,
}: ConsultationResponseDialogProps) => {
  const [responseComment, setResponseComment] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = () => {
    if (!responseComment.trim()) return;
    onSubmit(consultationId, responseComment);
    setResponseComment("");
    setIsOpen(false);
  };

  const handleCancel = () => {
    setResponseComment("");
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {type === 'accept' ? 'Accept Consultation' : 'Decline Consultation'}
          </DialogTitle>
          <DialogDescription>
            {type === 'accept' 
              ? 'Add a comment for the student along with your acceptance.'
              : 'Please provide a reason for declining this consultation.'
            }
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor={`${type}-comment`}>
              {type === 'accept' ? 'Comment' : 'Reason'}
            </Label>
            <Textarea
              id={`${type}-comment`}
              value={responseComment}
              onChange={(e) => setResponseComment(e.target.value)}
              placeholder={
                type === 'accept'
                  ? "Add any notes or preparation instructions for the student..."
                  : "Please explain why you're declining this consultation..."
              }
              rows={3}
            />
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={handleSubmit} 
              variant={type === 'decline' ? 'destructive' : 'default'}
            >
              {type === 'accept' ? 'Accept with Comment' : 'Decline with Comment'}
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

export default ConsultationResponseDialog;
