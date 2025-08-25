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

const UpcomingTab = () => {
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
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Upcoming Consultations</h2>
      
      {paginatedConsultations.length > 0 ? (
        <>
          <div className="space-y-6">
            {paginatedConsultations.map((consultation) => (
              <UpcomingConsultationCard
                key={consultation.id}
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
            ))}
          </div>
          {totalPages > 1 && (
            <div className="flex justify-end items-center mt-6">
              <Button 
                variant="outline"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="mr-2"
              >
                Previous
              </Button>
              <span className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              <Button 
                variant="outline"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="ml-2"
              >
                Next
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500">No upcoming consultations scheduled.</p>
        </div>
      )}
    </div>
  );
};

export default UpcomingTab;