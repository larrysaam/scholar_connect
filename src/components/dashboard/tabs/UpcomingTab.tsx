import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, User, Video, MessageSquare, Upload, Check, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { upcomingConsultations } from "../mockData";

const UpcomingTab = () => {
  const [responseComment, setResponseComment] = useState("");
  const [selectedConsultation, setSelectedConsultation] = useState<string | null>(null);
  const [actionType, setActionType] = useState<'accept' | 'decline' | null>(null);
  const [uploadedDocuments, setUploadedDocuments] = useState<{[key: string]: string[]}>({});

  const handleAcceptConsultation = (consultationId: string, comment: string) => {
    console.log("Accepting consultation:", { consultationId, comment });
    alert(`Consultation accepted with comment: "${comment}"`);
    setResponseComment("");
    setSelectedConsultation(null);
    setActionType(null);
  };

  const handleDeclineConsultation = (consultationId: string, comment: string) => {
    console.log("Declining consultation:", { consultationId, comment });
    alert(`Consultation declined with comment: "${comment}"`);
    setResponseComment("");
    setSelectedConsultation(null);
    setActionType(null);
  };

  const handleReschedule = (consultationId: string) => {
    console.log("Rescheduling consultation:", consultationId);
    alert("Opening calendar to reschedule consultation...");
  };

  const handleMoreInfo = (consultationId: string) => {
    console.log("Requesting more information for consultation:", consultationId);
    alert("Opening form to request additional information from student...");
  };

  const handleJoinCall = (consultationId: string) => {
    console.log("Joining consultation call:", consultationId);
    alert("Joining video consultation...");
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

  const handleResponseAction = (type: 'accept' | 'decline', consultationId: string) => {
    setActionType(type);
    setSelectedConsultation(consultationId);
  };

  const handleSubmitResponse = () => {
    if (!selectedConsultation || !responseComment.trim()) return;
    
    if (actionType === 'accept') {
      handleAcceptConsultation(selectedConsultation, responseComment);
    } else if (actionType === 'decline') {
      handleDeclineConsultation(selectedConsultation, responseComment);
    }
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
                    <p className="font-medium text-sm text-green-700">Uploaded Documents:</p>
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
                  {consultation.status === 'confirmed' ? (
                    <Button 
                      onClick={() => handleJoinCall(consultation.id)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Video className="h-4 w-4 mr-2" />
                      Join Call
                    </Button>
                  ) : (
                    <>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            onClick={() => handleResponseAction('accept', consultation.id)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <Check className="h-4 w-4 mr-2" />
                            Accept
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Accept Consultation</DialogTitle>
                            <DialogDescription>
                              Add a comment for the student along with your acceptance.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="accept-comment">Comment</Label>
                              <Textarea
                                id="accept-comment"
                                value={responseComment}
                                onChange={(e) => setResponseComment(e.target.value)}
                                placeholder="Add any notes or preparation instructions for the student..."
                                rows={3}
                              />
                            </div>
                            <div className="flex gap-2">
                              <Button onClick={handleSubmitResponse}>
                                Accept with Comment
                              </Button>
                              <Button variant="outline" onClick={() => {
                                setResponseComment("");
                                setSelectedConsultation(null);
                                setActionType(null);
                              }}>
                                Cancel
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>

                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            onClick={() => handleResponseAction('decline', consultation.id)}
                            className="border-red-600 text-red-600 hover:bg-red-50"
                          >
                            <X className="h-4 w-4 mr-2" />
                            Decline
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Decline Consultation</DialogTitle>
                            <DialogDescription>
                              Please provide a reason for declining this consultation.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="decline-comment">Reason</Label>
                              <Textarea
                                id="decline-comment"
                                value={responseComment}
                                onChange={(e) => setResponseComment(e.target.value)}
                                placeholder="Please explain why you're declining this consultation..."
                                rows={3}
                              />
                            </div>
                            <div className="flex gap-2">
                              <Button onClick={handleSubmitResponse} variant="destructive">
                                Decline with Comment
                              </Button>
                              <Button variant="outline" onClick={() => {
                                setResponseComment("");
                                setSelectedConsultation(null);
                                setActionType(null);
                              }}>
                                Cancel
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </>
                  )}
                  
                  <Button 
                    variant="outline" 
                    onClick={() => handleReschedule(consultation.id)}
                  >
                    Reschedule
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => handleMoreInfo(consultation.id)}
                  >
                    More Info
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => handleUploadDocument(consultation.id)}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Document
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

export default UpcomingTab;
