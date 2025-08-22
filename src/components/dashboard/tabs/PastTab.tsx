
import { useState, useMemo } from 'react';
import PastConsultationCard from "../consultation/PastConsultationCard";
import { useConsultationServices } from "@/hooks/useConsultationServices";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const ITEMS_PER_PAGE = 5;

const PastTab = () => {
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
          imageUrl: '/placeholder.svg',
        },
        date: new Date(booking.scheduled_date).toLocaleDateString(),
        time: booking.scheduled_time,
        topic: booking.service?.title || 'N/A',
        status: "completed" as const,
        rating: 5, // Placeholder
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
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Past Consultations</h2>
      
      {paginatedConsultations.length > 0 ? (
        <>
          <div className="space-y-6">
            {paginatedConsultations.map((consultation) => (
              <PastConsultationCard
                key={consultation.id}
                consultation={consultation}
                uploadedResources={uploadedResources[consultation.id] || []}
                userType="researcher"
                onViewRecording={handleViewRecording}
                onViewAINotes={handleViewAINotes}
                onUploadResources={handleUploadResources}
                onSendMessage={handleSendMessage}
                onOpenChat={handleOpenChat}
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
          <p className="text-gray-500">No past consultations available.</p>
        </div>
      )}
    </div>
  );
};

export default PastTab;
