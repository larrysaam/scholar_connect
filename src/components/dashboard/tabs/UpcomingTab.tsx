
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, Video } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { upcomingConsultations } from "../mockData";
import StudentInfoModal from "../StudentInfoModal";

// Enhanced mock data with student information
const enhancedUpcomingConsultations = upcomingConsultations.map(consultation => ({
  ...consultation,
  student: {
    id: consultation.id + "_student",
    name: consultation.researcher.name.replace("Dr. ", "").replace("Prof. ", ""),
    email: consultation.researcher.name.toLowerCase().replace(" ", ".") + "@student.edu",
    field: consultation.researcher.field,
    researchSummary: `Conducting research in ${consultation.topic}. This work focuses on developing innovative approaches to address current challenges in the field. The research methodology involves comprehensive analysis and practical applications.`,
    challenge: `Main challenge: Need expert guidance on ${consultation.topic} to overcome theoretical and practical obstacles. Specifically struggling with methodology selection and data interpretation.`,
    comment: `Looking forward to discussing the project details and getting insights on best practices. This consultation is crucial for the next phase of my research.`,
    documentsShared: [
      {
        name: "Research Proposal Draft.pdf",
        type: "PDF Document",
        preview: "This document contains the preliminary research proposal outlining the objectives, methodology, and expected outcomes. It includes literature review, research questions, and proposed timeline for completion."
      },
      {
        name: "Literature Review Summary.docx",
        type: "Word Document", 
        preview: "Comprehensive summary of existing literature in the field, highlighting gaps and opportunities for new research. Contains citations and analysis of 50+ relevant papers and studies."
      }
    ]
  }
}));

const UpcomingTab = () => {
  const handleReschedule = (consultationId: string) => {
    console.log("Rescheduling consultation:", consultationId);
    // Simulate rescheduling functionality
    alert("Rescheduling functionality activated. A new scheduling interface would open here.");
  };

  const handleJoinMeeting = (consultationId: string) => {
    console.log("Joining meeting for consultation:", consultationId);
    // Simulate joining meeting functionality
    alert("Joining meeting... Video conferencing interface would open here.");
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Upcoming Consultations</h2>
      
      {enhancedUpcomingConsultations.length > 0 ? (
        <div className="space-y-6">
          {enhancedUpcomingConsultations.map((consultation) => (
            <Card key={consultation.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-4">
                    <div className="h-10 w-10 rounded-full overflow-hidden">
                      <img 
                        src={consultation.researcher.imageUrl} 
                        alt={consultation.student.name}
                        className="h-full w-full object-cover" 
                      />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{consultation.student.name}</CardTitle>
                      <CardDescription>{consultation.student.field}</CardDescription>
                    </div>
                  </div>
                  <Badge 
                    className={
                      consultation.status === "confirmed" 
                        ? "bg-green-100 text-green-800 border-green-200" 
                        : "bg-yellow-100 text-yellow-800 border-yellow-200"
                    }
                  >
                    {consultation.status === "confirmed" ? "Confirmed" : "Pending"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center text-gray-700">
                    <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                    <span>{consultation.date}</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <Clock className="h-4 w-4 mr-2 text-gray-500" />
                    <span>{consultation.time}</span>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="font-medium">Topic:</p>
                  <p className="text-gray-700">{consultation.topic}</p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-4">
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleReschedule(consultation.id)}
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Reschedule
                  </Button>
                  <StudentInfoModal student={consultation.student} />
                </div>
                <Button 
                  size="sm"
                  onClick={() => handleJoinMeeting(consultation.id)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Video className="h-4 w-4 mr-2" />
                  Join Meeting
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500">No upcoming consultations.</p>
          <Button className="mt-4" asChild>
            <a href="/researchers">Find Researchers</a>
          </Button>
        </div>
      )}
    </div>
  );
};

export default UpcomingTab;
