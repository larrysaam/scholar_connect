
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileText } from "lucide-react";

interface LiveDocumentReviewDialogProps {
  consultationId: string;
  onSubmitDocumentLink: (consultationId: string, documentLink: string) => void;
}

const LiveDocumentReviewDialog = ({ 
  consultationId, 
  onSubmitDocumentLink 
}: LiveDocumentReviewDialogProps) => {
  const [documentLink, setDocumentLink] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = () => {
    if (!documentLink.trim()) return;
    onSubmitDocumentLink(consultationId, documentLink);
    setDocumentLink("");
    setIsOpen(false);
  };

  const handleCancel = () => {
    setDocumentLink("");
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <FileText className="h-4 w-4 mr-2" />
          Live Document Review
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share Document for Live Review</DialogTitle>
          <DialogDescription>
            Provide a Google Docs link for live document review with the researcher.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="document-link">Google Docs Link</Label>
            <Input
              id="document-link"
              value={documentLink}
              onChange={(e) => setDocumentLink(e.target.value)}
              placeholder="https://docs.google.com/document/d/..."
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={handleSubmit}>
              Share Document
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

export default LiveDocumentReviewDialog;
