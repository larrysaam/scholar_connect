
import { useState } from "react";
import PastConsultationCard from "../consultation/PastConsultationCard";

const StudentPastTab = () => {
  const [uploadedResources, setUploadedResources] = useState<{[key: string]: string[]}>({});

  const pastConsultations = [
    {
      id: "past-1",
      researcher: {
        id: "researcher-1",
        name: "Dr. Sarah Johnson",
        field: "Computer Science",
        imageUrl: "/lovable-uploads/83e0a07d-3527-4693-8172-d7d181156044.png"
      },
      date: "2024-01-15",
      time: "2:00 PM - 3:00 PM",
      topic: "Machine Learning Algorithm Optimization",
      status: "completed" as const,
      rating: 5,
      hasRecording: true,
      hasAINotes: true
    },
    {
      id: "past-2",
      researcher: {
        id: "researcher-2",
        name: "Dr. Michael Chen",
        field: "Data Science",
        imageUrl: "/lovable-uploads/35d6300d-047f-404d-913c-ec65831f7973.png"
      },
      date: "2024-01-12",
      time: "10:00 AM - 11:00 AM",
      topic: "Statistical Analysis Methods",
      status: "completed" as const,
      rating: 4,
      hasRecording: true,
      hasAINotes: true
    }
  ];

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
        console.log("Resources shared with researcher for consultation:", consultationId, fileNames);
        alert(`${files.length} resource(s) shared with researcher (preview only).`);
      }
    };
    input.click();
  };

  const handleSendMessage = (consultationId: string, message: string) => {
    console.log("Sending message to researcher for consultation:", consultationId, message);
    alert(`Message sent to researcher: "${message}"`);
  };

  const handleOpenChat = (researcherId: string, consultationId: string) => {
    console.log("Opening in-platform messaging with researcher:", researcherId);
    alert(`Opening messaging interface with researcher for consultation ${consultationId}...`);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Past Consultations</h2>
      
      {pastConsultations.length > 0 ? (
        <div className="space-y-6">
          {pastConsultations.map((consultation) => (
            <PastConsultationCard
              key={consultation.id}
              consultation={consultation}
              uploadedResources={uploadedResources[consultation.id] || []}
              userType="student"
              onViewRecording={handleViewRecording}
              onViewAINotes={handleViewAINotes}
              onUploadResources={handleUploadResources}
              onSendMessage={handleSendMessage}
              onOpenChat={handleOpenChat}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500">No past consultations available.</p>
        </div>
      )}
    </div>
  );
};

export default StudentPastTab;
