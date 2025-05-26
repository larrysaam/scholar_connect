
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, Video, MessageSquare, Upload, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import ConsultationActions from "./ConsultationActions";
import LiveDocumentReviewDialog from "./LiveDocumentReviewDialog";
import StudentInfoModal from "../StudentInfoModal";

interface Consultation {
  id: string;
  student?: {
    id: string;
    name: string;
    field: string;
    imageUrl: string;
    researchSummary?: {
      level: string;
      researchTitle: string;
      projectLocation: string;
      problemStatement: string;
      researchQuestions: string;
      objectives: string;
      hypotheses: string;
      methodology: string;
      comments: string;
    };
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
  status: string;
  sharedDocumentLink?: string;
}

interface ConsultationCardProps {
  consultation: Consultation;
  uploadedDocuments: string[];
  userType: "student" | "researcher";
  onJoinMeet: (consultationId: string) => void;
  onUploadDocument: (consultationId: string) => void;
  onSubmitDocumentLink: (consultationId: string, documentLink: string) => void;
  onContactResearcher: (researcherId: string, consultationId: string) => void;
  onContactStudent?: (studentId: string, consultationId: string) => void;
  onAccessDocument?: (documentLink: string) => void;
}

const ConsultationCard = ({
  consultation,
  uploadedDocuments,
  userType,
  onJoinMeet,
  onUploadDocument,
  onSubmitDocumentLink,
  onContactResearcher,
  onContactStudent,
  onAccessDocument
}: ConsultationCardProps) => {
  const person = userType === "student" ? consultation.researcher : consultation.student;
  
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
        
        {uploadedDocuments.length > 0 && (
          <div className="mt-4">
            <p className="font-medium text-sm text-blue-700">Documents Uploaded:</p>
            <div className="flex flex-wrap gap-2 mt-1">
              {uploadedDocuments.map((doc, index) => (
                <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700">
                  {doc}
                </Badge>
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
          >
            <Upload className="h-4 w-4 mr-2" />
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
