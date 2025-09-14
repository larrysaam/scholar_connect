import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import ConsultationCard from "../consultation/ConsultationCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

// Assuming this is the shape ConsultationCard expects
export interface Consultation {
  id: string;
  status: string;
  datetime: string;
  duration: number;
  researcher: { name: string; title: string; avatar_url: string; };
  service: { title: string; };
  meetLink?: string;
  sharedDocuments?: any[];
  student_completed?: boolean;
  researcher_completed?: boolean;
}

const ITEMS_PER_PAGE = 5;

const StudentUpcomingTab = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<{ [key: string]: boolean }>({});
  const [currentPage, setCurrentPage] = useState(1);

  const fetchConsultations = async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('service_bookings')
        .select(`
          id, status, scheduled_date, scheduled_time, duration_minutes, meeting_link, shared_documents, client_notes,
          provider:users!service_bookings_provider_id_fkey(name, topic_title, avatar_url),
          service:consultation_services(title),
          student_completed, researcher_completed
        `)
        .eq('client_id', user.id)
        .in('status', ['pending', 'confirmed'])
        .order('scheduled_date', { ascending: false })
        .order('scheduled_time', { ascending: false });


      console.log("Fetched consultations:", data);

      if (error) throw error;

      const mappedConsultations: Consultation[] = data.map(c => {
        const notes = c.client_notes || {};
        return {
          id: c.id,
          status: c.status,
          datetime: `${c.scheduled_date}T${c.scheduled_time}`,
          duration: c.duration_minutes,
          researcher: {
            name: c.provider?.name || 'N/A',
            title: c.provider?.topic_title || 'Researcher',
            avatar_url: c.provider?.avatar_url || '/placeholder.svg'
          },
          service: {
            title: c.service?.title || 'Consultation'
          },
          topic: c.service?.title || 'No topic provided',
          meetLink: c.meeting_link,
          sharedDocuments: c.shared_documents || [],
          student_completed: c.student_completed,
          researcher_completed: c.researcher_completed
        }
      });

      setConsultations(mappedConsultations);
    } catch (err: any) {
      setError(err.message);
      console.error("Error fetching consultations:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConsultations();
  }, [user]);

  const paginatedConsultations = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return consultations.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [consultations, currentPage]);

  const totalPages = Math.ceil(consultations.length / ITEMS_PER_PAGE);

  const handleJoinMeet = (meetLink: string | undefined) => {
    if (meetLink) {
      window.open(meetLink, '_blank');
    } else {
      toast({ title: "No Meeting Link", description: "The meeting link has not been generated yet.", variant: "destructive" });
    }
  };

  // Other handlers can be updated to use real data as well
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

        setConsultations(prev => prev.map(c =>
          c.id === consultationId ? { ...c, sharedDocuments: updatedDocs } : c
        ));

        toast({ title: "Success", description: "Document uploaded successfully." });

      } catch (err: any) {
        console.error("Error uploading document:", err);
        toast({ title: "Upload Failed", description: err.message, variant: "destructive" });
      } finally {
        setIsUploading(prev => ({ ...prev, [consultationId]: false }));
      }
    };
    input.click();
  };

  const handleSubmitDocumentLink = async (consultationId: string, documentLink: string) => {
    let fullUrl = documentLink;
    if (!/^https?:\/\//i.test(documentLink)) {
      fullUrl = 'https://' + documentLink;
    }

    try {
      const { data: currentBooking, error: fetchError } = await supabase
        .from('service_bookings')
        .select('shared_documents')
        .eq('id', consultationId)
        .single();

      if (fetchError) throw fetchError;

      const existingDocs = currentBooking?.shared_documents || [];
      const newDoc = { name: "Live Review Document", url: fullUrl };

      const updatedDocs = [...existingDocs, newDoc];

      const { error: updateError } = await supabase
        .from('service_bookings')
        .update({ shared_documents: updatedDocs })
        .eq('id', consultationId);

      if (updateError) throw updateError;

      fetchConsultations(); // Refresh consultations

      toast({ title: "Success", description: "Document link shared successfully." });

    } catch (err: any) {
      console.error("Error sharing document link:", err);
      toast({ title: "Sharing Failed", description: err.message, variant: "destructive" });
    }
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

      fetchConsultations(); // Refresh consultations

      toast({ title: "Success", description: "Document deleted successfully." });

    } catch (err: any) {
      console.error("Error deleting document:", err);
      toast({ title: "Deletion Failed", description: err.message, variant: "destructive" });
    }
  };

  const handleAccessDocument = (documentLink: string) => {
    window.open(documentLink, '_blank');
  };

  // Mark as Complete logic for student
  const handleMarkAsComplete = async (consultation: Consultation) => {
    try {
      const { error } = await supabase
        .from('service_bookings')
        .update({ student_completed: true })
        .eq('id', consultation.id);
      if (error) throw error;

      // Fetch updated booking to check if both have completed
      const { data: updated, error: fetchError } = await supabase
        .from('service_bookings')
        .select('student_completed, researcher_completed, status')
        .eq('id', consultation.id)
        .single();
      if (fetchError) throw fetchError;

      // If both have marked as complete, set status to completed
      if (updated.student_completed && updated.researcher_completed && updated.status !== 'completed') {
        const { error: statusError } = await supabase
          .from('service_bookings')
          .update({ status: 'completed' })
          .eq('id', consultation.id);
        if (statusError) throw statusError;
      }

      // Update local state
      setConsultations(prev => prev.map(c =>
        c.id === consultation.id
          ? { ...c, student_completed: true, status: (updated.student_completed && updated.researcher_completed) ? 'completed' : c.status }
          : c
      ));
      toast({ title: 'Marked as Complete', description: 'Your completion has been recorded.' });
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    }
  };

  if (loading) {
    return (
        <div className="space-y-4">
            <Skeleton className="h-12 w-1/3" />
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-48 w-full" />
        </div>
    );
  }

  if (error) {
    return <Alert variant="destructive"><AlertTriangle className="h-4 w-4" /><AlertTitle>Error</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>;
  }

  return (
    <div className="space-y-4 sm:space-y-6 max-w-full overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0">
        <h2 className="text-lg sm:text-xl lg:text-2xl font-bold truncate">Upcoming Consultations</h2>
      </div>
      
      {consultations.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8 sm:py-12">
            <p className="text-sm sm:text-base text-gray-500">You have no upcoming consultations scheduled.</p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="space-y-3 sm:space-y-4 max-w-full">
          {paginatedConsultations.map((consultation) => (
            <div key={consultation.id} className="overflow-hidden">
              <ConsultationCard
                consultation={consultation}
                userType="student"
                onJoinMeet={() => handleJoinMeet(consultation.meetLink)}
                onUploadDocument={() => handleUploadDocument(consultation.id)}
                isUploading={isUploading[consultation.id] || false}
                onSubmitDocumentLink={handleSubmitDocumentLink}
                onDeleteDocument={handleDeleteDocument}
                onAccessDocument={handleAccessDocument}
              />
              {/* Mark as Complete Button for student */}
              <div className="flex flex-col sm:flex-row justify-end gap-2 mt-2 px-2 sm:px-0">
                {!consultation.student_completed && (
                  <Button 
                    size="sm" 
                    variant="destructive" 
                    onClick={() => handleMarkAsComplete(consultation)}
                    className="w-full sm:w-auto text-xs sm:text-sm"
                  >
                    Mark as Complete
                  </Button>
                )}
                {consultation.student_completed && !consultation.researcher_completed && (
                  <Button 
                    size="sm" 
                    variant="secondary" 
                    disabled
                    className="w-full sm:w-auto text-xs sm:text-sm"
                  >
                    Waiting for Researcher
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

export default StudentUpcomingTab;