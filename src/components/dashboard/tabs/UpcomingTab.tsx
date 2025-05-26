
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, Video, Upload, Check, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { upcomingConsultations } from "../mockData";
import StudentInfoModal from "../StudentInfoModal";

// Enhanced mock data with student information including university
const enhancedUpcomingConsultations = upcomingConsultations.map(consultation => ({
  ...consultation,
  student: {
    id: consultation.id + "_student",
    name: consultation.researcher.name.replace("Dr. ", "").replace("Prof. ", ""),
    field: consultation.researcher.field,
    university: consultation.id === "1" ? "Massachusetts Institute of Technology" : 
                consultation.id === "2" ? "Harvard University" : 
                consultation.id === "3" ? "University of Cambridge" : "Stanford University",
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
  const [showAcceptForm, setShowAcceptForm] = useState<string | null>(null);
  const [showDeclineForm, setShowDeclineForm] = useState<string | null>(null);
  const [acceptComment, setAcceptComment] = useState("");
  const [declineComment, setDeclineComment] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const handleReschedule = (consultationId: string) => {
    console.log("Rescheduling consultation:", consultationId);
    alert("Rescheduling functionality activated. A new scheduling interface would open here.");
  };

  const handleJoinMeeting = (consultationId: string) => {
    console.log("Joining meeting for consultation:", consultationId);
    alert("Joining meeting... Video conferencing interface would open here.");
  };

  const handleAccept = (consultationId: string) => {
    setShowAcceptForm(consultationId);
  };

  const handleDecline = (consultationId: string) => {
    setShowDeclineForm(consultationId);
  };

  const handleSubmitAccept = (consultationId: string) => {
    console.log("Accepting consultation:", consultationId, "with comment:", acceptComment);
    console.log("Uploaded file:", uploadedFile);
    alert("Consultation accepted with comment!");
    setShowAcceptForm(null);
    setAcceptComment("");
    setUploadedFile(null);
  };

  const handleSubmitDecline = (consultationId: string) => {
    console.log("Declining consultation:", consultationId, "with comment:", declineComment);
    alert("Consultation declined with comment!");
    setShowDeclineForm(null);
    setDeclineComment("");
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
    }
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

                {/* Accept Form */}
                {showAcceptForm === consultation.id && (
                  <div className="mt-4 p-4 border rounded-lg bg-green-50">
                    <Label htmlFor="accept-comment">Accept with Comment</Label>
                    <Textarea
                      id="accept-comment"
                      value={acceptComment}
                      onChange={(e) => setAcceptComment(e.target.value)}
                      placeholder="Add your acceptance comment and any preparation notes for the student..."
                      className="mt-2 mb-4"
                    />
                    
                    <Label htmlFor="file-upload">Upload Document (Optional)</Label>
                    <Input
                      id="file-upload"
                      type="file"
                      onChange={handleFileUpload}
                      className="mt-2 mb-4"
                      accept=".pdf,.doc,.docx,.ppt,.pptx"
                    />
                    {uploadedFile && (
                      <p className="text-sm text-gray-600 mb-4">
                        Selected: {uploadedFile.name}
                      </p>
                    )}
                    
                    <div className="flex gap-2">
                      <Button 
                        onClick={() => handleSubmitAccept(consultation.id)}
                        disabled={!acceptComment.trim()}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Check className="h-4 w-4 mr-2" />
                        Accept Consultation
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => {
                          setShowAcceptForm(null);
                          setAcceptComment("");
                          setUploadedFile(null);
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}

                {/* Decline Form */}
                {showDeclineForm === consultation.id && (
                  <div className="mt-4 p-4 border rounded-lg bg-red-50">
                    <Label htmlFor="decline-comment">Decline with Comment</Label>
                    <Textarea
                      id="decline-comment"
                      value={declineComment}
                      onChange={(e) => setDeclineComment(e.target.value)}
                      placeholder="Please provide a reason for declining this consultation..."
                      className="mt-2 mb-4"
                    />
                    
                    <div className="flex gap-2">
                      <Button 
                        onClick={() => handleSubmitDecline(consultation.id)}
                        disabled={!declineComment.trim()}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Decline Consultation
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => {
                          setShowDeclineForm(null);
                          setDeclineComment("");
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
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
                  {consultation.status === "pending" && !showAcceptForm && !showDeclineForm && (
                    <>
                      <Button 
                        size="sm"
                        onClick={() => handleAccept(consultation.id)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Check className="h-4 w-4 mr-2" />
                        Accept
                      </Button>
                      <Button 
                        variant="outline"
                        size="sm"
                        onClick={() => handleDecline(consultation.id)}
                        className="border-red-600 text-red-600 hover:bg-red-50"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Decline
                      </Button>
                    </>
                  )}
                </div>
                {consultation.status === "confirmed" && (
                  <Button 
                    size="sm"
                    onClick={() => handleJoinMeeting(consultation.id)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Video className="h-4 w-4 mr-2" />
                    Join Meeting
                  </Button>
                )}
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
