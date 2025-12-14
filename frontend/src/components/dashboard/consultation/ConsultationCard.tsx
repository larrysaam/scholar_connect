import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, Video, MessageSquare, Upload, FileText, Loader2, X, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import ConsultationActions from "./ConsultationActions";
import LiveDocumentReviewDialog from "./LiveDocumentReviewDialog";

interface Consultation {
  id: string;
  status: string;
  datetime: string;
  duration: number;
  researcher: { id: string; name: string; title: string; avatar_url: string; };
  service: { title: string; };
  topic: string;
  meetLink?: string;
  sharedDocuments?: any[];
  student?: { id: string; name: string; title: string; avatar_url: string; researchSummary: string; };
}

interface SharedDocument {
  name: string;
  url: string;
}

interface ConsultationCardProps {
  consultation: Consultation;
  userType: "student" | "researcher";
  onJoinMeet: (consultationId: string) => void;
  onUploadDocument: (consultationId: string) => void;
  onSubmitDocumentLink: (consultationId: string, documentLink: string) => void;
  onContactResearcher: (researcherId: string, consultationId: string) => void;
  onContactStudent?: (studentId: string, consultationId: string) => void;
  onAccessDocument?: (documentLink: string) => void;
  onDeleteDocument?: (consultationId: string, documentUrl: string) => void;
  isUploading?: boolean;
}

const ConsultationCard = ({
  consultation,
  userType,
  onJoinMeet,
  onUploadDocument,
  onSubmitDocumentLink,
  onContactResearcher,
  onContactStudent,
  onAccessDocument,
  onDeleteDocument,
  isUploading = false,
}: ConsultationCardProps) => {
  const person = userType === "student" ? consultation.researcher : consultation.student;

  if (!person) return null;

  const handleAccessDocumentClick = (documentLink: string) => {
    let fullUrl = documentLink;
    if (!/^https?:\/\//i.test(documentLink)) {
      fullUrl = 'https://' + documentLink;
    }
    window.open(fullUrl, '_blank');
  };

  
  
  return (
    <Card className="max-w-full overflow-hidden">
      <CardHeader className="pb-2 p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-0">
          <div className="flex items-center space-x-3 sm:space-x-4 min-w-0 flex-1">
            <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full overflow-hidden flex-shrink-0">
              <img
                src={person.avatar_url}
                alt={person.name}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <CardTitle className="text-sm sm:text-base lg:text-lg truncate">{person.name}</CardTitle>
              <CardDescription className="text-xs sm:text-sm truncate">{person.title}</CardDescription>
              <p className="text-xs sm:text-sm font-semibold text-blue-600 mt-1 truncate">{consultation.service.title}</p>
            </div>
          </div>
          <Badge
            className={`text-xs px-2 py-1 flex-shrink-0 ${consultation.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}
          >
            {consultation.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-3 sm:p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
          <div className="flex items-center text-gray-700">
            <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-2 text-gray-500 flex-shrink-0" />
            <span className="text-xs sm:text-sm truncate">{new Date(consultation.datetime).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center text-gray-700">
            <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-2 text-gray-500 flex-shrink-0" />
            <span className="text-xs sm:text-sm truncate">{new Date(consultation.datetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        </div>
        <div className="mt-3 sm:mt-4">
          <p className="font-medium text-xs sm:text-sm">Topic:</p>
          <p className="text-gray-700 text-xs sm:text-sm leading-relaxed">{consultation.topic}</p>
        </div>

        {consultation.sharedDocuments && consultation.sharedDocuments.length > 0 && (
          <div className="mt-3 sm:mt-4">
            <p className="font-medium text-xs sm:text-sm text-blue-700">Documents Uploaded:</p>
            <div className="flex flex-wrap gap-1 sm:gap-2 mt-1">
              {consultation.sharedDocuments.map((doc: SharedDocument, index) => (
                <div key={index} className="flex items-center">
                  <Badge
                    variant="outline"
                    className="bg-blue-50 text-blue-700 hover:bg-blue-100 cursor-pointer text-xs px-2 py-1"
                    onClick={() => handleAccessDocumentClick(doc.url)}
                  >
                    <FileText className="h-3 w-3 mr-1 flex-shrink-0" />
                    <span className="truncate max-w-20 sm:max-w-none">{doc.name}</span>
                  </Badge>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 sm:h-5 sm:w-5 ml-1 flex-shrink-0"
                    onClick={() => onDeleteDocument?.(consultation.id, doc.url)}
                  >
                    <X className="h-2 w-2 sm:h-3 sm:w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row sm:justify-between border-t pt-3 sm:pt-4 p-3 sm:p-4 gap-3 sm:gap-0">
        <div className="flex gap-1 sm:gap-2 flex-wrap">
          {consultation.status === 'confirmed' && (
            <Button
              onClick={() => onJoinMeet(consultation.id)}
              className="bg-green-600 hover:bg-green-700 w-full sm:w-auto text-xs sm:text-sm px-3 sm:px-4 py-2"
            >
              <Video className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 flex-shrink-0" />
              <span className="truncate">Join Meeting</span>
            </Button>
          )}

          <Button
            variant="outline"
            onClick={() => onUploadDocument(consultation.id)}
            disabled={isUploading}
            className="w-full sm:w-auto text-xs sm:text-sm px-3 sm:px-4 py-2"
          >
            {isUploading ? (
              <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 animate-spin flex-shrink-0" />
            ) : (
              <Upload className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 flex-shrink-0" />
            )}
            <span className="truncate">Upload Document</span>
          </Button>
{/* 
          {userType === "student" && (
            <div className="w-full sm:w-auto">
              <LiveDocumentReviewDialog
                consultationId={consultation.id}
                onSubmitDocumentLink={onSubmitDocumentLink}
              />
            </div>
          )} */}

          <Button
            variant="outline"
            onClick={() => userType === "student"
              ? onContactResearcher(person.id, consultation.id)
              : onContactStudent?.(person.id, consultation.id)
            }
            className="w-full sm:w-auto text-xs sm:text-sm px-3 sm:px-4 py-2"
          >
            <MessageSquare className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 flex-shrink-0" />
            <span className="truncate">Contact {userType === "student" ? "Researcher" : "Student"}</span>
          </Button>
        </div>

        {userType === "researcher" && consultation.student && (
          <div className="w-full sm:w-auto">
            <Button
              variant="outline"
              className="w-full sm:w-auto text-xs sm:text-sm px-3 sm:px-4 py-2"
            >
              <User className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 flex-shrink-0" />
              <span className="truncate">Student Info</span>
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default ConsultationCard;