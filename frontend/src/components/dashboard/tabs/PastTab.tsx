
import { useState, useMemo, useEffect } from 'react';
import PastConsultationCard from "../consultation/PastConsultationCard";
import { useConsultationServices } from "@/hooks/useConsultationServices";
import { Loader2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const ITEMS_PER_PAGE = 5;

interface PastTabProps {
  userRole: "student" | "researcher";
}

const PastTab = ({ userRole }: PastTabProps) => {
  const { user } = useAuth();
  const [uploadedResources, setUploadedResources] = useState<{[key: string]: string[]}>({});
  const { bookings, loading } = useConsultationServices();
  const [currentPage, setCurrentPage] = useState(1);
  const [reviewsMap, setReviewsMap] = useState<Map<string, any>>(new Map());
  // Fetch reviews for completed bookings from researcher_profile
  useEffect(() => {
    const fetchReviews = async () => {
      const completedBookingIds = bookings
        .filter(b => b.status === 'completed')
        .map(b => b.id);

      if (completedBookingIds.length === 0) return;

      // Get unique provider IDs from completed bookings
      const providerIds = [...new Set(bookings
        .filter(b => b.status === 'completed')
        .map(b => b.provider_id))];

      if (providerIds.length === 0) return;      // Fetch researcher profiles with their reviews
      const { data: profilesData, error: profilesError } = await supabase
        .from('researcher_profiles')
        .select('user_id, reviews')
        .in('user_id', providerIds);

      if (profilesError) {
        console.error('Error fetching researcher profiles:', profilesError);
        return;
      }      console.log('Researcher PastTab - Profiles with reviews fetched:', profilesData);

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
      bookings.forEach(booking => {
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

    if (bookings.length > 0) {
      fetchReviews();
    }
  }, [bookings]);
  const pastConsultations = useMemo(() => {
    return bookings
      .filter(booking => booking.status === 'completed')
      .map(booking => {
        const review = reviewsMap.get(booking.id);
        console.log(`Researcher PastTab - Booking ${booking.id} - Review:`, review, `Rating: ${review?.rating || 0}`);
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
        };
      })
      .sort((a, b) => {
        // Sort by date descending (newest first)
        const dateA = new Date(a.scheduledDate);
        const dateB = new Date(b.scheduledDate);
        return dateB.getTime() - dateA.getTime();
      });
  }, [bookings, reviewsMap]);

  const paginatedConsultations = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return pastConsultations.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [pastConsultations, currentPage]);

  const totalPages = Math.ceil(pastConsultations.length / ITEMS_PER_PAGE);

  const handleViewRecording = (consultationId: string) => {
    console.log("Viewing Google Meet recording for consultation:", consultationId);
    const recordingUrl = `https://drive.google.com/file/d/recording-${consultationId}`;
    window.open(recordingUrl, '_blank');
  };

  const handleViewAINotes = (consultationId: string) => {
    console.log("Viewing AI-generated notes for consultation:", consultationId);
    alert(`Opening AI-generated notes for consultation ${consultationId}...`);
  };

  const handleUploadResources = (consultationId: string) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.accept = '.pdf,.doc,.docx,.ppt,.pptx,.txt,.zip';
    input.onchange = (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (files && files.length > 0) {
        const fileNames = Array.from(files).map(f => f.name);
        setUploadedResources(prev => ({
          ...prev,
          [consultationId]: [...(prev[consultationId] || []), ...fileNames]
        }));
        console.log("Additional resources uploaded for consultation:", consultationId, fileNames);
        alert(`${files.length} resource(s) uploaded successfully. Student will be notified.`);
      }
    };
    input.click();
  };

  const handleSendMessage = (consultationId: string, message: string) => {
    console.log("Sending message to student for consultation:", consultationId, message);
    alert(`Message sent to student: "${message}"`);
  };

  const handleOpenChat = (studentId: string, consultationId: string) => {
    console.log("Opening in-platform messaging with student:", studentId);
    alert(`Opening messaging interface with student for consultation ${consultationId}...`);
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
        <>
          <div className="space-y-3 sm:space-y-4 max-w-full">
            {paginatedConsultations.map((consultation) => (
              <PastConsultationCard
                key={consultation.id}
                consultation={consultation}
                uploadedResources={uploadedResources[consultation.id] || []}
                userRole={userRole}
                onViewRecording={handleViewRecording}
                onViewAINotes={handleViewAINotes}
                onUploadResources={handleUploadResources}
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
