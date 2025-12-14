
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, Play, FileText, Upload, CalendarPlus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
    <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50/50 hover:shadow-xl transition-all duration-300 group max-w-full overflow-hidden">
      <CardHeader className="pb-3 sm:pb-4 border-b border-gray-100 bg-white/80 backdrop-blur-sm p-3 sm:p-4 lg:p-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 sm:gap-4">
          <div className="flex items-center space-x-3 sm:space-x-4 min-w-0 flex-1">
            <div className="relative flex-shrink-0">
              <Avatar className="h-10 w-10 sm:h-12 sm:w-12 ring-2 ring-green-200 ring-offset-2">
                <AvatarImage 
                  src={person.imageUrl} 
                  alt={person.name}
                  className="object-cover" 
                />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold text-xs sm:text-sm">
                  {person.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-white rounded-full"></div>
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <CardTitle className="text-sm sm:text-lg lg:text-xl font-semibold text-gray-900 group-hover:text-purple-700 transition-colors truncate">
                {person.name}
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm text-gray-600 mt-1">
                <span className="px-2 py-1 bg-gray-100 rounded-full text-xs font-medium truncate inline-block max-w-full">{person.field}</span>
              </CardDescription>
            </div>
          </div>
          <div className="flex flex-col sm:items-end gap-2 flex-shrink-0">
            <div className="flex items-center gap-2">
              <StarRating rating={consultation.rating} />
            </div>
            <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-2 sm:px-3 py-1 text-xs font-medium shadow-sm w-fit">
              Completed
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {/* Session Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg">
            <div className="p-2 bg-blue-100 rounded-full">
              <Calendar className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-blue-800 uppercase tracking-wide">Date</p>
              <p className="text-sm font-semibold text-gray-900">{consultation.date}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg">
            <div className="p-2 bg-purple-100 rounded-full">
              <Clock className="h-4 w-4 text-purple-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-purple-800 uppercase tracking-wide">Time</p>
              <p className="text-sm font-semibold text-gray-900">{consultation.time}</p>
            </div>
          </div>
        </div>

        {/* Topic Section */}
        <div className="mb-6 p-4 bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl border border-gray-200">
          <p className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-2">Discussion Topic</p>
          <p className="text-gray-900 font-medium leading-relaxed">{consultation.topic}</p>
        </div>

        {/* Review Section */}
        {consultation.reviewText && (
          <div className="mb-6 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200">
            <p className="text-xs font-medium text-amber-800 uppercase tracking-wide mb-2">Session Review</p>
            <p className="text-gray-800 italic leading-relaxed">"{consultation.reviewText}"</p>
          </div>
        )}
        
        {/* Shared Resources */}
        {uploadedResources.length > 0 && (
          <div className="mb-4 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-200">
            <p className="text-xs font-medium text-emerald-800 uppercase tracking-wide mb-3">{resourceLabel}</p>
            <div className="flex flex-wrap gap-2">
              {uploadedResources.map((resource, index) => (
                <Badge key={index} className="bg-emerald-100 text-emerald-800 border-emerald-300 hover:bg-emerald-200 transition-colors px-3 py-1">
                  <FileText className="h-3 w-3 mr-1" />
                  {resource}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="border-t border-gray-100 bg-gray-50/50 px-6 py-4">
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <div className="flex flex-wrap gap-2 flex-1">
            {consultation.hasRecording && (
              // <Button 
              //   variant="outline" 
              //   onClick={() => onViewRecording(consultation.id)}
              //   className="group flex items-center gap-2 px-4 py-2 border-2 border-green-200 text-green-700 hover:bg-green-50 hover:border-green-400 transition-all duration-200 font-medium"
              // >
              //   <div className="p-1 bg-green-100 rounded-full group-hover:bg-green-200 transition-colors">
              //     <Play className="h-3 w-3" />
              //   </div>
              //   <span className="text-sm">Recording</span>
              // </Button>
            )}
            
            {consultation.hasAINotes && (
              // <Button 
              //   variant="outline" 
              //   onClick={() => onViewAINotes(consultation.id)}
              //   className="group flex items-center gap-2 px-4 py-2 border-2 border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-400 transition-all duration-200 font-medium"
              // >
              //   <div className="p-1 bg-blue-100 rounded-full group-hover:bg-blue-200 transition-colors">
              //     <FileText className="h-3 w-3" />
              //   </div>
              //   <span className="text-sm">AI Notes</span>
              // </Button>
            )}
            
            <Button 
              variant="outline" 
              onClick={() => onUploadResources(consultation.id)}
              className="group flex items-center gap-2 px-4 py-2 border-2 border-purple-200 text-purple-700 hover:bg-purple-50 hover:border-purple-400 transition-all duration-200 font-medium"
            >
              <div className="p-1 bg-purple-100 rounded-full group-hover:bg-purple-200 transition-colors">
                <Upload className="h-3 w-3" />
              </div>
              <span className="text-sm">{uploadButtonLabel}</span>
            </Button>

            {userRole === "student" && onFollowUpSession && (
              <Button 
                variant="outline" 
                onClick={() => onFollowUpSession(consultation.id)}
                className="group flex items-center gap-2 px-4 py-2 border-2 border-indigo-200 text-indigo-700 hover:bg-indigo-50 hover:border-indigo-400 transition-all duration-200 font-medium"
              >
                <div className="p-1 bg-indigo-100 rounded-full group-hover:bg-indigo-200 transition-colors">
                  <CalendarPlus className="h-3 w-3" />
                </div>
                <span className="text-sm">Follow-up Session</span>
              </Button>
            )}
          </div>
          
          <div className="flex items-center">
            <ContactDialog
              personName={person.name}
              personType={userRole === "student" ? "researcher" : "student"}
              consultationId={consultation.id}
              onSendMessage={onSendMessage}
              onOpenChat={onOpenChat}
              personId={person.id}
            />
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default PastConsultationCard;
