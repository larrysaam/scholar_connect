
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar, MessageSquare, Users, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CoAuthorInvitationProps {
  invitation: {
    id: string;
    projectTitle: string;
    inviterName: string;
    inviterEmail: string;
    message: string;
    status: "pending" | "accepted" | "declined";
    createdAt: string;
    responseComment?: string;
  };
  onAccept: (id: string, comment: string) => void;
  onDecline: (id: string, comment: string) => void;
}

const CoAuthorInvitation = ({ invitation, onAccept, onDecline }: CoAuthorInvitationProps) => {
  const { toast } = useToast();
  const [comment, setComment] = useState("");
  const [isResponseDialogOpen, setIsResponseDialogOpen] = useState(false);
  const [responseType, setResponseType] = useState<"accept" | "decline">("accept");

  const handleResponse = () => {
    if (responseType === "accept") {
      onAccept(invitation.id, comment);
    } else {
      onDecline(invitation.id, comment);
    }
    setComment("");
    setIsResponseDialogOpen(false);
  };

  const handleGoToWorkspace = () => {
    window.location.href = "/co-author-workspace";
  };

  const handleScheduleCall = () => {
    toast({
      title: "Call Scheduled",
      description: "A meeting request has been sent to discuss the collaboration"
    });
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: "bg-yellow-100 text-yellow-800",
      accepted: "bg-green-100 text-green-800",
      declined: "bg-red-100 text-red-800"
    };
    return <Badge className={variants[status as keyof typeof variants]}>{status}</Badge>;
  };

  return (
    <Card className="mb-4">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{invitation.projectTitle}</CardTitle>
            <p className="text-sm text-gray-600">
              From: {invitation.inviterName} ({invitation.inviterEmail})
            </p>
            <p className="text-xs text-gray-500">
              {new Date(invitation.createdAt).toLocaleDateString()}
            </p>
          </div>
          {getStatusBadge(invitation.status)}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-medium text-sm mb-2">Invitation Message:</h4>
          <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">{invitation.message}</p>
        </div>

        {invitation.responseComment && (
          <div>
            <h4 className="font-medium text-sm mb-2">Your Response:</h4>
            <p className="text-sm text-gray-700 bg-blue-50 p-3 rounded">{invitation.responseComment}</p>
          </div>
        )}

        <div className="flex gap-2 flex-wrap">
          {invitation.status === "pending" && (
            <>
              <Dialog open={isResponseDialogOpen} onOpenChange={setIsResponseDialogOpen}>
                <DialogTrigger asChild>
                  <Button 
                    onClick={() => setResponseType("accept")}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Accept with Comments
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      {responseType === "accept" ? "Accept" : "Decline"} Invitation
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder={`Add a comment to your ${responseType === "accept" ? "acceptance" : "decline"}...`}
                      rows={4}
                    />
                    <div className="flex gap-2">
                      <Button onClick={handleResponse}>
                        {responseType === "accept" ? "Accept" : "Decline"}
                      </Button>
                      <Button variant="outline" onClick={() => setIsResponseDialogOpen(false)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              <Button 
                variant="outline" 
                onClick={() => {
                  setResponseType("decline");
                  setIsResponseDialogOpen(true);
                }}
                className="border-red-200 text-red-600 hover:bg-red-50"
              >
                Decline with Comments
              </Button>
            </>
          )}

          {invitation.status === "accepted" && (
            <Button onClick={handleGoToWorkspace} className="bg-blue-600 hover:bg-blue-700">
              <Users className="h-4 w-4 mr-2" />
              Go to Co-Author Workspace
            </Button>
          )}

          <Button variant="outline" onClick={handleScheduleCall}>
            <Calendar className="h-4 w-4 mr-2" />
            Schedule Call
          </Button>

          <Button variant="outline">
            <MessageSquare className="h-4 w-4 mr-2" />
            Message Collaborator
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CoAuthorInvitation;
