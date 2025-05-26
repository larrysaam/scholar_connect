
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, FileText, MessageSquare, ExternalLink, Video, Upload, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { pastConsultations } from "../mockData";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const PastTab = () => {
  const [messageText, setMessageText] = useState("");
  const [selectedConsultation, setSelectedConsultation] = useState<string | null>(null);

  const handleViewRecording = (consultationId: string) => {
    console.log("Opening video recording for consultation:", consultationId);
    // In a real app, this would open a video player modal or new window
    alert("Opening consultation recording...");
  };

  const handleViewNotes = (consultationId: string) => {
    console.log("Viewing AI-generated notes for consultation:", consultationId);
    // In a real app, this would open a modal with AI-generated consultation notes
    const mockNotes = `
AI-Generated Consultation Notes:

Topic: ${pastConsultations.find(c => c.id === consultationId)?.topic}

Key Discussion Points:
- Discussed research methodology approaches
- Reviewed data collection strategies
- Addressed statistical analysis concerns
- Provided guidance on literature review

Student Understanding Level: High
Recommended Next Steps:
- Begin data collection phase
- Schedule follow-up in 2 weeks
- Review recommended readings

Overall Session Rating: Productive
    `;
    alert(mockNotes);
  };

  const handleSendMessage = (consultationId: string) => {
    if (!messageText.trim()) return;
    
    console.log("Sending message to student:", { consultationId, message: messageText });
    // In a real app, this would send the message through the platform's messaging system
    alert(`Message sent to student: "${messageText}"`);
    setMessageText("");
    setSelectedConsultation(null);
  };

  const handleUploadResources = (consultationId: string) => {
    console.log("Uploading additional resources for consultation:", consultationId);
    // Create file input for resource upload
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.accept = '.pdf,.doc,.docx,.ppt,.pptx,.xlsx,.txt';
    input.onchange = (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (files && files.length > 0) {
        const fileNames = Array.from(files).map(f => f.name).join(', ');
        console.log("Files selected for upload:", fileNames);
        alert(`Resources uploaded: ${fileNames}\nThese will be available in the student's dashboard.`);
      }
    };
    input.click();
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Past Consultations</h2>
      
      {pastConsultations.length > 0 ? (
        <div className="space-y-6">
          {pastConsultations.map((consultation) => (
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
                  <Badge className="bg-green-100 text-green-800 border-green-200">
                    Completed
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
                <div className="flex gap-2 flex-wrap">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleViewRecording(consultation.id)}
                  >
                    <Video className="h-4 w-4 mr-2" />
                    View Recording
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleViewNotes(consultation.id)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View AI Notes
                  </Button>
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSelectedConsultation(consultation.id)}
                      >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Message Student
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Send Message to Student</DialogTitle>
                        <DialogDescription>
                          Send a follow-up message to {consultation.researcher.name}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="message">Message</Label>
                          <Textarea
                            id="message"
                            value={messageText}
                            onChange={(e) => setMessageText(e.target.value)}
                            placeholder="Type your follow-up message here..."
                            rows={4}
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button onClick={() => handleSendMessage(consultation.id)}>
                            Send Message
                          </Button>
                          <Button variant="outline" onClick={() => {
                            setMessageText("");
                            setSelectedConsultation(null);
                          }}>
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleUploadResources(consultation.id)}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Resources
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500">No past consultations yet.</p>
        </div>
      )}
    </div>
  );
};

export default PastTab;
