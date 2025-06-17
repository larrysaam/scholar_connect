
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import ConsultationCard from "../consultation/ConsultationCard";
import { upcomingConsultations } from "../mockData";

const StudentUpcomingTab = () => {
  const { toast } = useToast();

  const handleJoinMeet = (consultationId: string) => {
    toast({
      title: "Joining Google Meet",
      description: "Opening Google Meet session...",
    });
    // Open Google Meet
    window.open('https://meet.google.com/new', '_blank');
  };

  const handleUploadDocument = (consultationId: string) => {
    toast({
      title: "Upload Document",
      description: "Document upload feature would open here",
    });
    console.log(`Uploading document for consultation ${consultationId}`);
  };

  const handleSubmitDocumentLink = (consultationId: string, documentLink: string) => {
    toast({
      title: "Document Link Shared",
      description: "Your Google Docs link has been shared with the researcher.",
    });
    console.log(`Sharing document link for consultation ${consultationId}:`, documentLink);
  };

  const handleContactResearcher = (researcherId: string, consultationId: string) => {
    toast({
      title: "Opening Messages",
      description: "Redirecting to messages...",
    });
    // Trigger tab change to messages
    window.dispatchEvent(new CustomEvent('setActiveTab', { detail: 'messages' }));
  };

  const handleAccessDocument = (documentLink: string) => {
    window.open(documentLink, '_blank');
  };

  const upcomingStudentConsultations = upcomingConsultations.filter(c => c.status === 'confirmed' || c.status === 'pending');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Upcoming Consultations</h2>
      </div>
      
      {upcomingStudentConsultations.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-500">No upcoming consultations scheduled.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {upcomingStudentConsultations.map((consultation) => (
            <ConsultationCard
              key={consultation.id}
              consultation={consultation}
              uploadedDocuments={["research_draft.pdf", "data_analysis.xlsx"]}
              userType="student"
              onJoinMeet={handleJoinMeet}
              onUploadDocument={handleUploadDocument}
              onSubmitDocumentLink={handleSubmitDocumentLink}
              onContactResearcher={handleContactResearcher}
              onAccessDocument={handleAccessDocument}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentUpcomingTab;
