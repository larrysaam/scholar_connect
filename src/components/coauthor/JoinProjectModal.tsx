
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, FileText, User } from "lucide-react";

interface JoinProjectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const JoinProjectModal = ({ open, onOpenChange }: JoinProjectModalProps) => {
  const [inviteCode, setInviteCode] = useState("");
  const [projectInfo, setProjectInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Mock project lookup - in real app this would query the database
  const lookupProject = async (code: string) => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      if (code === "DEMO123") {
        setProjectInfo({
          id: "proj_demo",
          title: "Climate Change Research Initiative",
          type: "Journal Article",
          primaryAuthor: "Dr. Sarah Johnson",
          collaborators: 4,
          description: "A comprehensive study on climate change impacts in West Africa",
          visibility: "Private"
        });
      } else {
        setProjectInfo(null);
      }
      setIsLoading(false);
    }, 1000);
  };

  const handleCodeChange = (value: string) => {
    setInviteCode(value);
    setProjectInfo(null);
    
    if (value.length >= 6) {
      lookupProject(value);
    }
  };

  const handleJoinProject = () => {
    if (projectInfo) {
      // In real app, this would add the user to the project
      console.log("Joining project:", projectInfo.id);
      window.location.href = `/workspace/${projectInfo.id}`;
    }
  };

  const handleClose = () => {
    setInviteCode("");
    setProjectInfo(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Join a Co-Author Project</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Invite Code Input */}
          <div className="space-y-2">
            <Label htmlFor="inviteCode">Project Invite Code</Label>
            <Input
              id="inviteCode"
              value={inviteCode}
              onChange={(e) => handleCodeChange(e.target.value)}
              placeholder="Enter 6-character invite code"
              className="uppercase"
              maxLength={6}
            />
            <p className="text-xs text-gray-600">
              Enter the invite code shared by the project creator
            </p>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-sm text-gray-600 mt-2">Looking up project...</p>
            </div>
          )}

          {/* Project Not Found */}
          {inviteCode.length >= 6 && !isLoading && !projectInfo && (
            <div className="text-center py-4">
              <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">
                Project not found. Please check the invite code.
              </p>
            </div>
          )}

          {/* Project Info Card */}
          {projectInfo && (
            <Card>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium line-clamp-2">{projectInfo.title}</h3>
                    <Badge variant="outline" className="text-xs ml-2">
                      {projectInfo.type}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {projectInfo.description}
                  </p>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      <span>{projectInfo.primaryAuthor}</span>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{projectInfo.collaborators} members</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center pt-2 border-t">
                    <Badge variant="secondary" className="text-xs">
                      {projectInfo.visibility}
                    </Badge>
                    
                    <Button onClick={handleJoinProject} size="sm">
                      Join Project
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Demo Hint */}
          <div className="text-center text-xs text-gray-500 pt-2 border-t">
            Demo: Try code "DEMO123" to see project preview
          </div>

          {/* Form Actions */}
          <div className="flex justify-end">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default JoinProjectModal;
