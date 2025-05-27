
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Download, Calendar, MessageSquare, Clock, CheckCircle, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const CoAuthorInvitationsTab = () => {
  const { toast } = useToast();
  const [replyMessage, setReplyMessage] = useState("");
  const [selectedInvitation, setSelectedInvitation] = useState<any>(null);

  const invitations = [
    {
      id: 1,
      title: "AI in Healthcare: A Comprehensive Review",
      requester: "Dr. Sarah Johnson",
      institution: "University of Yaoundé I",
      date: "2024-01-28",
      status: "pending",
      description: "Looking for co-authors for a comprehensive review on AI applications in healthcare systems across African contexts.",
      deadline: "2024-02-15",
      estimatedWork: "20-30 hours",
      documentUrl: "/sample-research-proposal.pdf"
    },
    {
      id: 2,
      title: "Sustainable Agriculture Technologies in Cameroon",
      requester: "Prof. Marie Dubois",
      institution: "University of Douala",
      date: "2024-01-25",
      status: "accepted",
      description: "Research collaboration on sustainable farming technologies and their impact on rural communities.",
      deadline: "2024-03-01",
      estimatedWork: "40-50 hours",
      documentUrl: "/agriculture-research-plan.pdf"
    },
    {
      id: 3,
      title: "Digital Banking Security in Central Africa",
      requester: "Dr. Paul Mbarga",
      institution: "ESTI",
      date: "2024-01-20",
      status: "declined",
      description: "Study on cybersecurity challenges and solutions for digital banking platforms in Central African markets.",
      deadline: "2024-02-28",
      estimatedWork: "25-35 hours",
      documentUrl: "/banking-security-proposal.pdf"
    }
  ];

  const handleDownloadDocument = (documentUrl: string, title: string) => {
    toast({
      title: "Downloading Document",
      description: `Downloading ${title} research proposal...`
    });
    
    // In a real app, this would download the actual document
    console.log("Downloading document:", documentUrl);
    
    // Simulate download
    const link = document.createElement('a');
    link.href = documentUrl;
    link.download = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`;
    link.click();
  };

  const handleScheduleCall = (invitation: any) => {
    toast({
      title: "Scheduling Call",
      description: `Opening calendar to schedule call with ${invitation.requester}...`
    });
    
    // In a real app, this would integrate with calendar API
    const calendarUrl = `https://calendar.google.com/calendar/u/0/r/eventedit?text=Research%20Collaboration%20Call%20-%20${encodeURIComponent(invitation.title)}&details=Call%20with%20${encodeURIComponent(invitation.requester)}%20regarding%20research%20collaboration`;
    window.open(calendarUrl, '_blank');
  };

  const handleStartChat = (invitation: any) => {
    setSelectedInvitation(invitation);
    toast({
      title: "Starting Chat",
      description: `Initiating conversation with ${invitation.requester}...`
    });
  };

  const handleSendMessage = () => {
    if (!replyMessage.trim()) {
      toast({
        title: "Error",
        description: "Please enter a message before sending",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Message Sent",
      description: `Your message has been sent to ${selectedInvitation?.requester}`
    });
    
    setReplyMessage("");
    setSelectedInvitation(null);
  };

  const handleAcceptInvitation = (id: number) => {
    toast({
      title: "Invitation Accepted",
      description: "You have accepted this co-authorship invitation"
    });
    console.log("Accepting invitation:", id);
  };

  const handleDeclineInvitation = (id: number) => {
    toast({
      title: "Invitation Declined",
      description: "You have declined this co-authorship invitation"
    });
    console.log("Declining invitation:", id);
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
          <Card key={invitation.id} className={invitation.status === "pending" ? "border-blue-200" : ""}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{invitation.title}</CardTitle>
                  <p className="text-sm text-gray-600 mt-1">
                    by {invitation.requester} • {invitation.institution}
                  </p>
                </div>
                {getStatusBadge(invitation.status)}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">{invitation.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">Deadline</p>
                  <p className="text-sm">{invitation.deadline}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Estimated Work</p>
                  <p className="text-sm">{invitation.estimatedWork}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Received</p>
                  <p className="text-sm">{invitation.date}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDownloadDocument(invitation.documentUrl, invitation.title)}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Document
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleScheduleCall(invitation)}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Call
                </Button>
                
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleStartChat(invitation)}
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Start Chat
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Message {invitation.requester}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="message">Your Message</Label>
                        <Textarea
                          id="message"
                          placeholder="Type your message here..."
                          value={replyMessage}
                          onChange={(e) => setReplyMessage(e.target.value)}
                          rows={4}
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={handleSendMessage}>Send Message</Button>
                        <Button variant="outline" onClick={() => setSelectedInvitation(null)}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                {invitation.status === "pending" && (
                  <>
                    <Button
                      size="sm"
                      onClick={() => handleAcceptInvitation(invitation.id)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Accept
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeclineInvitation(invitation.id)}
                    >
                      Decline
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {invitations.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No co-authorship invitations yet.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CoAuthorInvitationsTab;
