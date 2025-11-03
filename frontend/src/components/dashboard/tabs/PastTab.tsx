
import { useState, useMemo } from 'react';
import PastConsultationCard from "../consultation/PastConsultationCard";
import { useConsultationServices } from "@/hooks/useConsultationServices";
import { Loader2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

const ITEMS_PER_PAGE = 5;

interface PastTabProps {
  userRole: "student" | "researcher";
}

const PastTab = ({ userRole }: PastTabProps) => {
  const [uploadedResources, setUploadedResources] = useState<{[key: string]: string[]}>({});
  const { bookings, loading } = useConsultationServices();
  const [currentPage, setCurrentPage] = useState(1);

  const pastConsultations = useMemo(() => {
    return bookings
      .filter(booking => booking.status === 'completed')
      .map(booking => ({
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
        rating: booking.review?.rating || 0, // Use actual rating from review
        reviewText: booking.review?.text || '', // Use actual review text
        hasRecording: true, // Placeholder
        hasAINotes: true, // Placeholder
      }));
  }, [bookings]);

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
    <div className="space-y-6 sm:space-y-8 p-1 sm:p-0">
      {/* Modern Header */}
      <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Past Consultations
          </h2>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            Review your completed sessions and track your progress
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>{pastConsultations.length} Completed</span>
          </div>
        </div>
      </div>

      {paginatedConsultations.length > 0 ? (
        <>
          <div className="space-y-6">
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
            <div className="flex flex-col sm:flex-row justify-center items-center gap-3 mt-8">
              <Button 
                variant="outline"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="group w-full sm:w-auto px-6 py-2 border-2 border-gray-200 hover:border-purple-400 hover:bg-purple-50 transition-all duration-200"
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
                className="group w-full sm:w-auto px-6 py-2 border-2 border-gray-200 hover:border-purple-400 hover:bg-purple-50 transition-all duration-200"
              >
                <span className="text-sm font-medium">Next</span>
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-full flex items-center justify-center mb-6">
            <Clock className="h-10 w-10 text-purple-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No Past Consultations Yet
          </h3>
          <p className="text-gray-500 max-w-md">
            Your completed consultations will appear here. Start by scheduling your first session!
          </p>
        </div>
      )}
    </div>
  );
};

export default PastTab;
