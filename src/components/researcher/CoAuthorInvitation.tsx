
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar, User, BookOpen, Award, MessageSquare, Phone, Video, Download } from "lucide-react";

interface CoAuthorInvitationProps {
  invitation: {
    id: string;
    fromUser: {
      name: string;
      title: string;
      institution: string;
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
    <Card className="mb-6 border-l-4 border-l-blue-500 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2 text-xl text-blue-900">
              <User className="h-6 w-6" />
              Co-authorship Invitation
            </CardTitle>
            <div className="flex items-center gap-4 mt-3 text-sm text-gray-700">
              <span className="flex items-center gap-1 font-medium">
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
            <Badge variant="outline" className="bg-white">{invitation.publicationType}</Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6 p-6">
        {/* Requester Profile Section */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-5 rounded-lg border border-blue-200">
          <h4 className="font-semibold text-blue-700 mb-4 flex items-center gap-2">
            <User className="h-5 w-5" />
            Requester Profile
          </h4>
          <div className="flex items-start gap-6">
            {invitation.fromUser.profileImage && (
              <img 
                src={invitation.fromUser.profileImage} 
                alt={invitation.fromUser.name}
                className="w-20 h-20 rounded-full object-cover border-3 border-white shadow-md"
              />
            )}
            <div className="flex-1 space-y-3">
              <div>
                <p className="font-semibold text-gray-900 text-lg">{invitation.fromUser.name}</p>
                <p className="text-blue-700 font-medium">{invitation.fromUser.title}</p>
                <p className="text-gray-600">{invitation.fromUser.institution}</p>
                {invitation.fromUser.department && (
                  <p className="text-gray-600">{invitation.fromUser.department}</p>
                )}
              </div>
              
              {invitation.fromUser.researchInterests && (
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-2">Research Interests:</p>
                  <div className="flex flex-wrap gap-2">
                    {invitation.fromUser.researchInterests.map((interest, index) => (
                      <Badge key={index} variant="secondary" className="text-xs bg-blue-100 text-blue-800">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex gap-6 text-sm">
                {invitation.fromUser.publications && (
                  <span className="flex items-center gap-2 bg-white px-3 py-1 rounded-full">
                    <BookOpen className="h-4 w-4 text-blue-600" />
                    <span className="font-medium">{invitation.fromUser.publications} Publications</span>
                  </span>
                )}
                {invitation.fromUser.hIndex && (
                  <span className="flex items-center gap-2 bg-white px-3 py-1 rounded-full">
                    <Award className="h-4 w-4 text-yellow-600" />
                    <span className="font-medium">h-index: {invitation.fromUser.hIndex}</span>
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Research Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-700 mb-3">Research Topic</h4>
            <p className="text-gray-700">{invitation.researchTopic}</p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-700 mb-3">Research Problem / Gap</h4>
            <p className="text-gray-700">{invitation.researchProblem}</p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-700 mb-3">Objectives</h4>
            <p className="text-gray-700">{invitation.objectives}</p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-700 mb-3">Methodology</h4>
            <p className="text-gray-700">{invitation.methodology}</p>
          </div>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-semibold text-blue-700 mb-3">Proposed Roles</h4>
          <p className="text-gray-700">{invitation.roles}</p>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-semibold text-blue-700 mb-3">Next Steps</h4>
          <p className="text-gray-700">{invitation.nextSteps}</p>
        </div>
        
        {/* Comment Section */}
        {showCommentBox && (
          <div className="border-t pt-6 bg-blue-50 p-4 rounded-lg">
            <Label htmlFor="comment" className="text-lg font-medium">
              {actionType === 'accept' ? 'Acceptance Comment' : 'Decline Reason'}
            </Label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={actionType === 'accept' 
                ? "Please share your thoughts on this collaboration..." 
                : "Please provide a reason for declining..."}
              className="mt-3 min-h-24"
            />
            <div className="flex gap-3 mt-4">
              <Button onClick={handleSubmit} disabled={!comment.trim()} className="bg-blue-600 hover:bg-blue-700">
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
          <div className="flex gap-3 pt-6 border-t">
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
          <div className="flex gap-3 pt-6 border-t bg-green-50 p-4 rounded-lg">
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
          <div className="flex gap-3 pt-6 border-t">
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
