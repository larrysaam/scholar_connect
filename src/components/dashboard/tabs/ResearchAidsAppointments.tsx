
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Clock, Video, Globe, CheckCircle, XCircle } from "lucide-react";

interface Appointment {
  id: string;
  studentName: string;
  studentAvatar?: string;
  projectTitle: string;
  dateTime: string;
  duration: string;
  meetingType: "google-meet" | "phone" | "in-person";
  status: "scheduled" | "completed" | "cancelled";
  meetingLink?: string;
  timeZone: string;
}

const mockAppointments: Appointment[] = [
  {
    id: "1",
    studentName: "Kome Divine",
    projectTitle: "Data Cleaning Consultation",
    dateTime: "2024-01-25 14:00",
    duration: "1 hour",
    meetingType: "google-meet",
    status: "scheduled",
    meetingLink: "https://meet.google.com/abc-defg-hij",
    timeZone: "WAT (GMT+1)"
  },
  {
    id: "2",
    studentName: "Sama Njoya",
    projectTitle: "Thesis Review Session",
    dateTime: "2024-01-26 10:00",
    duration: "45 minutes",
    meetingType: "google-meet",
    status: "scheduled",
    meetingLink: "https://meet.google.com/xyz-uvwx-123",
    timeZone: "WAT (GMT+1)"
  },
  {
    id: "3",
    studentName: "Paul Biya Jr.",
    projectTitle: "GIS Mapping Discussion",
    dateTime: "2024-01-20 16:00",
    duration: "30 minutes",
    meetingType: "google-meet",
    status: "completed",
    timeZone: "WAT (GMT+1)"
  }
];

const ResearchAidsAppointments = () => {
  const [appointments] = useState(mockAppointments);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled": return "bg-blue-100 text-blue-800";
      case "completed": return "bg-green-100 text-green-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getMeetingIcon = (type: string) => {
    switch (type) {
      case "google-meet": return <Video className="h-4 w-4" />;
      case "phone": return <Clock className="h-4 w-4" />;
      default: return <Calendar className="h-4 w-4" />;
    }
  };

  const handleAcceptAppointment = (id: string) => {
    console.log("Accepting appointment:", id);
  };

  const handleRescheduleAppointment = (id: string) => {
    console.log("Rescheduling appointment:", id);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Appointments</h2>
        <p className="text-gray-600">Manage your consultations and meetings with students</p>
      </div>

      {/* Booking Calendar Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Booking Calendar</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">3</p>
              <p className="text-sm text-gray-600">Upcoming This Week</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">12</p>
              <p className="text-sm text-gray-600">Completed This Month</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-2xl font-bold text-purple-600">95%</p>
              <p className="text-sm text-gray-600">Attendance Rate</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Appointments List */}
      <div className="space-y-4">
        {appointments.map((appointment) => (
          <Card key={appointment.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={appointment.studentAvatar} alt={appointment.studentName} />
                    <AvatarFallback>
                      {appointment.studentName.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-lg">{appointment.studentName}</h3>
                    <p className="text-gray-600">{appointment.projectTitle}</p>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(appointment.dateTime).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{new Date(appointment.dateTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        {getMeetingIcon(appointment.meetingType)}
                        <span>{appointment.duration}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Globe className="h-4 w-4" />
                        <span>{appointment.timeZone}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge className={getStatusColor(appointment.status)}>
                    {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                  </Badge>
                  {appointment.status === "scheduled" && (
                    <div className="flex space-x-2">
                      {appointment.meetingLink && (
                        <Button size="sm" asChild>
                          <a href={appointment.meetingLink} target="_blank" rel="noopener noreferrer">
                            <Video className="h-4 w-4 mr-1" />
                            Join Meeting
                          </a>
                        </Button>
                      )}
                      <Button size="sm" variant="outline" onClick={() => handleRescheduleAppointment(appointment.id)}>
                        Reschedule
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Features */}
      <Card>
        <CardHeader>
          <CardTitle>Appointment Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <Video className="h-8 w-8 text-blue-600 mx-auto mb-3" />
              <h4 className="font-medium mb-2">Google Meet Integration</h4>
              <p className="text-sm text-gray-600">Seamless video consultations with automatic meeting links</p>
            </div>
            <div className="text-center">
              <Globe className="h-8 w-8 text-green-600 mx-auto mb-3" />
              <h4 className="font-medium mb-2">Time Zone Sync</h4>
              <p className="text-sm text-gray-600">Automatic time zone conversion for international clients</p>
            </div>
            <div className="text-center">
              <Calendar className="h-8 w-8 text-purple-600 mx-auto mb-3" />
              <h4 className="font-medium mb-2">Flexible Scheduling</h4>
              <p className="text-sm text-gray-600">Easy rescheduling and calendar management</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResearchAidsAppointments;
