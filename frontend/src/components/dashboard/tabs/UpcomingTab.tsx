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
    <div className="space-y-6 sm:space-y-8 p-1 sm:p-0">
      {/* Modern Header */}
      <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            Upcoming Consultations
          </h2>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            Prepare for your scheduled sessions and manage documents
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <span>{upcomingConsultations.length} Scheduled</span>
          </div>
        </div>
      </div>

      {paginatedConsultations.length > 0 ? (
        <>
          <div className="space-y-6">
            {paginatedConsultations.map((consultation) => (
              <div key={consultation.id} className="group">
                <div className="bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300 overflow-hidden">
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
                  
                  {/* Enhanced Mark as Complete Section */}
                  <div className="px-6 pb-6">
                    <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-gray-100">
                      {!consultation.researcher_completed && (
                        <Button
                          size="sm"
                          onClick={() => handleMarkAsComplete(consultation)}
                          className="group w-full sm:w-auto bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 shadow-lg shadow-green-200 hover:shadow-green-300 transition-all duration-200 font-medium px-6"
                        >
                          <div className="flex items-center gap-2">
                            <div className="p-1 bg-white/20 rounded-full group-hover:bg-white/30 transition-colors">
                              <Loader2 className="h-3 w-3" />
                            </div>
                            <span className="text-sm">Mark as Complete</span>
                          </div>
                        </Button>
                      )}
                      
                      {consultation.researcher_completed && !consultation.student_completed && (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          disabled 
                          className="w-full sm:w-auto border-2 border-orange-200 text-orange-700 bg-orange-50 px-6"
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                            <span className="text-sm font-medium">Waiting for Student</span>
                          </div>
                        </Button>
                      )}
                      
                      {consultation.student_completed && consultation.researcher_completed && (
                        <Button 
                          size="sm" 
                          disabled 
                          className="w-full sm:w-auto bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6"
                        >
                          <div className="flex items-center gap-2">
                            <div className="p-1 bg-white/20 rounded-full">
                              <Loader2 className="h-3 w-3" />
                            </div>
                            <span className="text-sm font-medium">Completed</span>
                          </div>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row justify-center items-center gap-3 mt-8">
              <Button 
                variant="outline"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="group w-full sm:w-auto px-6 py-2 border-2 border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-all duration-200"
              >
                <span className="text-sm font-medium">Previous</span>
              </Button>
              
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-600">
                  Page {currentPage} of {totalPages}
                </span>
              </div>
              
              <Button 
                variant="outline"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="group w-full sm:w-auto px-6 py-2 border-2 border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-all duration-200"
              >
                <span className="text-sm font-medium">Next</span>
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full flex items-center justify-center mb-6">
            <Loader2 className="h-10 w-10 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No Upcoming Consultations
          </h3>
          <p className="text-gray-500 max-w-md">
            Your scheduled sessions will appear here. Book a consultation to get started!
          </p>
        </div>
      )}
    </div>
  );
};

export default UpcomingTab;