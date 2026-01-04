import { useState, useMemo, useEffect } from 'react';
import PastConsultationCard from "../consultation/PastConsultationCard";
import { useConsultationServices } from "@/hooks/useConsultationServices";
import { Loader2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

const ITEMS_PER_PAGE = 5;

interface PastTabProps {
  userRole: "student" | "researcher";
}

const PastTab = ({ userRole }: PastTabProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { bookings, loading } = useConsultationServices();
  const [currentPage, setCurrentPage] = useState(1);
  const [reviewsMap, setReviewsMap] = useState<Map<string, any>>(new Map());
  const [consultationsData, setConsultationsData] = useState<any[]>([]);
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  // Refetch bookings when refetchTrigger changes
  useEffect(() => {
    if (refetchTrigger > 0 && user) {
      const refetchBookings = async () => {
        const { data, error } = await supabase
          .from('service_bookings')
          .select(`*, client:users!service_bookings_client_id_fkey(name, email, avatar_url), provider:users!service_bookings_provider_id_fkey(name, email, avatar_url), service:consultation_services(title, category)`)
          .eq(userRole === 'student' ? 'client_id' : 'provider_id', user.id)
          .eq('status', 'completed')
          .order('scheduled_date', { ascending: false });

        if (!error && data) {
          setConsultationsData(data);
        }
      };
      refetchBookings();
    }
  }, [refetchTrigger, user, userRole]);

  // Use refetched data if available, otherwise use bookings
  const effectiveBookings = consultationsData.length > 0 ? consultationsData : bookings;
  // Fetch reviews for completed bookings from researcher_profile
  useEffect(() => {
    const fetchReviews = async () => {
      const completedBookingIds = effectiveBookings
        .filter(b => b.status === 'completed')
        .map(b => b.id);

      if (completedBookingIds.length === 0) return;

      // Get unique provider IDs from completed bookings
      const providerIds = [...new Set(effectiveBookings
        .filter(b => b.status === 'completed')
        .map(b => b.provider_id))];

      if (providerIds.length === 0) return;

      // Fetch researcher profiles with their reviews
      const { data: profilesData, error: profilesError } = await supabase
        .from('researcher_profiles')
        .select('user_id, reviews')
        .in('user_id', providerIds);

      if (profilesError) {
        console.error('Error fetching researcher profiles:', profilesError);
        return;
      }

      console.log('Researcher PastTab - Profiles with reviews fetched:', profilesData);

      // Create a map of user_id to reviews array
      const map = new Map();
      (profilesData || []).forEach((profile: any) => {
        console.log(`Profile ${profile.user_id} reviews data:`, profile.reviews);
        if (profile.reviews && Array.isArray(profile.reviews)) {
          // Store all reviews for this researcher
          map.set(profile.user_id, profile.reviews);
        }
      });

      console.log('User ID to Reviews Map:', Array.from(map.entries()));

      // Now map reviews to booking_ids
      const reviewsMap = new Map();
      effectiveBookings.forEach(booking => {
        if (booking.status === 'completed') {
          const researcherReviews = map.get(booking.provider_id) || [];
          console.log(`Booking ${booking.id} - Provider ${booking.provider_id} - Reviews found:`, researcherReviews);
          // Find the review for this specific booking
          const bookingReview = researcherReviews.find((r: any) => r.booking_id === booking.id);
          console.log(`Booking ${booking.id} - Matching review:`, bookingReview);
          if (bookingReview) {
            reviewsMap.set(booking.id, bookingReview);
          }
        }
      });

      console.log('Researcher PastTab - Reviews mapped to bookings:', Array.from(reviewsMap.entries()));
      setReviewsMap(reviewsMap);
    };

    if (effectiveBookings.length > 0) {
      fetchReviews();
    }
  }, [effectiveBookings]);  const pastConsultations = useMemo(() => {
    return effectiveBookings
      .filter(booking => booking.status === 'completed')
      .map(booking => {
        const review = reviewsMap.get(booking.id);
        console.log(`Researcher PastTab - Booking ${booking.id} - Review:`, review, `Rating: ${review?.rating || 0}`);
        
        // Extract shared document names from the booking
        const sharedDocs = booking.shared_documents || [];
        const documentNames = sharedDocs.map((doc: any) => doc.name || 'Unnamed Document');
        
        return {
          id: booking.id,
          student: {
            id: booking.client_id,
            name: booking.client?.name || 'N/A',
            field: booking.service?.category || 'N/A',
            imageUrl: booking.client?.avatar_url || '/placeholder-avatar.jpg',
          },
          researcher: {
            id: booking.provider_id,
            name: booking.provider?.name || 'N/A',
            field: booking.service?.category || 'N/A',
            imageUrl: booking.provider?.avatar_url || '/placeholder-avatar.jpg',
          },
          date: new Date(booking.scheduled_date).toLocaleDateString(),
          time: booking.scheduled_time,
          topic: booking.service?.title || 'N/A',
          status: "completed" as const,
          rating: review?.rating || 0,
          reviewText: review?.comment || '',
          hasRecording: true,
          hasAINotes: true,
          scheduledDate: booking.scheduled_date, // Keep raw date for sorting
          uploadedResources: documentNames, // Add shared documents to consultation object
        };
      })
      .sort((a, b) => {
        // Sort by date descending (newest first)
        const dateA = new Date(a.scheduledDate);
        const dateB = new Date(b.scheduledDate);
        return dateB.getTime() - dateA.getTime();
      });
  }, [effectiveBookings, reviewsMap]);

  const paginatedConsultations = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return pastConsultations.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [pastConsultations, currentPage]);

  const totalPages = Math.ceil(pastConsultations.length / ITEMS_PER_PAGE);
  const handleViewRecording = (consultationId: string) => {
    console.log("Viewing Google Meet recording for consultation:", consultationId);
    toast({ title: "Feature Coming Soon", description: "Recording playback will be available soon." });
  };

  const handleViewAINotes = (consultationId: string) => {
    console.log("Viewing AI-generated notes for consultation:", consultationId);
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
    console.log("Sending message to student for consultation:", consultationId, message);
    toast({ title: "Feature Coming Soon", description: "In-app messaging will be available soon." });
  };

  const handleOpenChat = (studentId: string, consultationId: string) => {
    console.log("Opening in-platform messaging with student:", studentId);
    toast({ title: "Feature Coming Soon", description: "Chat functionality will be available soon." });
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
      <div className="flex justify-center items-center h-40">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  return (
    <div className="space-y-4 sm:space-y-6 max-w-full overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0">
        <h2 className="text-lg sm:text-xl lg:text-2xl font-bold truncate">Past Consultations</h2>
      </div>
      
      {paginatedConsultations.length === 0 ? (
        <div className="text-center py-8 sm:py-12">
          <p className="text-sm sm:text-base text-gray-500">You have no past consultations.</p>
        </div>
      ) : (
        <>          <div className="space-y-3 sm:space-y-4 max-w-full">
            {paginatedConsultations.map((consultation) => (
              <PastConsultationCard
                key={consultation.id}
                consultation={consultation}
                uploadedResources={consultation.uploadedResources || []}
                userRole={userRole}
                onViewRecording={handleViewRecording}
                onViewAINotes={handleViewAINotes}
                onUploadResources={handleUploadResources}
                onDeleteResource={handleDeleteResource}
                onSendMessage={handleSendMessage}
                onOpenChat={handleOpenChat}
              />
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

export default PastTab;
