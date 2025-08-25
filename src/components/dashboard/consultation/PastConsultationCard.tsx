
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, Play, FileText, Upload, CalendarPlus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import StarRating from "./StarRating";
import ContactDialog from "./ContactDialog";

interface PastConsultation {
  id: string;
  student?: {
    id: string;
    name: string;
    field: string;
    imageUrl: string;
  };
  researcher?: {
    id: string;
    name: string;
    field: string;
    imageUrl: string;
  };
  date: string;
  time: string;
  topic: string;
  status: "completed";
  rating: number;
  reviewText?: string; // Added reviewText
  hasRecording: boolean;
  hasAINotes: boolean;
}

interface PastConsultationCardProps {
  consultation: PastConsultation;
  uploadedResources: string[];
  userRole: "student" | "researcher";
  onViewRecording: (consultationId: string) => void;
  onViewAINotes: (consultationId: string) => void;
  onUploadResources: (consultationId: string) => void;
  onSendMessage: (consultationId: string, message: string) => void;
  onOpenChat: (personId: string, consultationId: string) => void;
  onFollowUpSession?: (consultationId: string) => void;
}

const PastConsultationCard = ({
  consultation,
  uploadedResources,
  userRole,
  onViewRecording,
  onViewAINotes,
  onUploadResources,
  onSendMessage,
  onOpenChat,
  onFollowUpSession
}: PastConsultationCardProps) => {
  const person = userRole === "student" ? consultation.researcher : consultation.student;
  const resourceLabel = userRole === "student" ? "Resources Shared" : "Additional Resources Shared";
  const uploadButtonLabel = userRole === "student" ? "Share Resources" : "Upload Resources";

  if (!person) return null;

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-4">
            <div className="h-10 w-10 rounded-full overflow-hidden">
              <img 
                src={person.imageUrl} 
                alt={person.name}
                className="h-full w-full object-cover" 
              />
            </div>
            <div>
              <CardTitle className="text-lg">{person.name}</CardTitle>
              <CardDescription>{person.field}</CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <StarRating rating={consultation.rating} />
            <Badge className="bg-green-100 text-green-800">
              {consultation.status}
            </Badge>
          </div>
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
          <p className="font-medium">Topic:</p>
          <p className="text-gray-700">{consultation.topic}</p>
        </div>

        {consultation.reviewText && (
          <div className="mt-4">
            <p className="font-medium">Review:</p>
            <p className="text-gray-700 italic">"{consultation.reviewText}"</p>
          </div>
        )}
        
        {uploadedResources.length > 0 && (
          <div className="mt-4">
            <p className="font-medium text-sm text-blue-700">{resourceLabel} (Preview Only):</p>
            <div className="flex flex-wrap gap-2 mt-1">
              {uploadedResources.map((resource, index) => (
                <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700">
                  {resource}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4">
        <div className="flex gap-2 flex-wrap">
          {consultation.hasRecording && (
            <Button 
              variant="outline" 
              onClick={() => onViewRecording(consultation.id)}
            >
              <Play className="h-4 w-4 mr-2" />
              View Recording
            </Button>
          )}
          
          {consultation.hasAINotes && (
            <Button 
              variant="outline" 
              onClick={() => onViewAINotes(consultation.id)}
            >
              <FileText className="h-4 w-4 mr-2" />
              View AI Notes
            </Button>
          )}
          
          <ContactDialog
            personName={person.name}
            personType={userRole === "student" ? "researcher" : "student"}
            consultationId={consultation.id}
            onSendMessage={onSendMessage}
            onOpenChat={onOpenChat}
            personId={person.id}
          />
          
          <Button 
            variant="outline" 
            onClick={() => onUploadResources(consultation.id)}
          >
            <Upload className="h-4 w-4 mr-2" />
            {uploadButtonLabel}
          </Button>

          {userRole === "student" && onFollowUpSession && (
            <Button 
              variant="outline" 
              onClick={() => onFollowUpSession(consultation.id)}
            >
              <CalendarPlus className="h-4 w-4 mr-2" />
              Follow-up Session
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default PastConsultationCard;
