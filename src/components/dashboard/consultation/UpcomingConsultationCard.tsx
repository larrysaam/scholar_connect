
import { memo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, Video, Upload, Check, X, FileText, Play, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import StudentResearchSummaryModal from "./StudentResearchSummaryModal";
import ConsultationResponseDialog from "./ConsultationResponseDialog";

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
  status: 'confirmed' | 'pending';
}

interface UpcomingConsultationCardProps {
  consultation: Consultation;
  uploadedDocuments: string[];
  isUploading?: boolean;
  actionLoading?: {[key: string]: boolean};
  onJoinWithGoogleMeet: (consultationId: string) => void;
  onLiveDocumentReview: (consultationId: string) => void;
  onViewRecording: (consultationId: string) => void;
  onViewAINotes: (consultationId: string) => void;
  onAcceptConsultation: (consultationId: string, comment: string) => void;
  onDeclineConsultation: (consultationId: string, comment: string) => void;
  onRescheduleWithGoogleCalendar: (consultationId: string) => void;
  onUploadDocument: (consultationId: string) => void;
}

const UpcomingConsultationCard = memo(({
  consultation,
  uploadedDocuments,
  isUploading = false,
  actionLoading = {},
  onJoinWithGoogleMeet,
  onLiveDocumentReview,
  onViewRecording,
  onViewAINotes,
  onAcceptConsultation,
  onDeclineConsultation,
  onRescheduleWithGoogleCalendar,
  onUploadDocument,
}: UpcomingConsultationCardProps) => {
  const isJoinLoading = actionLoading[`join-${consultation.id}`];
  const isRescheduleLoading = actionLoading[`reschedule-${consultation.id}`];
  const isRecordingLoading = actionLoading[`recording-${consultation.id}`];

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-4">
            <div className="h-10 w-10 rounded-full overflow-hidden">
              <img 
                src={consultation.researcher.imageUrl} 
                alt={consultation.researcher.name}
                className="h-full w-full object-cover" 
              />
            </div>
            <div>
              <CardTitle className="text-lg">Student: {consultation.researcher.name}</CardTitle>
              <CardDescription>Field: {consultation.researcher.field}</CardDescription>
            </div>
          </div>
          <Badge className={consultation.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
            {consultation.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center text-gray-700">
            <Calendar className="h-4 w-4 mr-2 text-gray-500" />
            <span>{consultation.date}</span>
          </div>
          <div className="flex items-center text-gray-700">
            <Clock className="h-4 w-4 mr-2 text-gray-500" />
            <span>{consultation.time}</span>
          </div>
        </div>
        <div className="mt-4">
          <p className="font-medium">Consultation Title:</p>
          <p className="text-gray-700">{consultation.topic}</p>
        </div>
        
        {uploadedDocuments.length > 0 && (
          <div className="mt-4">
            <p className="font-medium text-sm text-green-700">Uploaded Documents:</p>
            <div className="flex flex-wrap gap-2 mt-1">
              {uploadedDocuments.map((doc, index) => (
                <Badge key={index} variant="outline" className="bg-green-50 text-green-700">
                  {doc}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4">
        <div className="flex gap-2 flex-wrap">
          {consultation.status === 'confirmed' ? (
            <>
              <Button 
                onClick={() => onJoinWithGoogleMeet(consultation.id)}
                disabled={isJoinLoading}
                className="bg-green-600 hover:bg-green-700"
              >
                {isJoinLoading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Video className="h-4 w-4 mr-2" />
                )}
                Join with Google Meet
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
                onClick={() => onViewRecording(consultation.id)}
                disabled={isRecordingLoading}
              >
                {isRecordingLoading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Play className="h-4 w-4 mr-2" />
                )}
                View Recording
              </Button>
              <Button 
                variant="outline" 
                onClick={() => onViewAINotes(consultation.id)}
              >
                <FileText className="h-4 w-4 mr-2" />
                View AI Notes
              </Button>
            </>
          ) : (
            <>
              <ConsultationResponseDialog
                type="accept"
                consultationId={consultation.id}
                onSubmit={onAcceptConsultation}
                trigger={
                  <Button className="bg-green-600 hover:bg-green-700">
                    <Check className="h-4 w-4 mr-2" />
                    Accept
                  </Button>
                }
              />
              <ConsultationResponseDialog
                type="decline"
                consultationId={consultation.id}
                onSubmit={onDeclineConsultation}
                trigger={
                  <Button 
                    variant="outline" 
                    className="border-red-600 text-red-600 hover:bg-red-50"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Decline
                  </Button>
                }
              />
            </>
          )}
          
          <Button 
            variant="outline" 
            onClick={() => onRescheduleWithGoogleCalendar(consultation.id)}
            disabled={isRescheduleLoading}
          >
            {isRescheduleLoading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Calendar className="h-4 w-4 mr-2" />
            )}
            Reschedule with Google Calendar
          </Button>
          <Button 
            variant="outline" 
            onClick={() => onUploadDocument(consultation.id)}
            disabled={isUploading}
          >
            {isUploading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Upload className="h-4 w-4 mr-2" />
            )}
            Upload Document
          </Button>
          
          <StudentResearchSummaryModal 
            studentId={`student-${consultation.id}`}
            consultationId={consultation.id}
          />
        </div>
      </CardFooter>
    </Card>
  );
});

UpcomingConsultationCard.displayName = 'UpcomingConsultationCard';

export default UpcomingConsultationCard;
