import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import PastConsultationCard from "../consultation/PastConsultationCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

// This interface matches the props expected by PastConsultationCard
export interface PastConsultation {
  id: string;
  researcher: { id: string; name: string; field: string; imageUrl: string; };
  date: string;
  time: string;
  topic: string;
  status: "completed";
  rating: number;
  reviewText?: string;
  hasRecording: boolean;
  hasAINotes: boolean;
  uploadedResources?: string[];
}

const ITEMS_PER_PAGE = 5;

const StudentPastTab = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [consultations, setConsultations] = useState<PastConsultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  useEffect(() => {
    if (!user) return;

    const fetchPastConsultations = async () => {
      setLoading(true);
      setError(null);
      try {        // Fetch completed consultations/appointments for the student
        const { data, error } = await supabase
          .from('service_bookings')
          .select(`
            id, status, scheduled_date, scheduled_time, project_description, meeting_link, shared_documents,
            provider:users!service_bookings_provider_id_fkey(id, name, topic_title, avatar_url),
            service:consultation_services(title)
          `)
          .eq('client_id', user.id)
          .eq('status', 'completed')
          .order('scheduled_date', { ascending: false });if (error) throw error;

        // Get unique provider IDs from completed bookings
        const providerIds = [...new Set((data || []).map((c: any) => c.provider?.id).filter(Boolean))];

        console.log('Student PastTab - Provider IDs:', providerIds);        // Fetch reviews from researcher_profiles table
        const { data: profilesData, error: profilesError } = await supabase
          .from('researcher_profiles')
          .select('user_id, reviews')
          .in('user_id', providerIds);

        if (profilesError) {
          console.error('Error fetching researcher profiles:', profilesError);
        }

        console.log('Student PastTab - Profiles with reviews fetched:', profilesData);

        // Create a map of user_id to reviews array
        const profileReviewsMap = new Map();
        (profilesData || []).forEach((profile: any) => {
          console.log(`Profile ${profile.user_id} reviews data:`, profile.reviews);
          if (profile.reviews && Array.isArray(profile.reviews)) {
            profileReviewsMap.set(profile.user_id, profile.reviews);
          }
        });

        console.log('User ID to Reviews Map:', Array.from(profileReviewsMap.entries()));

        // Create a map of booking_id to review for easy lookup
        const reviewsMap = new Map();
        (data || []).forEach((consultation: any) => {
          const researcherReviews = profileReviewsMap.get(consultation.provider?.id) || [];
          console.log(`Consultation ${consultation.id} - Provider ${consultation.provider?.id} - Reviews found:`, researcherReviews);
          // Find the review for this specific booking
          const bookingReview = researcherReviews.find((r: any) => r.booking_id === consultation.id);
          console.log(`Consultation ${consultation.id} - Matching review:`, bookingReview);
          if (bookingReview) {
            reviewsMap.set(consultation.id, bookingReview);
          }
        });

        console.log('Student PastTab - Reviews mapped to bookings:', Array.from(reviewsMap.entries()));        // Map to PastConsultation[]
        const mappedConsultations: PastConsultation[] = (data || []).map((c: any) => {
          const review = reviewsMap.get(c.id);
          console.log(`Consultation ${c.id} - Review:`, review, `Rating: ${review?.rating || 0}`);
          
          // Extract shared document names from the booking
          const sharedDocs = c.shared_documents || [];
          const documentNames = sharedDocs.map((doc: any) => doc.name || 'Unnamed Document');
          
          return {
            id: c.id,
            researcher: {
              id: c.provider?.id || 'N/A',
              name: c.provider?.name || 'N/A',
              field: c.provider?.topic_title || 'Researcher',
              imageUrl: c.provider?.avatar_url || '/placeholder.svg',
            },
            date: c.scheduled_date,
            time: c.scheduled_time,
            topic: c.project_description || c.service?.title || 'No topic provided',
            status: 'completed' as const,
            rating: review?.rating || 0,
            reviewText: review?.comment || undefined,
            hasRecording: !!c.meeting_link,
            hasAINotes: false,
            uploadedResources: documentNames, // Add shared documents to consultation object
          };
        })
        .sort((a, b) => {
          // Sort by date descending (newest first)
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          return dateB.getTime() - dateA.getTime();
        });

        console.log('Mapped consultations with ratings:', mappedConsultations.map(c => ({ id: c.id, rating: c.rating, date: c.date })));
        setConsultations(mappedConsultations);
      } catch (err: any) {
        setError(err.message);
        console.error('Error fetching past consultations:', err);
      } finally {
        setLoading(false);
      }    };

    fetchPastConsultations();
  }, [user, refetchTrigger]);

  const paginatedConsultations = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return consultations.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [consultations, currentPage]);
  const totalPages = Math.ceil(consultations.length / ITEMS_PER_PAGE);

  // Handlers
  const handleViewRecording = (consultationId: string) => {
    console.log("Viewing recording for:", consultationId);
    toast({ title: "Feature Coming Soon", description: "Recording playback will be available soon." });
  };

  const handleViewAINotes = (consultationId: string) => {
    console.log("Viewing AI notes for:", consultationId);
    toast({ title: "Feature Coming Soon", description: "AI-generated notes will be available soon." });
  };
  const handleUploadResources = async (consultationId: string) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.accept = '.pdf,.doc,.docx,.ppt,.pptx,.txt,.zip';
    input.onchange = async (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (!files || files.length === 0 || !user) return;

      try {
        const uploadedFiles: string[] = [];
        const newDocs: any[] = [];

        for (const file of Array.from(files)) {
          const timestamp = Date.now();
          const fileExtension = file.name.split('.').pop();
          const fileNameWithoutExt = file.name.substring(0, file.name.lastIndexOf('.'));
          const uniqueFileName = `${fileNameWithoutExt}_${timestamp}.${fileExtension}`;
          const filePath = `consultation_resources/${consultationId}/${user.id}/${uniqueFileName}`;

          const { error: uploadError } = await supabase.storage
            .from('lovable-uploads')
            .upload(filePath, file, {
              cacheControl: '3600',
              upsert: false,
            });

          if (uploadError) throw uploadError;

          const { data: urlData } = supabase.storage
            .from('lovable-uploads')
            .getPublicUrl(filePath);

          if (urlData.publicUrl) {
            uploadedFiles.push(file.name);
            newDocs.push({
              name: file.name,
              url: urlData.publicUrl,
              size: file.size,
              uploadedAt: new Date().toISOString()
            });
          }
        }

        // Fetch current shared_documents from database
        const { data: currentBooking, error: fetchError } = await supabase
          .from('service_bookings')
          .select('shared_documents')
          .eq('id', consultationId)
          .single();

        if (fetchError) throw fetchError;

        // Append new documents to existing documents
        const updatedDocuments = [...(currentBooking?.shared_documents || []), ...newDocs];

        // Update database with new documents
        const { error: updateError } = await supabase
          .from('service_bookings')
          .update({ shared_documents: updatedDocuments })
          .eq('id', consultationId);        if (updateError) throw updateError;

        // Trigger refetch to update UI immediately
        setRefetchTrigger(prev => prev + 1);

        toast({ 
          title: "Success", 
          description: `${uploadedFiles.length} resource(s) uploaded and shared successfully.` 
        });
      } catch (err: any) {
        console.error("Error uploading resources:", err);
        toast({ 
          title: "Upload Failed", 
          description: err.message, 
          variant: "destructive" 
        });
      }
    };
    input.click();
  };

  const handleSendMessage = (consultationId: string, message: string) => {
    console.log("Sending message for:", consultationId, message);
    toast({ title: "Feature Coming Soon", description: "In-app messaging will be available soon." });
  };

  const handleOpenChat = (researcherId: string, consultationId: string) => {
    console.log("Opening chat for:", consultationId);
    toast({ title: "Feature Coming Soon", description: "Chat functionality will be available soon." });
  };

  const handleFollowUpSession = (consultationId: string) => {
    // Find the consultation to get researcher ID
    const consultation = consultations.find(c => c.id === consultationId);
    if (consultation && consultation.researcher.id) {
      navigate(`/researcher/${consultation.researcher.id}`);
    }
  };

  const handleDeleteResource = async (consultationId: string, resourceName: string) => {
    try {
      // Fetch current shared_documents from database to get the full document object
      const { data: currentBooking, error: fetchError } = await supabase
        .from('service_bookings')
        .select('shared_documents')
        .eq('id', consultationId)
        .single();

      if (fetchError) throw fetchError;

      // Find the document to delete by name
      const docToDelete = (currentBooking?.shared_documents || []).find(
        (doc: any) => doc.name === resourceName
      );

      if (!docToDelete) {
        throw new Error('Document not found');
      }

      // Extract file path from URL to delete from storage
      const urlParts = docToDelete.url.split('/lovable-uploads/');
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

      // Filter out the document to be deleted
      const updatedDocuments = (currentBooking?.shared_documents || []).filter(
        (doc: any) => doc.name !== resourceName
      );

      // Update database with filtered documents
      const { error: updateError } = await supabase
        .from('service_bookings')
        .update({ shared_documents: updatedDocuments })
        .eq('id', consultationId);

      if (updateError) throw updateError;

      // Trigger refetch to update UI immediately
      setRefetchTrigger(prev => prev + 1);

      toast({ 
        title: "Success", 
        description: "Resource deleted successfully." 
      });

    } catch (err: any) {
      console.error("Error deleting resource:", err);
      toast({ 
        title: "Deletion Failed", 
        description: err?.message || "Delete failed", 
        variant: "destructive" 
      });
    }
  };

  if (loading) {
    return (
        <div className="space-y-4">
            <Skeleton className="h-12 w-1/3" />
            <Skeleton className="h-56 w-full" />
            <Skeleton className="h-56 w-full" />
        </div>
    );
  }

  if (error) {
    return <Alert variant="destructive"><AlertTriangle className="h-4 w-4" /><AlertTitle>Error</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>;
  }

  return (
    <div className="space-y-4 sm:space-y-6 max-w-full overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0">
        <h2 className="text-lg sm:text-xl lg:text-2xl font-bold truncate">Past Consultations</h2>
      </div>
      
      {paginatedConsultations.length > 0 ? (
        <>
          <div className="space-y-3 sm:space-y-6 max-w-full">            {paginatedConsultations.map((consultation) => (
              <div key={consultation.id} className="overflow-hidden">
                <PastConsultationCard
                  consultation={consultation}
                  uploadedResources={consultation.uploadedResources || []}
                  userRole="student"
                  onViewRecording={handleViewRecording}
                  onViewAINotes={handleViewAINotes}
                  onUploadResources={handleUploadResources}
                  onDeleteResource={handleDeleteResource}
                  onSendMessage={handleSendMessage}
                  onOpenChat={handleOpenChat}
                  onFollowUpSession={handleFollowUpSession}
                />
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
      ) : (
        <Card>
            <CardContent className="text-center py-8 sm:py-12">
                <p className="text-sm sm:text-base text-gray-500">No past consultations available.</p>
            </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StudentPastTab;