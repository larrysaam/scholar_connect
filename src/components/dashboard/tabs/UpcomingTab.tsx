
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, Video } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { upcomingConsultations } from "../mockData";

const UpcomingTab = () => {
  const handleReschedule = (consultationId: string) => {
    console.log("Rescheduling consultation:", consultationId);
    // In a real app, this would open a rescheduling modal
    alert("Rescheduling functionality will be implemented soon.");
  };

  const handleJoinMeeting = (consultationId: string) => {
    console.log("Joining meeting for consultation:", consultationId);
    // In a real app, this would open the video call interface
    window.open("https://meet.google.com", "_blank");
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
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleReschedule(consultation.id)}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Reschedule
                </Button>
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
