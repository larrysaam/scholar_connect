
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, User, Mail } from "lucide-react";

interface CoAuthorInvitationProps {
  invitation: {
    id: string;
    fromUser: {
      name: string;
      title: string;
      institution: string;
      email: string;
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
  onAccept: (id: string) => void;
  onDecline: (id: string) => void;
}

const CoAuthorInvitation = ({ invitation, onAccept, onDecline }: CoAuthorInvitationProps) => {
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
        
        <div className="bg-gray-50 p-3 rounded-lg">
          <h4 className="font-semibold text-gray-700 mb-2">Contact Information</h4>
          <p className="text-sm text-gray-600">{invitation.fromUser.name}</p>
          <p className="text-sm text-gray-600">{invitation.fromUser.institution}</p>
          <p className="text-sm text-blue-600">{invitation.fromUser.email}</p>
        </div>
        
        {invitation.status === 'pending' && (
          <div className="flex gap-3 pt-4">
            <Button 
              onClick={() => onAccept(invitation.id)}
              className="bg-green-600 hover:bg-green-700"
            >
              Accept Invitation
            </Button>
            <Button 
              variant="outline" 
              onClick={() => onDecline(invitation.id)}
              className="border-red-600 text-red-600 hover:bg-red-50"
            >
              Decline
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CoAuthorInvitation;
