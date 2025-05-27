import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Clock, MapPin, Video, Phone, MessageSquare } from "lucide-react";

const ResearchAidsAppointments = () => {
  const [view, setView] = useState("upcoming");

  const appointments = [
    {
      id: 1,
      title: "Statistical Analysis Discussion",
      client: "Dr. Sarah Johnson",
      date: "2024-01-28",
      time: "2:00 PM",
      duration: "1 hour",
      type: "video",
      status: "confirmed",
      description: "Review preliminary findings and discuss next steps",
      meetingLink: "https://meet.google.com/abc-defg-hij"
    },
    {
      id: 2,
      title: "Literature Review Progress Meeting",
      client: "Prof. Michael Chen",
      date: "2024-01-30",
      time: "10:00 AM",
      duration: "45 minutes",
      type: "video",
      status: "pending",
      description: "Present completed sections and get feedback",
      meetingLink: "https://zoom.us/j/123456789"
    },
    {
      id: 3,
      title: "Data Collection Planning",
      client: "Dr. Marie Dubois",
      date: "2024-02-02",
      time: "3:30 PM",
      duration: "1.5 hours",
      type: "in-person",
      status: "confirmed",
      description: "Plan field work methodology and timeline",
      location: "University of Yaoundé I, Room 205"
    }
  ];

  const pastAppointments = [
    {
      id: 4,
      title: "Project Kickoff Meeting",
      client: "Dr. Sarah Johnson",
      date: "2024-01-20",
      time: "11:00 AM",
      duration: "1 hour",
      type: "video",
      status: "completed",
      description: "Initial project discussion and requirements gathering",
      meetingLink: "https://meet.google.com/xyz-uvw-rst"
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-green-600">Confirmed</Badge>;
      case "pending":
        return <Badge variant="secondary">Pending Confirmation</Badge>;
      case "completed":
        return <Badge className="bg-blue-600">Completed</Badge>;
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Video className="h-4 w-4" />;
      case "phone":
        return <Phone className="h-4 w-4" />;
      case "in-person":
        return <MapPin className="h-4 w-4" />;
      default:
        return <Calendar className="h-4 w-4" />;
    }
  };

  const currentAppointments = view === "upcoming" ? appointments : pastAppointments;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Appointments</h2>
        <div className="flex space-x-2">
          <Button 
            variant={view === "upcoming" ? "default" : "outline"} 
            onClick={() => setView("upcoming")}
          >
            Upcoming
          </Button>
          <Button 
            variant={view === "past" ? "default" : "outline"} 
            onClick={() => setView("past")}
          >
            Past
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {currentAppointments.map((appointment) => (
          <Card key={appointment.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <CardTitle className="text-lg">{appointment.title}</CardTitle>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src="/placeholder-avatar.jpg" alt={appointment.client} />
                      <AvatarFallback>{appointment.client.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <span>{appointment.client}</span>
                  </div>
                </div>
                {getStatusBadge(appointment.status)}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">{appointment.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="flex items-center space-x-2 text-sm">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span>{appointment.date}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span>{appointment.time} ({appointment.duration})</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  {getTypeIcon(appointment.type)}
                  <span className="capitalize">{appointment.type}</span>
                </div>
              </div>

              {appointment.meetingLink && (
                <div className="mb-4 p-2 bg-blue-50 rounded text-sm">
                  <strong>Meeting Link:</strong> 
                  <a href={appointment.meetingLink} className="text-blue-600 ml-1" target="_blank" rel="noopener noreferrer">
                    {appointment.meetingLink}
                  </a>
                </div>
              )}

              {appointment.location && (
                <div className="mb-4 p-2 bg-green-50 rounded text-sm">
                  <strong>Location:</strong> {appointment.location}
                </div>
              )}

              <div className="flex space-x-2">
                {appointment.status === "confirmed" && view === "upcoming" && (
                  <>
                    {appointment.type === "video" && (
                      <Button size="sm">
                        <Video className="h-4 w-4 mr-1" />
                        Join Meeting
                      </Button>
                    )}
                    <Button variant="outline" size="sm">
                      <MessageSquare className="h-4 w-4 mr-1" />
                      Message Client
                    </Button>
                  </>
                )}
                {appointment.status === "pending" && (
                  <>
                    <Button size="sm">Confirm</Button>
                    <Button variant="outline" size="sm">Request Changes</Button>
                  </>
                )}
                <Button variant="ghost" size="sm">
                  <Calendar className="h-4 w-4 mr-1" />
                  Add to Calendar
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ResearchAidsAppointments;
