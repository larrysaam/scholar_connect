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
  const { toast } = useToast();  const {
    bookings,
    loading,
  } = useConsultationServices();

  const [consultations, setConsultations] = useState<any[]>([]);
  const [isUploading, setIsUploading] = useState<{ [key: string]: boolean }>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  useEffect(() => {
    setConsultations(bookings);
  }, [bookings]);

  // Refetch bookings when refetchTrigger changes
  useEffect(() => {
    if (refetchTrigger > 0 && user) {
      const refetchBookings = async () => {
        const { data, error } = await supabase
          .from('service_bookings')
          .select(`*, client:users!service_bookings_client_id_fkey(name, email, avatar_url), provider:users!service_bookings_provider_id_fkey(name, email, avatar_url), service:consultation_services(title, category)`)
          .eq(userRole === 'student' ? 'client_id' : 'provider_id', user.id)
          .order('scheduled_date', { ascending: true });

        if (!error && data) {
          setConsultations(data);
        }
      };
      refetchBookings();
    }
  }, [refetchTrigger, user, userRole]);

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
      if (!file || !user) return;      setIsUploading(prev => ({ ...prev, [consultationId]: true }));

      try {
        // Add timestamp to filename to ensure uniqueness and avoid conflicts
        const timestamp = Date.now();
        const fileExtension = file.name.split('.').pop();
        const fileNameWithoutExt = file.name.replace(`.${fileExtension}`, '');
        const uniqueFileName = `${fileNameWithoutExt}_${timestamp}.${fileExtension}`;
        const filePath = `consultation_documents/${consultationId}/${user.id}/${uniqueFileName}`;
        
        const { error: uploadError } = await supabase.storage
          .from('lovable-uploads')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false, // Changed to false to avoid RLS issues
          });

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from('lovable-uploads')
          .getPublicUrl(filePath);        if (!urlData.publicUrl) {
          throw new Error("Could not get public URL for the uploaded file.");
        }

        // Create new document object
        const newDoc = { 
          name: file.name, 
          url: urlData.publicUrl,
          size: file.size,
          uploadedAt: new Date().toISOString()
        };

        // Fetch current shared_documents from database
        const { data: currentBooking, error: fetchError } = await supabase
          .from('service_bookings')
          .select('shared_documents')
          .eq('id', consultationId)
          .single();

        if (fetchError) throw fetchError;

        // Append new document to existing documents
        const updatedDocuments = [...(currentBooking?.shared_documents || []), newDoc];

        // Update database with new document
        const { error: updateError } = await supabase
          .from('service_bookings')
          .update({ shared_documents: updatedDocuments })
          .eq('id', consultationId);        if (updateError) throw updateError;
        
        // Trigger refetch to update UI immediately
        setRefetchTrigger(prev => prev + 1);

        toast({ title: "Success", description: "Document uploaded and shared successfully." });} catch (err: any) {
        console.error("Error uploading document:", err);
        toast({ title: "Upload Failed", description: err?.message || "Upload failed", variant: "destructive" });
      } finally {
        setIsUploading(prev => ({ ...prev, [consultationId]: false }));
      }
    };
    input.click();
  };  const handleDeleteDocument = async (consultationId: string, documentUrl: string) => {
    try {
      // Extract file path from URL to delete from storage
      const urlParts = documentUrl.split('/lovable-uploads/');
      const filePath = urlParts.length > 1 ? urlParts[1] : null;

      // Delete from Supabase storage first
      if (filePath) {
        const { error: storageError } = await supabase.storage
          .from('lovable-uploads')
          .remove([filePath]);

        if (storageError) {
          console.warn('Storage deletion warning:', storageError);
          // Continue even if storage deletion fails (file might not exist)
        }
      }

      // Fetch current shared_documents from database
      const { data: currentBooking, error: fetchError } = await supabase
        .from('service_bookings')
        .select('shared_documents')
        .eq('id', consultationId)
        .single();

      if (fetchError) throw fetchError;

      // Filter out the document to be deleted
      const updatedDocuments = (currentBooking?.shared_documents || []).filter(
        (doc: any) => doc.url !== documentUrl
      );

      // Update database with filtered documents
      const { error: updateError } = await supabase
        .from('service_bookings')
        .update({ shared_documents: updatedDocuments })
        .eq('id', consultationId);      if (updateError) throw updateError;

      // Trigger refetch to update UI immediately
      setRefetchTrigger(prev => prev + 1);

      toast({ title: "Success", description: "Document deleted successfully." });

    } catch (err: any) {
      console.error("Error deleting document:", err);
      toast({ title: "Deletion Failed", description: err?.message || "Delete failed", variant: "destructive" });
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
      if (error) throw error;      // Update local state (simplified)
      setConsultations(prev => prev.map(c =>
        c.id === consultation.id
          ? { ...c, [fieldToUpdate]: true }
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
  }  return (
    <div className="space-y-4 sm:space-y-6 max-w-full overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0">
        <h2 className="text-lg sm:text-xl lg:text-2xl font-bold truncate">Upcoming Consultations</h2>
      </div>
      
      {paginatedConsultations.length === 0 ? (
        <div className="text-center py-8 sm:py-12">
          <p className="text-sm sm:text-base text-gray-500">You have no upcoming consultations scheduled.</p>
        </div>
      ) : (
        <>
          <div className="space-y-3 sm:space-y-4 max-w-full">
            {paginatedConsultations.map((consultation) => (
              <div key={consultation.id} className="overflow-hidden">
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
                {/* Mark as Complete Button for researcher */}
                <div className="flex flex-col sm:flex-row justify-end gap-2 mt-2 px-2 sm:px-0">
                  {!consultation.researcher_completed && (
                    <Button 
                      size="sm" 
                      variant="destructive" 
                      onClick={() => handleMarkAsComplete(consultation)}
                      className="w-full sm:w-auto text-xs sm:text-sm"
                    >
                      Mark as Complete
                    </Button>
                  )}
                  {consultation.researcher_completed && !consultation.student_completed && (
                    <Button 
                      size="sm" 
                      variant="secondary" 
                      disabled
                      className="w-full sm:w-auto text-xs sm:text-sm"
                    >
                      Waiting for Student
                    </Button>
                  )}
                  {consultation.student_completed && consultation.researcher_completed && (
                    <Button 
                      size="sm" 
                      variant="default" 
                      disabled
                      className="w-full sm:w-auto text-xs sm:text-sm"
                    >
                      Completed
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row justify-center sm:justify-end items-center gap-2 sm:gap-0 mt-4 sm:mt-6">
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="text-xs sm:text-sm px-3 sm:px-4"
                >
                  Previous
                </Button>
                <span className="text-xs sm:text-sm text-gray-600 px-2">
                  Page {currentPage} of {totalPages}
                </span>
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="text-xs sm:text-sm px-3 sm:px-4"
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default UpcomingTab;