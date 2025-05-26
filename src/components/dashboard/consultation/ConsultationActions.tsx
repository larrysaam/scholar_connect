
import { Button } from "@/components/ui/button";
import { Video, Upload, FileText, CalendarPlus, MessageSquare } from "lucide-react";

interface Consultation {
  id: string;
  researcher: {
    id: string;
    name: string;
    field: string;
    imageUrl: string;
  };
  date: string;
  time: string;
  topic: string;
  status: string;
}

interface ConsultationActionsProps {
  consultation: Consultation;
  onJoinMeet: (consultationId: string) => void;
  onUploadDocument: (consultationId: string) => void;
  onLiveDocumentReview: (consultationId: string) => void;
  onFollowUpSession: (consultationId: string) => void;
  onContactResearcher: (researcherId: string, consultationId: string) => void;
}

const ConsultationActions = ({
  consultation,
  onJoinMeet,
  onUploadDocument,
  onLiveDocumentReview,
  onFollowUpSession,
  onContactResearcher
}: ConsultationActionsProps) => {
  return (
    <div className="flex gap-2 flex-wrap">
      {consultation.status === 'confirmed' && (
        <Button 
          onClick={() => onJoinMeet(consultation.id)}
          className="bg-green-600 hover:bg-green-700"
        >
          <Video className="h-4 w-4 mr-2" />
          Join with Google Meet
        </Button>
      )}
      
      <Button 
        variant="outline" 
        onClick={() => onUploadDocument(consultation.id)}
      >
        <Upload className="h-4 w-4 mr-2" />
        Upload Document
      </Button>
      
      <Button 
        variant="outline" 
        onClick={() => onLiveDocumentReview(consultation.id)}
      >
        <FileText className="h-4 w-4 mr-2" />
        Live Document Review
      </Button>
      
      <Button 
        variant="outline" 
        onClick={() => onFollowUpSession(consultation.id)}
      >
        <CalendarPlus className="h-4 w-4 mr-2" />
        Follow-up Session
      </Button>
      
      <Button 
        variant="outline" 
        onClick={() => onContactResearcher(consultation.researcher.id, consultation.id)}
      >
        <MessageSquare className="h-4 w-4 mr-2" />
        Contact Researcher
      </Button>
    </div>
  );
};

export default ConsultationActions;
