
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import DocumentDisplay from "./DocumentDisplay";
import ConsultationActions from "./ConsultationActions";

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

interface ConsultationCardProps {
  consultation: Consultation;
  uploadedDocuments: string[];
  onJoinMeet: (consultationId: string) => void;
  onUploadDocument: (consultationId: string) => void;
  onSubmitDocumentLink: (consultationId: string, documentLink: string) => void;
  onContactResearcher: (researcherId: string, consultationId: string) => void;
}

const ConsultationCard = ({
  consultation,
  uploadedDocuments,
  onJoinMeet,
  onUploadDocument,
  onSubmitDocumentLink,
  onContactResearcher
}: ConsultationCardProps) => {
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
              <CardTitle className="text-lg">{consultation.researcher.name}</CardTitle>
              <CardDescription>{consultation.researcher.field}</CardDescription>
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
          <p className="font-medium">Topic:</p>
          <p className="text-gray-700">{consultation.topic}</p>
        </div>
        
        <DocumentDisplay documents={uploadedDocuments} />
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4">
        <ConsultationActions
          consultation={consultation}
          onJoinMeet={onJoinMeet}
          onUploadDocument={onUploadDocument}
          onSubmitDocumentLink={onSubmitDocumentLink}
          onContactResearcher={onContactResearcher}
        />
      </CardFooter>
    </Card>
  );
};

export default ConsultationCard;
