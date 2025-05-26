
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar, User, Mail, BookOpen, Award, MessageSquare, Phone, Video, Download } from "lucide-react";

interface CoAuthorInvitationProps {
  invitation: {
    id: string;
    fromUser: {
      name: string;
      title: string;
      institution: string;
      email: string;
      profileImage?: string;
      department?: string;
      researchInterests?: string[];
      publications?: number;
      hIndex?: number;
    };
    publicationType: string;
    researchTopic: string;
    researchProblem: string;
    objectives: string;
    methodology: string;
    roles: string;
    nextSteps: string;
    dateSent: string;
    status: 'pending' | 'accepted' | 'declined';
  };
  onAccept: (id: string, comment: string) => void;
  onDecline: (id: string, comment: string) => void;
}

const CoAuthorInvitation = ({ invitation, onAccept, onDecline }: CoAuthorInvitationProps) => {
  const [comment, setComment] = useState("");
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [actionType, setActionType] = useState<'accept' | 'decline' | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'declined':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAction = (type: 'accept' | 'decline') => {
    setActionType(type);
    setShowCommentBox(true);
  };

  const handleSubmit = () => {
    if (actionType === 'accept') {
      onAccept(invitation.id, comment);
    } else if (actionType === 'decline') {
      onDecline(invitation.id, comment);
    }
    setComment("");
    setShowCommentBox(false);
    setActionType(null);
  };

  const handleScheduleCall = () => {
    console.log("Scheduling call for invitation:", invitation.id);
    alert("Opening calendar to schedule a call...");
  };

  const handleStartChat = () => {
    console.log("Starting chat for invitation:", invitation.id);
    alert("Opening chat interface...");
  };

  const handleDownloadDocument = () => {
    console.log("Downloading document for invitation:", invitation.id);
    alert("Downloading research proposal document...");
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Co-authorship Invitation
            </CardTitle>
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <Mail className="h-4 w-4" />
                From: {invitation.fromUser.name} ({invitation.fromUser.title})
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {new Date(invitation.dateSent).toLocaleDateString()}
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <Badge className={getStatusColor(invitation.status)}>
              {invitation.status.toUpperCase()}
            </Badge>
            <Badge variant="outline">{invitation.publicationType}</Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Requester Profile Section */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-semibold text-blue-700 mb-3 flex items-center gap-2">
            <User className="h-4 w-4" />
            Requester Profile
          </h4>
          <div className="flex items-start gap-4">
            {invitation.fromUser.profileImage && (
              <img 
                src={invitation.fromUser.profileImage} 
                alt={invitation.fromUser.name}
                className="w-16 h-16 rounded-full object-cover"
              />
            )}
            <div className="flex-1 space-y-2">
              <div>
                <p className="font-medium text-gray-900">{invitation.fromUser.name}</p>
                <p className="text-sm text-gray-600">{invitation.fromUser.title}</p>
                <p className="text-sm text-gray-600">{invitation.fromUser.institution}</p>
                {invitation.fromUser.department && (
                  <p className="text-sm text-gray-600">{invitation.fromUser.department}</p>
                )}
              </div>
              
              {invitation.fromUser.researchInterests && (
                <div>
                  <p className="text-sm font-medium text-gray-700">Research Interests:</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {invitation.fromUser.researchInterests.map((interest, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex gap-4 text-sm">
                {invitation.fromUser.publications && (
                  <span className="flex items-center gap-1">
                    <BookOpen className="h-3 w-3" />
                    {invitation.fromUser.publications} Publications
                  </span>
                )}
                {invitation.fromUser.hIndex && (
                  <span className="flex items-center gap-1">
                    <Award className="h-3 w-3" />
                    h-index: {invitation.fromUser.hIndex}
                  </span>
                )}
              </div>
              
              <p className="text-sm text-blue-600">{invitation.fromUser.email}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold text-blue-700 mb-2">Research Topic</h4>
            <p className="text-sm text-gray-700">{invitation.researchTopic}</p>
          </div>
          
          <div>
            <h4 className="font-semibold text-blue-700 mb-2">Research Problem / Gap</h4>
            <p className="text-sm text-gray-700">{invitation.researchProblem}</p>
          </div>
          
          <div>
            <h4 className="font-semibold text-blue-700 mb-2">Objectives</h4>
            <p className="text-sm text-gray-700">{invitation.objectives}</p>
          </div>
          
          <div>
            <h4 className="font-semibold text-blue-700 mb-2">Methodology</h4>
            <p className="text-sm text-gray-700">{invitation.methodology}</p>
          </div>
        </div>
        
        <div>
          <h4 className="font-semibold text-blue-700 mb-2">Proposed Roles</h4>
          <p className="text-sm text-gray-700">{invitation.roles}</p>
        </div>
        
        <div>
          <h4 className="font-semibold text-blue-700 mb-2">Next Steps</h4>
          <p className="text-sm text-gray-700">{invitation.nextSteps}</p>
        </div>
        
        {/* Comment Section */}
        {showCommentBox && (
          <div className="border-t pt-4">
            <Label htmlFor="comment">
              {actionType === 'accept' ? 'Acceptance Comment' : 'Decline Reason'}
            </Label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={actionType === 'accept' 
                ? "Please share your thoughts on this collaboration..." 
                : "Please provide a reason for declining..."}
              className="mt-2"
            />
            <div className="flex gap-2 mt-3">
              <Button onClick={handleSubmit} disabled={!comment.trim()}>
                {actionType === 'accept' ? 'Accept with Comment' : 'Decline with Comment'}
              </Button>
              <Button variant="outline" onClick={() => {
                setShowCommentBox(false);
                setComment("");
                setActionType(null);
              }}>
                Cancel
              </Button>
            </div>
          </div>
        )}
        
        {/* Action Buttons */}
        {invitation.status === 'pending' && !showCommentBox && (
          <div className="flex gap-3 pt-4 border-t">
            <Button 
              onClick={() => handleAction('accept')}
              className="bg-green-600 hover:bg-green-700"
            >
              Accept
            </Button>
            <Button 
              variant="outline" 
              onClick={() => handleAction('decline')}
              className="border-red-600 text-red-600 hover:bg-red-50"
            >
              Decline
            </Button>
            <Button variant="outline" onClick={handleDownloadDocument}>
              <Download className="h-4 w-4 mr-2" />
              Download Document
            </Button>
          </div>
        )}

        {/* Post-Acceptance Actions */}
        {invitation.status === 'accepted' && (
          <div className="flex gap-3 pt-4 border-t">
            <Button onClick={handleScheduleCall} className="bg-blue-600 hover:bg-blue-700">
              <Video className="h-4 w-4 mr-2" />
              Schedule Call
            </Button>
            <Button variant="outline" onClick={handleStartChat}>
              <MessageSquare className="h-4 w-4 mr-2" />
              Start Chat
            </Button>
            <Button variant="outline" onClick={handleDownloadDocument}>
              <Download className="h-4 w-4 mr-2" />
              Download Document
            </Button>
          </div>
        )}

        {/* Post-Decline Actions */}
        {invitation.status === 'declined' && (
          <div className="flex gap-3 pt-4 border-t">
            <Button variant="outline" onClick={handleDownloadDocument}>
              <Download className="h-4 w-4 mr-2" />
              Download Document
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CoAuthorInvitation;
