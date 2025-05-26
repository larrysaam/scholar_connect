
import { useState } from "react";
import { upcomingConsultations } from "../mockData";
import ConsultationCard from "../consultation/ConsultationCard";

const StudentUpcomingTab = () => {
  const [uploadedDocuments, setUploadedDocuments] = useState<{[key: string]: string[]}>({});

  const handleJoinWithGoogleMeet = (consultationId: string) => {
    console.log("Joining with Google Meet for consultation:", consultationId);
    const meetLink = `https://meet.google.com/abc-defg-hij`;
    window.open(meetLink, '_blank');
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
        alert(`${files.length} document(s) uploaded successfully. Researcher will receive preview access only.`);
      }
    };
    input.click();
  };

  const handleSubmitDocumentLink = (consultationId: string, documentLink: string) => {
    console.log("Document link shared for consultation:", consultationId, documentLink);
    alert(`Google Docs link shared with researcher: ${documentLink}`);
  };

  const handleContactResearcher = (researcherId: string, consultationId: string) => {
    console.log("Opening messaging with researcher:", researcherId);
    alert(`Opening messaging interface with researcher for consultation ${consultationId}...`);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Upcoming Consultations</h2>
      
      {upcomingConsultations.length > 0 ? (
        <div className="space-y-6">
          {upcomingConsultations.map((consultation) => (
            <ConsultationCard
              key={consultation.id}
              consultation={consultation}
              uploadedDocuments={uploadedDocuments[consultation.id] || []}
              onJoinMeet={handleJoinWithGoogleMeet}
              onUploadDocument={handleUploadDocument}
              onSubmitDocumentLink={handleSubmitDocumentLink}
              onContactResearcher={handleContactResearcher}
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

export default StudentUpcomingTab;
