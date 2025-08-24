import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, Video, MessageSquare, Upload, FileText, Loader2, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import ConsultationActions from "./ConsultationActions";
import LiveDocumentReviewDialog from "./LiveDocumentReviewDialog";
import StudentInfoModal from "../StudentInfoModal";

interface Consultation {
  id: string;
  status: string;
  datetime: string;
  duration: number;
  researcher: { id: string; name: string; title: string; imageUrl: string; };
  service: { title: string; };
  topic: string;
  meetLink?: string;
  sharedDocuments?: any[];
  student?: { id: string; name: string; title: string; imageUrl: string; researchSummary: string; };
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
              <CardDescription>{person.title}</CardDescription>
              <p className="text-sm font-semibold text-blue-600 mt-1">{consultation.service.title}</p>
            </div>
          </div>
          <Badge
            className={consultation.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}
          >
            {consultation.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center text-gray-700">
            <Calendar className="h-4 w-4 mr-2 text-gray-500" />
            <span>{new Date(consultation.datetime).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center text-gray-700">
            <Clock className="h-4 w-4 mr-2 text-gray-500" />
            <span>{new Date(consultation.datetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        </div>
        <div className="mt-4">
          <p className="font-medium">Topic:</p>
          <p className="text-gray-700">{consultation.topic}</p>
        </div>

        {consultation.sharedDocuments && consultation.sharedDocuments.length > 0 && (
          <div className="mt-4">
            <p className="font-medium text-sm text-blue-700">Documents Uploaded:</p>
            <div className="flex flex-wrap gap-2 mt-1">
              {consultation.sharedDocuments.map((doc: SharedDocument, index) => (
                <div key={index} className="flex items-center">
                  <Badge
                    variant="outline"
                    className="bg-blue-50 text-blue-700 hover:bg-blue-100 cursor-pointer"
                    onClick={() => handleAccessDocumentClick(doc.url)}
                  >
                    <FileText className="h-3 w-3 mr-1" />
                    {doc.name}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5 ml-1"
                    onClick={() => onDeleteDocument?.(consultation.id, doc.url)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {consultation.sharedDocumentLink && userType === "researcher" && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="font-medium text-sm text-blue-700 mb-2">Shared Document:</p>
            <Button
              onClick={() => onAccessDocument?.(consultation.sharedDocumentLink!)}
              variant="outline"
              size="sm"
              className="text-blue-700 border-blue-300"
            >
              <FileText className="h-4 w-4 mr-2" />
              Access Google Doc
            </Button>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4">
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
            disabled={isUploading}
          >
            {isUploading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Upload className="h-4 w-4 mr-2" />
            )}
            Upload Document
          </Button>

          {userType === "student" && (
            <LiveDocumentReviewDialog
              consultationId={consultation.id}
              onSubmitDocumentLink={onSubmitDocumentLink}
            />
          )}

          <Button
            variant="outline"
            onClick={() => userType === "student"
              ? onContactResearcher(person.id, consultation.id)
              : onContactStudent?.(person.id, consultation.id)
            }
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            Contact {userType === "student" ? "Researcher" : "Student"}
          </Button>

          {userType === "researcher" && consultation.student && (
            <StudentInfoModal
              studentName={consultation.student.name}
              researchSummary={consultation.student.researchSummary}
            />
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default ConsultationCard;