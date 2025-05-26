
import { useState } from 'react';
import { CONSULTATION_CONSTANTS } from '@/constants/consultationConstants';

export const useConsultationActions = () => {
  const [isLoading, setIsLoading] = useState<{[key: string]: boolean}>({});

  const setActionLoading = (action: string, loading: boolean) => {
    setIsLoading(prev => ({ ...prev, [action]: loading }));
  };

  const handleAcceptConsultation = (consultationId: string, comment: string) => {
    console.log("Accepting consultation:", { consultationId, comment });
    alert(`${CONSULTATION_CONSTANTS.MESSAGES.CONSULTATION_ACCEPTED} "${comment}"`);
  };

  const handleDeclineConsultation = (consultationId: string, comment: string) => {
    console.log("Declining consultation:", { consultationId, comment });
    alert(`${CONSULTATION_CONSTANTS.MESSAGES.CONSULTATION_DECLINED} "${comment}"`);
  };

  const handleRescheduleWithGoogleCalendar = (consultationId: string) => {
    setActionLoading(`reschedule-${consultationId}`, true);
    console.log("Rescheduling consultation with Google Calendar:", consultationId);
    
    setTimeout(() => {
      window.open(CONSULTATION_CONSTANTS.GOOGLE_MEET.CALENDAR_URL, '_blank');
      alert(CONSULTATION_CONSTANTS.MESSAGES.GOOGLE_CALENDAR_OPENED);
      setActionLoading(`reschedule-${consultationId}`, false);
    }, 500);
  };

  const handleJoinWithGoogleMeet = (consultationId: string) => {
    setActionLoading(`join-${consultationId}`, true);
    console.log("Joining with Google Meet for consultation:", consultationId);
    
    setTimeout(() => {
      window.open(CONSULTATION_CONSTANTS.GOOGLE_MEET.BASE_URL, '_blank');
      setActionLoading(`join-${consultationId}`, false);
    }, 500);
  };

  const handleViewRecording = (consultationId: string) => {
    setActionLoading(`recording-${consultationId}`, true);
    console.log("Viewing Google Meet recording for consultation:", consultationId);
    
    setTimeout(() => {
      const recordingUrl = `${CONSULTATION_CONSTANTS.RECORDINGS.BASE_URL}${consultationId}`;
      window.open(recordingUrl, '_blank');
      setActionLoading(`recording-${consultationId}`, false);
    }, 500);
  };

  const handleViewAINotes = (consultationId: string) => {
    console.log(`${CONSULTATION_CONSTANTS.MESSAGES.AI_NOTES_OPENING}:`, consultationId);
    alert(`${CONSULTATION_CONSTANTS.MESSAGES.AI_NOTES_OPENING} ${consultationId}...`);
  };

  const handleLiveDocumentReview = (consultationId: string) => {
    console.log("Accessing live document review for consultation:", consultationId);
    alert(CONSULTATION_CONSTANTS.MESSAGES.LIVE_DOCUMENT_OPENING);
  };

  return {
    isLoading,
    handleAcceptConsultation,
    handleDeclineConsultation,
    handleRescheduleWithGoogleCalendar,
    handleJoinWithGoogleMeet,
    handleViewRecording,
    handleViewAINotes,
    handleLiveDocumentReview
  };
};
