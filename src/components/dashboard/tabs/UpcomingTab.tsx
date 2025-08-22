
import { useMemo } from 'react';
import UpcomingConsultationCard from "../consultation/UpcomingConsultationCard";
import { useConsultationActions } from "@/hooks/useConsultationActions";
import { useDocumentUpload } from "@/hooks/useDocumentUpload";
import { useConsultationServices, ServiceBooking } from "@/hooks/useConsultationServices";
import { Loader2 } from "lucide-react";

const UpcomingTab = () => {
  const {
    bookings,
    loading,
  } = useConsultationServices();

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
    uploadedDocuments = {},
    isUploading = {},
    handleUploadDocument
  } = useDocumentUpload();

  const upcomingConsultations = useMemo(() => {
    return bookings
      .filter(booking => booking.status === 'confirmed' && new Date(booking.scheduled_date) > new Date())
      .map(booking => ({
        id: booking.id,
        researcher: {
          id: booking.client_id,
          name: booking.client?.name || 'N/A',
          field: booking.service?.category || 'N/A',
          imageUrl: booking.client?.avatar_url || '/placeholder.svg',
        },
        date: new Date(booking.scheduled_date).toLocaleDateString(),
        time: booking.scheduled_time,
        topic: booking.service?.title || 'N/A',
        status: booking.status,
        meetingLink: booking.meeting_link,
        academicLevel: booking.academic_level,
        duration: booking.duration_minutes,
        serviceTitle: booking.service?.title || 'N/A',
      }));
  }, [bookings]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

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
              onJoinWithGoogleMeet={() => handleJoinWithGoogleMeet(consultation.id, consultation.meetingLink)}
              onLiveDocumentReview={() => handleLiveDocumentReview(consultation.id)}
              onViewRecording={() => handleViewRecording(consultation.id)}
              onViewAINotes={() => handleViewAINotes(consultation.id)}
              onAcceptConsultation={(comment) => handleAcceptConsultation(consultation.id, comment)}
              onDeclineConsultation={(comment) => handleDeclineConsultation(consultation.id, comment)}
              onRescheduleWithGoogleCalendar={() => handleRescheduleWithGoogleCalendar(consultation.id)}
              onUploadDocument={(file) => handleUploadDocument(consultation.id, file)}
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
