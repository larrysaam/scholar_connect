
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, User, Video, Upload, FileText, ExternalLink, MessageSquare, CalendarPlus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { upcomingConsultations } from "../mockData";

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

  const handleLiveDocumentReview = (consultationId: string) => {
    console.log("Starting live document review for consultation:", consultationId);
    // Create a Google Doc with view-only permissions for researcher
    const docUrl = `https://docs.google.com/document/create?usp=sharing`;
    window.open(docUrl, '_blank');
    alert("Google Doc created for live review. Please share with view-only access to the researcher.");
  };

  const handleFollowUpSession = (consultationId: string) => {
    console.log("Booking follow-up session for consultation:", consultationId);
    alert("Opening booking form for follow-up consultation session...");
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
            <Card key={consultation.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-4">
                    <div className="h-10 w-10 rounded-full overflow-hidden">
                      <img 
                        src={consultation.researcher.imageUrl} 
                        alt={consultation.researcher.name}
                        className="h-full w-full object-cover" 
                      />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{consultation.researcher.name}</CardTitle>
                      <CardDescription>{consultation.researcher.field}</CardDescription>
                    </div>
                  </div>
                  <Badge className={consultation.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                    {consultation.status}
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
                
                {/* Display uploaded documents */}
                {uploadedDocuments[consultation.id] && uploadedDocuments[consultation.id].length > 0 && (
                  <div className="mt-4">
                    <p className="font-medium text-sm text-green-700">Documents Shared (Preview Only):</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {uploadedDocuments[consultation.id].map((doc, index) => (
                        <Badge key={index} variant="outline" className="bg-green-50 text-green-700">
                          {doc}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-4">
                <div className="flex gap-2 flex-wrap">
                  {consultation.status === 'confirmed' && (
                    <Button 
                      onClick={() => handleJoinWithGoogleMeet(consultation.id)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Video className="h-4 w-4 mr-2" />
                      Join with Google Meet
                    </Button>
                  )}
                  
                  <Button 
                    variant="outline" 
                    onClick={() => handleUploadDocument(consultation.id)}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Document
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    onClick={() => handleLiveDocumentReview(consultation.id)}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Live Document Review
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    onClick={() => handleFollowUpSession(consultation.id)}
                  >
                    <CalendarPlus className="h-4 w-4 mr-2" />
                    Follow-up Session
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    onClick={() => handleContactResearcher(consultation.researcher.id, consultation.id)}
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Contact Researcher
                  </Button>
                </div>
              </CardFooter>
            </Card>
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
