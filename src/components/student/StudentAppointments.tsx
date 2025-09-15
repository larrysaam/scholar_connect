import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar, Clock, MapPin, Video, Phone, MessageSquare, Loader2, Star, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

interface AppointmentRequest {
  id: string;
  research_aid_name: string;
  research_aid_id: string;
  service_title: string;
  requested_date: string;
  requested_time: string;
  duration_minutes: number;
  meeting_type: 'video' | 'phone' | 'in-person';
  project_description: string;
  specific_requirements?: string;
  status: string;
  payment_status: string;
  rejection_reason?: string;
  created_at: string;
}

interface ConfirmedAppointment {
  id: string;
  title: string;
  provider_name: string;
  provider_id: string;
  scheduled_date: string;
  scheduled_time: string;
  duration_minutes: number;
  meeting_type: 'video' | 'phone' | 'in-person';
  status: string;
  description: string;
  meeting_link?: string;
  location?: string;
  project_description?: string;
  payment_status: string;
}

const StudentAppointments = () => {
  const [view, setView] = useState("requests"); // requests, upcoming, past
  const [appointmentRequests, setAppointmentRequests] = useState<AppointmentRequest[]>([]);
  const [confirmedAppointments, setConfirmedAppointments] = useState<ConfirmedAppointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchAppointments();
    }
  }, [user]);

  const fetchAppointments = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Fetch appointment requests
      const { data: requests, error: requestsError } = await supabase
        .from('appointment_requests')
        .select(`
          *,
          research_aid:research_aid_id (
            name,
            email
          ),
          consultation_services:service_id (
            title,
            description
          )
        `)
        .eq('student_id', user.id)
        .order('created_at', { ascending: false });

      if (requestsError) {
        console.error('Error fetching requests:', requestsError);
      }

      // Fetch confirmed appointments (service bookings)
      const { data: bookings, error: bookingsError } = await supabase
        .from('service_bookings')
        .select(`
          *,
          consultation_services:service_id (
            title,
            description
          ),
          provider:provider_id (
            name,
            email
          )
        `)
        .eq('client_id', user.id)
        .order('scheduled_date', { ascending: true });

      if (bookingsError) {
        console.error('Error fetching bookings:', bookingsError);
      }

      // Process appointment requests
      const processedRequests: AppointmentRequest[] = (requests || []).map(request => ({
        id: request.id,
        research_aid_name: request.research_aid?.name || 'Unknown Research Aid',
        research_aid_id: request.research_aid_id,
        service_title: request.consultation_services?.title || 'Consultation',
        requested_date: request.requested_date,
        requested_time: request.requested_time,
        duration_minutes: request.duration_minutes || 60,
        meeting_type: request.meeting_type || 'video',
        project_description: request.project_description || '',
        specific_requirements: request.specific_requirements,
        status: request.status,
        payment_status: request.payment_status,
        rejection_reason: request.rejection_reason,
        created_at: request.created_at
      }));

      // Process confirmed appointments
      const processedAppointments: ConfirmedAppointment[] = (bookings || []).map(booking => ({
        id: booking.id,
        title: booking.consultation_services?.title || 'Consultation',
        provider_name: booking.provider?.name || 'Unknown Provider',
        provider_id: booking.provider_id,
        scheduled_date: booking.scheduled_date,
        scheduled_time: booking.scheduled_time,
        duration_minutes: booking.duration_minutes || 60,
        meeting_type: booking.meeting_type || 'video',
        status: booking.status,
        description: booking.consultation_services?.description || booking.notes || '',
        meeting_link: booking.meeting_link,
        location: booking.location,
        project_description: booking.project_description,
        payment_status: booking.payment_status
      }));

      setAppointmentRequests(processedRequests);
      setConfirmedAppointments(processedAppointments);

    } catch (error) {
      console.error('Error fetching appointments:', error);
      toast({
        title: "Error",
        description: "Failed to load appointments",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary">Pending Review</Badge>;
      case "accepted":
      case "confirmed":
        return <Badge className="bg-green-600">Confirmed</Badge>;
      case "rejected":
        return <Badge variant="destructive">Declined</Badge>;
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

  const handleJoinMeeting = (meetingLink: string) => {
    window.open(meetingLink, '_blank');
    toast({
      title: "Joining Meeting",
      description: "Opening meeting in new tab"
    });
  };

  const handleMessageProvider = async (providerId: string, providerName: string) => {
    if (!message.trim()) {
      toast({
        title: "Error",
        description: "Please write a message",
        variant: "destructive"
      });
      return;
    }

    try {
      // Send notification as message
      await supabase.from('notifications').insert({
        user_id: providerId,
        title: `Message from Student`,
        message: message,
        type: 'message',
        category: 'communication'
      });

      toast({
        title: "Message Sent",
        description: `Your message has been sent to ${providerName}`
      });
      setMessage("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive"
      });
    }
  };

  const handleCancelRequest = async (requestId: string) => {
    try {
      const { error } = await supabase
        .from('appointment_requests')
        .update({ status: 'cancelled' })
        .eq('id', requestId);

      if (error) throw error;

      toast({
        title: "Request Cancelled",
        description: "Your appointment request has been cancelled"
      });

      fetchAppointments();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to cancel request",
        variant: "destructive"
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getUpcomingAppointments = () => {
    const now = new Date();
    return confirmedAppointments.filter(apt => {
      const aptDate = new Date(`${apt.scheduled_date}T${apt.scheduled_time}`);
      return aptDate >= now && apt.status === 'confirmed';
    });
  };

  const getPastAppointments = () => {
    const now = new Date();
    return confirmedAppointments.filter(apt => {
      const aptDate = new Date(`${apt.scheduled_date}T${apt.scheduled_time}`);
      return aptDate < now || apt.status === 'completed';
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading appointments...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">My Appointments</h2>
        <div className="flex space-x-2">
          <Button 
            variant={view === "requests" ? "default" : "outline"} 
            onClick={() => setView("requests")}
          >
            Requests ({appointmentRequests.filter(r => r.status === 'pending').length})
          </Button>
          <Button 
            variant={view === "upcoming" ? "default" : "outline"} 
            onClick={() => setView("upcoming")}
          >
            Upcoming ({getUpcomingAppointments().length})
          </Button>
          <Button 
            variant={view === "past" ? "default" : "outline"} 
            onClick={() => setView("past")}
          >
            Past ({getPastAppointments().length})
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {view === "requests" && (
          <>
            {appointmentRequests.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No appointment requests yet.</p>
                </CardContent>
              </Card>
            ) : (
              appointmentRequests.map((request) => (
                <Card key={request.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <CardTitle className="text-lg">Appointment Request</CardTitle>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback>{request.research_aid_name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <span>{request.research_aid_name}</span>
                        </div>
                      </div>
                      {getStatusBadge(request.status)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-sm text-gray-700">Service</h4>
                        <p className="text-sm">{request.service_title}</p>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex items-center space-x-2 text-sm">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <span>{formatDate(request.requested_date)}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <span>{formatTime(request.requested_time)} ({request.duration_minutes} min)</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm">
                          {getTypeIcon(request.meeting_type)}
                          <span className="capitalize">{request.meeting_type}</span>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-sm text-gray-700 mb-2">Project Description</h4>
                        <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                          {request.project_description}
                        </p>
                      </div>

                      {request.specific_requirements && (
                        <div>
                          <h4 className="font-medium text-sm text-gray-700 mb-2">Specific Requirements</h4>
                          <p className="text-sm text-gray-600 bg-blue-50 p-3 rounded">
                            {request.specific_requirements}
                          </p>
                        </div>
                      )}

                      {request.status === 'rejected' && request.rejection_reason && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded">
                          <div className="flex items-start space-x-2">
                            <AlertCircle className="h-4 w-4 text-red-500 mt-0.5" />
                            <div>
                              <h4 className="font-medium text-sm text-red-800">Request Declined</h4>
                              <p className="text-sm text-red-700">{request.rejection_reason}</p>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <span>Payment Status:</span>
                          <Badge variant={request.payment_status === 'paid' ? 'default' : 'secondary'}>
                            {request.payment_status}
                          </Badge>
                        </div>
                        
                        {request.status === 'pending' && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleCancelRequest(request.id)}
                          >
                            Cancel Request
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </>
        )}

        {(view === "upcoming" || view === "past") && (
          <>
            {(view === "upcoming" ? getUpcomingAppointments() : getPastAppointments()).length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">
                    No {view} appointments.
                  </p>
                </CardContent>
              </Card>
            ) : (
              (view === "upcoming" ? getUpcomingAppointments() : getPastAppointments()).map((appointment) => (
                <Card key={appointment.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <CardTitle className="text-lg">{appointment.title}</CardTitle>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback>{appointment.provider_name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <span>{appointment.provider_name}</span>
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
                        <span>{formatDate(appointment.scheduled_date)}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span>{formatTime(appointment.scheduled_time)} ({appointment.duration_minutes} min)</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        {getTypeIcon(appointment.meeting_type)}
                        <span className="capitalize">{appointment.meeting_type}</span>
                      </div>
                    </div>

                    {appointment.meeting_link && (
                      <div className="mb-4 p-2 bg-blue-50 rounded text-sm">
                        <strong>Meeting Link:</strong> 
                        <a href={appointment.meeting_link} className="text-blue-600 ml-1" target="_blank" rel="noopener noreferrer">
                          {appointment.meeting_link}
                        </a>
                      </div>
                    )}

                    {appointment.location && (
                      <div className="mb-4 p-2 bg-green-50 rounded text-sm">
                        <strong>Location:</strong> {appointment.location}
                      </div>
                    )}

                    {appointment.project_description && (
                      <div className="mb-4 p-2 bg-gray-50 rounded text-sm">
                        <strong>Project:</strong> {appointment.project_description}
                      </div>
                    )}

                    <div className="flex flex-wrap gap-2">
                      {appointment.status === "confirmed" && view === "upcoming" && (
                        <>
                          {appointment.meeting_type === "video" && appointment.meeting_link && (
                            <Button size="sm" onClick={() => handleJoinMeeting(appointment.meeting_link)}>
                              <Video className="h-4 w-4 mr-1" />
                              Join Meeting
                            </Button>
                          )}
                          
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                <MessageSquare className="h-4 w-4 mr-1" />
                                Message Provider
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[500px]">
                              <DialogHeader className="pb-4 border-b bg-blue-600 text-white p-4 -m-6 mb-6">
                                <DialogTitle className="text-white flex items-center space-x-3">
                                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-sm font-medium">
                                    {appointment.provider_name.split(' ').map(n => n[0]).join('')}
                                  </div>
                                  <span>Message {appointment.provider_name}</span>
                                </DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <Label htmlFor="message" className="text-sm font-medium text-gray-700">Message</Label>
                                  <Textarea
                                    id="message"
                                    placeholder="Write your message..."
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    rows={4}
                                    className="mt-2 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500 resize-none"
                                  />
                                </div>
                                <Button 
                                  onClick={() => handleMessageProvider(appointment.provider_id, appointment.provider_name)} 
                                  className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-full px-6 py-3"
                                  disabled={!message.trim()}
                                >
                                  <MessageSquare className="h-4 w-4 mr-2" />
                                  Send Message
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </>
                      )}

                      {view === "past" && appointment.status === "completed" && (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Star className="h-4 w-4 mr-1" />
                              Rate & Review
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Rate Your Experience</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <p>Rate your session with {appointment.provider_name}</p>
                              {/* Rating component would go here */}
                              <Button className="w-full">
                                Submit Review
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default StudentAppointments;