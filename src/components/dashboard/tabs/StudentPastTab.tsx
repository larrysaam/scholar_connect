
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, Play, FileText, MessageSquare, Upload, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const StudentPastTab = () => {
  const [uploadedResources, setUploadedResources] = useState<{[key: string]: string[]}>({});
  const [messageContent, setMessageContent] = useState("");
  const [selectedConsultation, setSelectedConsultation] = useState<string | null>(null);

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

  const handleContactResearcher = (researcherId: string, consultationId: string) => {
    console.log("Opening in-platform messaging with researcher:", researcherId);
    alert(`Opening messaging interface with researcher for consultation ${consultationId}...`);
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

  const handleSendMessage = (consultationId: string) => {
    if (!messageContent.trim()) return;
    
    console.log("Sending message to researcher for consultation:", consultationId, messageContent);
    alert(`Message sent to researcher: "${messageContent}"`);
    setMessageContent("");
    setSelectedConsultation(null);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
        }`}
      />
    ));
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
                  <div className="flex items-center gap-2">
                    <div className="flex">{renderStars(consultation.rating)}</div>
                    <Badge className="bg-green-100 text-green-800">
                      {consultation.status}
                    </Badge>
                  </div>
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
                
                {/* Display shared resources */}
                {uploadedResources[consultation.id] && uploadedResources[consultation.id].length > 0 && (
                  <div className="mt-4">
                    <p className="font-medium text-sm text-blue-700">Resources Shared (Preview Only):</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {uploadedResources[consultation.id].map((resource, index) => (
                        <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700">
                          {resource}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-4">
                <div className="flex gap-2 flex-wrap">
                  {consultation.hasRecording && (
                    <Button 
                      variant="outline" 
                      onClick={() => handleViewRecording(consultation.id)}
                    >
                      <Play className="h-4 w-4 mr-2" />
                      View Recording
                    </Button>
                  )}
                  
                  {consultation.hasAINotes && (
                    <Button 
                      variant="outline" 
                      onClick={() => handleViewAINotes(consultation.id)}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      View AI Notes
                    </Button>
                  )}
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline"
                        onClick={() => setSelectedConsultation(consultation.id)}
                      >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Contact Researcher
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Send Message to {consultation.researcher.name}</DialogTitle>
                        <DialogDescription>
                          Send a follow-up message to the researcher through the platform messaging system.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="message">Message</Label>
                          <Textarea
                            id="message"
                            value={messageContent}
                            onChange={(e) => setMessageContent(e.target.value)}
                            placeholder="Type your message here..."
                            rows={4}
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button onClick={() => handleSendMessage(consultation.id)}>
                            Send Message
                          </Button>
                          <Button 
                            variant="outline" 
                            onClick={() => handleContactResearcher(consultation.researcher.id, consultation.id)}
                          >
                            Open Chat
                          </Button>
                          <Button variant="outline" onClick={() => {
                            setMessageContent("");
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
                    onClick={() => handleUploadResources(consultation.id)}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Share Resources
                  </Button>
                </div>
              </CardFooter>
            </Card>
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
