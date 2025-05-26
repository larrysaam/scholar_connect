
import { upcomingConsultations } from "../mockData";
import UpcomingConsultationCard from "../consultation/UpcomingConsultationCard";
import { useConsultationActions } from "@/hooks/useConsultationActions";
import { useDocumentUpload } from "@/hooks/useDocumentUpload";

const UpcomingTab = () => {
  const {
    isLoading: actionLoading,
    handleAcceptConsultation,
    handleDeclineConsultation,
    handleRescheduleWithGoogleCalendar,
    handleJoinWithGoogleMeet,
    handleViewRecording,
    handleViewAINotes,
    handleLiveDocumentReview
  } = useConsultationActions();

  const {
    uploadedDocuments,
    isUploading,
    handleUploadDocument
  } = useDocumentUpload();

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Upcoming Consultations</h2>
      
      {upcomingConsultations.length > 0 ? (
        <div className="space-y-6">
          {upcomingConsultations.map((consultation) => (
            <UpcomingConsultationCard
              key={consultation.id}
              consultation={consultation}
              uploadedDocuments={uploadedDocuments[consultation.id] || []}
              isUploading={isUploading[consultation.id] || false}
              actionLoading={actionLoading}
              onJoinWithGoogleMeet={handleJoinWithGoogleMeet}
              onLiveDocumentReview={handleLiveDocumentReview}
              onViewRecording={handleViewRecording}
              onViewAINotes={handleViewAINotes}
              onAcceptConsultation={handleAcceptConsultation}
              onDeclineConsultation={handleDeclineConsultation}
              onRescheduleWithGoogleCalendar={handleRescheduleWithGoogleCalendar}
              onUploadDocument={handleUploadDocument}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500">No upcoming consultations scheduled.</p>
        </div>
      )}
    </div>
  );
};

export default UpcomingTab;
