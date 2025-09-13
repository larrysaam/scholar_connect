import { useMemo, useState, useEffect } from 'react';
import UpcomingConsultationCard from "../consultation/UpcomingConsultationCard";
import { useConsultationActions } from "@/hooks/useConsultationActions";
import { useConsultationServices } from "@/hooks/useConsultationServices";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

interface SharedDocument {
  name: string;
  url: string;
}

const ITEMS_PER_PAGE = 5;

interface UpcomingTabProps {
  userRole: "student" | "researcher";
}

const UpcomingTab = ({ userRole }: UpcomingTabProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const {
    bookings,
    loading,
    refetch: fetchBookings,
  } = useConsultationServices();

  const [consultations, setConsultations] = useState<ServiceBooking[]>([]);
  const [isUploading, setIsUploading] = useState<{ [key: string]: boolean }>({});
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setConsultations(bookings);
  }, [bookings]);

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

  const handleUploadDocument = async (consultationId: string) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf,.doc,.docx,.jpg,.jpeg,.png,.txt';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file || !user) return;

      setIsUploading(prev => ({ ...prev, [consultationId]: true }));

      try {
        const filePath = `consultation_documents/${consultationId}/${user.id}/${file.name}`;
        
        const { error: uploadError } = await supabase.storage
          .from('lovable-uploads')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: true,
          });

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from('lovable-uploads')
          .getPublicUrl(filePath);

        if (!urlData.publicUrl) {
          throw new Error("Could not get public URL for the uploaded file.");
        }

        const { data: currentBooking, error: fetchError } = await supabase
          .from('service_bookings')
          .select('shared_documents')
          .eq('id', consultationId)
          .single();

        if (fetchError) throw fetchError;

        const existingDocs = currentBooking?.shared_documents || [];
        const newDoc = { name: file.name, url: urlData.publicUrl };

        const updatedDocs = [...existingDocs, newDoc];

        const { error: updateError } = await supabase
          .from('service_bookings')
          .update({ shared_documents: updatedDocs })
          .eq('id', consultationId);

        if (updateError) throw updateError;

        // Update local state
        setConsultations(prev => prev.map(c =>
          c.id === consultationId ? { ...c, shared_documents: updatedDocs } : c
        ));

        toast({ title: "Success", description: "Document uploaded successfully." });

      } catch (err: unknown) {
        console.error("Error uploading document:", err);
        toast({ title: "Upload Failed", description: err.message, variant: "destructive" });
      } finally {
        setIsUploading(prev => ({ ...prev, [consultationId]: false }));
      }
    };
    input.click();
  };

  const handleDeleteDocument = async (consultationId: string, documentUrl: string) => {
    try {
      const { data: currentBooking, error: fetchError } = await supabase
        .from('service_bookings')
        .select('shared_documents')
        .eq('id', consultationId)
        .single();

      if (fetchError) throw fetchError;

      const existingDocs = currentBooking?.shared_documents || [];
      const updatedDocs = existingDocs.filter((doc: any) => doc.url !== documentUrl);

      const { error: updateError } = await supabase
        .from('service_bookings')
        .update({ shared_documents: updatedDocs })
        .eq('id', consultationId);

      if (updateError) throw updateError;

      // Refresh consultations
      setConsultations(prev => prev.map(c =>
        c.id === consultationId ? { ...c, shared_documents: updatedDocs } : c
      ));

      toast({ title: "Success", description: "Document deleted successfully." });

    } catch (err: any) {
      console.error("Error deleting document:", err);
      toast({ title: "Deletion Failed", description: err.message, variant: "destructive" });
    }
  };

  const handleMarkAsComplete = async (consultation: any) => {
    try {
      // Determine which field to update based on userRole
      const fieldToUpdate = userRole === 'student' ? 'student_completed' : 'researcher_completed';
      const { error } = await supabase
        .from('service_bookings')
        .update({ [fieldToUpdate]: true })
        .eq('id', consultation.id);
      if (error) throw error;

      // Fetch the updated booking to check if both have completed
      const { data: updatedBooking, error: fetchError } = await supabase
        .from('service_bookings')
        .select('student_completed, researcher_completed, status')
        .eq('id', consultation.id)
        .single();
      if (fetchError) throw fetchError;

      // If both have marked as complete, set status to completed
      if (updatedBooking.student_completed && updatedBooking.researcher_completed && updatedBooking.status !== 'completed') {
        const { error: statusError } = await supabase
          .from('service_bookings')
          .update({ status: 'completed' })
          .eq('id', consultation.id);
        if (statusError) throw statusError;
      }

      // Update local state
      setConsultations(prev => prev.map(c =>
        c.id === consultation.id
          ? { ...c, [fieldToUpdate]: true, status: (updatedBooking.student_completed && updatedBooking.researcher_completed) ? 'completed' : c.status }
          : c
      ));
      toast({ title: 'Marked as Complete', description: 'Your completion has been recorded.' });
    } catch (err) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    }
  };

  const upcomingConsultations = useMemo(() => {
    return consultations
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
        clientId: booking.client_id, // Added clientId
        meetingLink: booking.meeting_link,
        academicLevel: booking.academic_level,
        duration: booking.duration_minutes,
        serviceTitle: booking.service?.title || 'N/A',
        sharedDocuments: booking.shared_documents || [],
        student_completed: booking.student_completed || false,
        researcher_completed: booking.researcher_completed || false,
      }));
  }, [consultations]);

  const paginatedConsultations = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return upcomingConsultations.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [upcomingConsultations, currentPage]);

  const totalPages = Math.ceil(upcomingConsultations.length / ITEMS_PER_PAGE);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
      <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Upcoming Consultations</h2>
      
      {paginatedConsultations.length > 0 ? (
        <>
          <div className="space-y-4 sm:space-y-6">
            {paginatedConsultations.map((consultation) => (
              <div key={consultation.id}>
                <UpcomingConsultationCard
                  consultation={consultation}
                  uploadedDocuments={consultation.sharedDocuments}
                  isUploading={isUploading[consultation.id] || false}
                  actionLoading={actionLoading}
                  onUploadDocument={() => handleUploadDocument(consultation.id)}
                  onJoinWithGoogleMeet={() => handleJoinWithGoogleMeet(consultation.id, consultation.meetingLink)}
                  onLiveDocumentReview={() => handleLiveDocumentReview(consultation.id)}
                  onViewRecording={() => handleViewRecording(consultation.id)}
                  onViewAINotes={() => handleViewAINotes(consultation.id)}
                  onAcceptConsultation={(comment) => handleAcceptConsultation(consultation.id, comment)}
                  onDeclineConsultation={(comment) => handleDeclineConsultation(consultation.id, comment)}
                  onRescheduleWithGoogleCalendar={() => handleRescheduleWithGoogleCalendar(consultation.id)}
                  onDeleteDocument={handleDeleteDocument}
                />
                {/* Mark as Complete Button for each user */}
                <div className="flex flex-col sm:flex-row justify-end mt-2 gap-2">
                  { !consultation.researcher_completed && (
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleMarkAsComplete(consultation)}
                      className="w-full sm:w-auto text-xs"
                    >
                      Mark as Complete
                    </Button>
                  )}
                  {consultation.researcher_completed && !consultation.student_completed && (
                    <Button size="sm" variant="secondary" disabled className="w-full sm:w-auto text-xs">
                      Waiting for Student
                    </Button>
                  )}
                  {consultation.student_completed && consultation.researcher_completed && (
                    <Button size="sm" variant="default" disabled className="w-full sm:w-auto text-xs">
                      Completed
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row justify-center sm:justify-end items-center mt-4 sm:mt-6 gap-2">
              <Button 
                variant="outline"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="w-full sm:w-auto text-xs"
              >
                Previous
              </Button>
              <span className="text-xs sm:text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              <Button 
                variant="outline"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="w-full sm:w-auto text-xs"
              >
                Next
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-6 sm:py-8">
          <p className="text-gray-500 text-sm">No upcoming consultations scheduled.</p>
        </div>
      )}
    </div>
  );
};

export default UpcomingTab;