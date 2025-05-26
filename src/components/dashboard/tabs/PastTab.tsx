
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, FileText, Mail, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { pastConsultations } from "../mockData";

const PastTab = () => {
  const handleViewRecording = (consultationId: string) => {
    console.log("Viewing recording for consultation:", consultationId);
    // In a real app, this would open the recording
  };

  const handleViewNotes = (consultationId: string) => {
    console.log("Viewing notes for consultation:", consultationId);
    // In a real app, this would open the consultation notes
  };

  const handleContactStudent = (consultationId: string) => {
    console.log("Contacting student for consultation:", consultationId);
    // In a real app, this would open email or messaging interface
    alert("Opening email client to contact student...");
  };

  const handleAdditionalResources = (consultationId: string) => {
    console.log("Sharing additional resources for consultation:", consultationId);
    // In a real app, this would open resource sharing interface
    alert("Opening resource sharing interface...");
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
                  <Badge className="bg-gray-100 text-gray-800 border-gray-200">
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
                    View Recording
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleViewNotes(consultation.id)}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    View Notes
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleContactStudent(consultation.id)}
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Contact Student
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleAdditionalResources(consultation.id)}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Additional Resources
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
