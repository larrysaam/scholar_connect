
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Mail, Link } from "lucide-react";

interface JoinProjectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const JoinProjectModal = ({ open, onOpenChange }: JoinProjectModalProps) => {
  const { toast } = useToast();
  const [joinMethod, setJoinMethod] = useState<"invite" | "link">("invite");
  const [inviteCode, setInviteCode] = useState("");
  const [projectLink, setProjectLink] = useState("");

  const handleJoinByInvite = () => {
    if (!inviteCode.trim()) {
      toast({
        title: "Error",
        description: "Please enter an invitation code",
        variant: "destructive"
      });
      return;
    }

    // In real app, this would validate and join the project
    console.log("Joining project with invite code:", inviteCode);
    
    toast({
      title: "Joining Project",
      description: "Processing your invitation code..."
    });

    setInviteCode("");
    onOpenChange(false);
  };

  const handleJoinByLink = () => {
    if (!projectLink.trim()) {
      toast({
        title: "Error", 
        description: "Please enter a project link",
        variant: "destructive"
      });
      return;
    }

    // In real app, this would validate and join the project
    console.log("Joining project with link:", projectLink);
    
    toast({
      title: "Joining Project",
      description: "Processing project link..."
    });

    setProjectLink("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Join Collaboration Project</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Method Selection */}
          <div className="flex gap-2">
            <Button
              variant={joinMethod === "invite" ? "default" : "outline"}
              onClick={() => setJoinMethod("invite")}
              className="flex-1"
            >
              <Mail className="h-4 w-4 mr-2" />
              Invitation Code
            </Button>
            <Button
              variant={joinMethod === "link" ? "default" : "outline"}
              onClick={() => setJoinMethod("link")}
              className="flex-1"
            >
              <Link className="h-4 w-4 mr-2" />
              Project Link
            </Button>
          </div>

          {/* Join by Invitation Code */}
          {joinMethod === "invite" && (
            <div className="space-y-3">
              <div>
                <Label htmlFor="invite-code">Invitation Code</Label>
                <Input
                  id="invite-code"
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value)}
                  placeholder="Enter 6-digit code (e.g., ABC123)"
                  className="mt-1"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
                <Button onClick={handleJoinByInvite}>
                  Join Project
                </Button>
              </div>
            </div>
          )}

          {/* Join by Project Link */}
          {joinMethod === "link" && (
            <div className="space-y-3">
              <div>
                <Label htmlFor="project-link">Project Link</Label>
                <Input
                  id="project-link"
                  value={projectLink}
                  onChange={(e) => setProjectLink(e.target.value)}
                  placeholder="Paste project sharing link..."
                  className="mt-1"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
                <Button onClick={handleJoinByLink}>
                  Join Project
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default JoinProjectModal;
