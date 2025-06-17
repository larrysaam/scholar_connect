
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import CoAuthorInvitation from "@/components/researcher/CoAuthorInvitation";

const CoAuthorInvitationsTab = () => {
  const { toast } = useToast();
  const [invitations, setInvitations] = useState<any[]>([]);

  // Load invitations from localStorage
  useEffect(() => {
    const loadInvitations = () => {
      const storedInvitations = JSON.parse(localStorage.getItem('coauthor_invitations') || '[]');
      setInvitations(storedInvitations);
    };

    loadInvitations();
    
    // Listen for storage changes
    window.addEventListener('storage', loadInvitations);
    return () => window.removeEventListener('storage', loadInvitations);
  }, []);

  const handleAcceptInvitation = (id: string, comment: string) => {
    const updatedInvitations = invitations.map(inv => 
      inv.id === id ? { ...inv, status: 'accepted', responseComment: comment } : inv
    );
    setInvitations(updatedInvitations);
    localStorage.setItem('coauthor_invitations', JSON.stringify(updatedInvitations));
    
    toast({
      title: "Invitation Accepted",
      description: "You have accepted this co-authorship invitation"
    });
  };

  const handleDeclineInvitation = (id: string, comment: string) => {
    const updatedInvitations = invitations.map(inv => 
      inv.id === id ? { ...inv, status: 'declined', responseComment: comment } : inv
    );
    setInvitations(updatedInvitations);
    localStorage.setItem('coauthor_invitations', JSON.stringify(updatedInvitations));
    
    toast({
      title: "Invitation Declined",
      description: "You have declined this co-authorship invitation"
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      case "accepted":
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Accepted</Badge>;
      case "declined":
        return <Badge className="bg-red-100 text-red-800"><X className="h-3 w-3 mr-1" />Declined</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Co-author Invitations</h2>
        <Badge variant="secondary">
          {invitations.filter(inv => inv.status === "pending").length} Pending
        </Badge>
      </div>

      <div className="space-y-4">
        {invitations.map((invitation) => (
          <CoAuthorInvitation
            key={invitation.id}
            invitation={invitation}
            onAccept={handleAcceptInvitation}
            onDecline={handleDeclineInvitation}
          />
        ))}
      </div>

      {invitations.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-500">No co-authorship invitations yet.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CoAuthorInvitationsTab;
