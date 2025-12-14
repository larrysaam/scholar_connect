
import { memo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, Video, Upload, Check, X, FileText, Play, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  clientId: string; // Added clientId
}

interface SharedDocument {
  name: string;
  url: string;
}

interface UpcomingConsultationCardProps {
  consultation: Consultation;
  uploadedDocuments: SharedDocument[]; // Changed type
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
  onDeleteDocument?: (consultationId: string, documentUrl: string) => void;
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
  onDeleteDocument,
}: UpcomingConsultationCardProps) => {
  const isJoinLoading = actionLoading[`join-${consultation.id}`];
  const isRescheduleLoading = actionLoading[`reschedule-${consultation.id}`];
  const isRecordingLoading = actionLoading[`recording-${consultation.id}`];

  const handleAccessDocumentClick = (documentLink: string) => {
    let fullUrl = documentLink;
    if (!/^https?:\/\//i.test(documentLink)) {
      fullUrl = 'https://' + documentLink;
    }
    window.open(fullUrl, '_blank');
  };

  return (
    <Card className="border-0 shadow-none bg-transparent">
      <CardHeader className="pb-6 px-6 pt-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Avatar className="h-14 w-14 ring-2 ring-blue-200 ring-offset-2">
                <AvatarImage 
                  src={consultation.researcher.imageUrl} 
                  alt={consultation.researcher.name}
                  className="object-cover" 
                />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-600 text-white font-semibold">
                  {consultation.researcher.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-500 rounded-full border-2 border-white flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              </div>
            </div>
            <div>
              <CardTitle className="text-lg sm:text-xl font-semibold text-gray-900 mb-1">
                Student: {consultation.researcher.name}
              </CardTitle>
              <CardDescription className="text-sm text-gray-600">
                <span className="px-2 py-1 bg-blue-100 rounded-full text-xs font-medium text-blue-800">
                  {consultation.researcher.field}
                </span>
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center">
            <Badge className={`px-4 py-2 text-xs font-semibold rounded-full ${
              consultation.status === 'confirmed' 
                ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-200' 
                : 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-200'
            }`}>
              {consultation.status === 'confirmed' ? 'Confirmed' : 'Pending'}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-6 pb-6">
        {/* Session Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
            <div className="p-3 bg-blue-100 rounded-full">
              <Calendar className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-blue-800 uppercase tracking-wide">Session Date</p>
              <p className="text-sm font-semibold text-gray-900">{consultation.date}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-200">
            <div className="p-3 bg-purple-100 rounded-full">
              <Clock className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-purple-800 uppercase tracking-wide">Session Time</p>
              <p className="text-sm font-semibold text-gray-900">{consultation.time}</p>
            </div>
          </div>
        </div>

        {/* Topic Section */}
        <div className="mb-6 p-4 bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl border border-gray-200">
          <p className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-2">Consultation Topic</p>
          <p className="text-gray-900 font-medium leading-relaxed">{consultation.topic}</p>
        </div>
        
        {/* Uploaded Documents Section */}
        {uploadedDocuments.length > 0 && (
          <div className="mb-6 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-200">
            <p className="text-xs font-medium text-emerald-800 uppercase tracking-wide mb-3">Shared Documents</p>
            <div className="flex flex-wrap gap-3">
              {uploadedDocuments.map((doc, index) => (
                <div key={index} className="group flex items-center gap-2 bg-white rounded-lg p-2 border border-emerald-300 hover:border-emerald-400 transition-all duration-200">
                  <Badge
                    variant="outline"
                    className="bg-emerald-100 text-emerald-800 border-emerald-300 hover:bg-emerald-200 cursor-pointer px-3 py-1"
                    onClick={() => handleAccessDocumentClick(doc.url)}
                  >
                    <FileText className="h-3 w-3 mr-1" />
                    <span className="text-xs font-medium">{doc.name}</span>
                  </Badge>
                  {onDeleteDocument && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-100 hover:text-red-600"
                      onClick={() => onDeleteDocument(consultation.id, doc.url)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="px-6 pb-6">
        <div className="flex flex-col gap-4 w-full">
          {consultation.status === 'confirmed' ? (
            <div className="flex flex-wrap gap-3">
              <Button 
                onClick={() => onJoinWithGoogleMeet(consultation.id)}
                disabled={isJoinLoading}
                className="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 shadow-lg shadow-green-200 hover:shadow-green-300 transition-all duration-200 font-medium"
              >
                {isJoinLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <div className="p-1 bg-white/20 rounded-full group-hover:bg-white/30 transition-colors">
                    <Video className="h-4 w-4" />
                  </div>
                )}
                <span>Join Meeting</span>
              </Button>


              <Button 
              variant="outline" 
              onClick={() => onUploadDocument(consultation.id)}
              disabled={isUploading}
              className="group flex items-center gap-2 px-4 py-2 border-2 border-teal-200 text-teal-700 hover:bg-teal-50 hover:border-teal-400 transition-all duration-200 font-medium"
            >
              {isUploading ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <div className="p-1 bg-teal-100 rounded-full group-hover:bg-teal-200 transition-colors">
                  <Upload className="h-3 w-3" />
                </div>
              )}
              <span className="text-sm">Upload Document</span>
            </Button>
              
              {/* <Button 
                variant="outline" 
                onClick={() => onLiveDocumentReview(consultation.id)}
                className="group flex items-center gap-2 px-4 py-2 border-2 border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-400 transition-all duration-200 font-medium"
              >
                <div className="p-1 bg-blue-100 rounded-full group-hover:bg-blue-200 transition-colors">
                  <FileText className="h-3 w-3" />
                </div>
                <span className="text-sm">Live Review</span>
              </Button> */}
              
              {/* <Button 
                variant="outline" 
                onClick={() => onViewRecording(consultation.id)}
                disabled={isRecordingLoading}
                className="group flex items-center gap-2 px-4 py-2 border-2 border-purple-200 text-purple-700 hover:bg-purple-50 hover:border-purple-400 transition-all duration-200 font-medium"
              >
                {isRecordingLoading ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <div className="p-1 bg-purple-100 rounded-full group-hover:bg-purple-200 transition-colors">
                    <Play className="h-3 w-3" />
                  </div>
                )}
                <span className="text-sm">Recording</span>
              </Button> */}
              
              {/* <Button 
                variant="outline" 
                onClick={() => onViewAINotes(consultation.id)}
                className="group flex items-center gap-2 px-4 py-2 border-2 border-indigo-200 text-indigo-700 hover:bg-indigo-50 hover:border-indigo-400 transition-all duration-200 font-medium"
              >
                <div className="p-1 bg-indigo-100 rounded-full group-hover:bg-indigo-200 transition-colors">
                  <FileText className="h-3 w-3" />
                </div>
                <span className="text-sm">AI Notes</span>
              </Button> */}
            </div>
          ) : (
            <div className="flex flex-wrap gap-3">
              <ConsultationResponseDialog
                type="accept"
                consultationId={consultation.id}
                onSubmit={onAcceptConsultation}
                trigger={
                  <Button className="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 shadow-lg shadow-green-200 hover:shadow-green-300 transition-all duration-200 font-medium">
                    <div className="p-1 bg-white/20 rounded-full group-hover:bg-white/30 transition-colors">
                      <Check className="h-4 w-4" />
                    </div>
                    <span>Accept</span>
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
                    className="group flex items-center gap-2 px-6 py-3 border-2 border-red-200 text-red-700 hover:bg-red-50 hover:border-red-400 transition-all duration-200 font-medium"
                  >
                    <div className="p-1 bg-red-100 rounded-full group-hover:bg-red-200 transition-colors">
                      <X className="h-4 w-4" />
                    </div>
                    <span>Decline</span>
                  </Button>
                }
              />
            </div>
          )}
          
          {/* Additional Actions */}
          <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-100">
            {/* <Button 
              variant="outline" 
              onClick={() => onRescheduleWithGoogleCalendar(consultation.id)}
              disabled={isRescheduleLoading}
              className="group flex items-center gap-2 px-4 py-2 border-2 border-amber-200 text-amber-700 hover:bg-amber-50 hover:border-amber-400 transition-all duration-200 font-medium"
            >
              {isRescheduleLoading ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <div className="p-1 bg-amber-100 rounded-full group-hover:bg-amber-200 transition-colors">
                  <Calendar className="h-3 w-3" />
                </div>
              )}
              <span className="text-sm">Reschedule</span>
            </Button> */}
            
            
          </div>
          
          <StudentResearchSummaryModal 
            studentId={consultation.clientId}
            consultationId={consultation.id}
          />
        </div>
      </CardFooter>
    </Card>
  );
});

UpcomingConsultationCard.displayName = 'UpcomingConsultationCard';

export default UpcomingConsultationCard;
