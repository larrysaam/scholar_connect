
import { useState } from "react";
import { upcomingConsultations } from "../mockData";
import UpcomingConsultationCard from "../consultation/UpcomingConsultationCard";

const UpcomingTab = () => {
  const [uploadedDocuments, setUploadedDocuments] = useState<{[key: string]: string[]}>({});

  const handleAcceptConsultation = (consultationId: string, comment: string) => {
    console.log("Accepting consultation:", { consultationId, comment });
    alert(`Consultation accepted with comment: "${comment}"`);
  };

  const handleDeclineConsultation = (consultationId: string, comment: string) => {
    console.log("Declining consultation:", { consultationId, comment });
    alert(`Consultation declined with comment: "${comment}"`);
  };

  const handleRescheduleWithGoogleCalendar = (consultationId: string) => {
    console.log("Rescheduling consultation with Google Calendar:", consultationId);
    const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=Consultation+Reschedule&details=Reschedule+consultation+session&location=Google+Meet`;
    window.open(calendarUrl, '_blank');
    alert("Google Calendar opened for rescheduling. Please create a new event and share it with the student.");
  };

  const handleJoinWithGoogleMeet = (consultationId: string) => {
    console.log("Joining with Google Meet for consultation:", consultationId);
    const meetLink = `https://meet.google.com/abc-defg-hij`;
    window.open(meetLink, '_blank');
  };

  const handleViewRecording = (consultationId: string) => {
    console.log("Viewing Google Meet recording for consultation:", consultationId);
    const recordingUrl = `https://drive.google.com/file/d/recording-${consultationId}`;
    window.open(recordingUrl, '_blank');
  };

  const handleViewAINotes = (consultationId: string) => {
    console.log("Viewing AI-generated notes for consultation:", consultationId);
    alert(`Opening AI-generated notes for consultation ${consultationId}...`);
  };

  const handleUploadDocument = (consultationId: string) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.accept = '.pdf,.doc,.docx,.ppt,.pptx,.txt';
    input.onchange = (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (files && files.length > 0) {
        const fileNames = Array.from(files).map(f => f.name);
        setUploadedDocuments(prev => ({
          ...prev,
          [consultationId]: [...(prev[consultationId] || []), ...fileNames]
        }));
        console.log("Documents uploaded for consultation:", consultationId, fileNames);
        alert(`${files.length} document(s) uploaded successfully. Students will receive these before the session.`);
      }
    };
    input.click();
  };

  const handleLiveDocumentReview = (consultationId: string) => {
    console.log("Accessing live document review for consultation:", consultationId);
    alert("Opening shared Google Docs document from student...");
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Upcoming Consultations</h2>
      
      {upcomingConsultations.length > 0 ? (
        <div className="space-y-6">
          {upcomingConsultations.map((consultation) => (
            <UpcomingConsultationCard
              key={consultation.id}
              consultation={consultation}
              uploadedDocuments={uploadedDocuments[consultation.id] || []}
              onJoinWithGoogleMeet={handleJoinWithGoogleMeet}
              onLiveDocumentReview={handleLiveDocumentReview}
              onViewRecording={handleViewRecording}
              onViewAINotes={handleViewAINotes}
              onAcceptConsultation={handleAcceptConsultation}
              onDeclineConsultation={handleDeclineConsultation}
              onRescheduleWithGoogleCalendar={handleRescheduleWithGoogleCalendar}
              onUploadDocument={handleUploadDocument}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500">No upcoming consultations scheduled.</p>
        </div>
      )}
    </div>
  );
};

export default UpcomingTab;
