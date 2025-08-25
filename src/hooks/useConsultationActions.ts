
import { useState } from 'react';
import { CONSULTATION_CONSTANTS } from '@/constants/consultationConstants';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export const useConsultationActions = () => {
  const [isLoading, setIsLoading] = useState<{[key: string]: boolean}>({});
  const { toast } = useToast();

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

  const handleJoinWithGoogleMeet = (consultationId: string, meetingLink?: string | null) => {
    setActionLoading(`join-${consultationId}`, true);
    console.log("Joining with Google Meet for consultation:", consultationId);
    
    setTimeout(() => {
      if (meetingLink) {
        window.open(meetingLink, '_blank');
      } else {
        // Fallback or error handling
        console.warn("Meeting link not provided, opening default Meet page.");
        window.open(CONSULTATION_CONSTANTS.GOOGLE_MEET.BASE_URL, '_blank');
      }
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

  const handleLiveDocumentReview = async (consultationId: string) => {
    try {
      const { data, error } = await supabase
        .from('service_bookings')
        .select('shared_documents')
        .eq('id', consultationId)
        .single();

      if (error) throw error;

      const sharedDocs = data?.shared_documents || [];
      if (sharedDocs.length > 0) {
        const lastDoc = sharedDocs[sharedDocs.length - 1];
        let urlToOpen = lastDoc.url;
        // Remove http://localhost:8080/ if it exists
        if (urlToOpen.startsWith("http://localhost:8080/")) {
          urlToOpen = urlToOpen.substring("http://localhost:8080/".length);
        }
        window.open(urlToOpen, '_blank');
      } else {
        toast({ title: "No Documents", description: "No documents have been shared for this consultation yet.", variant: "default" });
      }
    } catch (err: any) {
      console.error("Error accessing live document review:", err);
      toast({ title: "Error", description: "Could not access the document.", variant: "destructive" });
    }
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
