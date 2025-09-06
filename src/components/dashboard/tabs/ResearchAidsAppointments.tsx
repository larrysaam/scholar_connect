import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar, Clock, MapPin, Video, Phone, MessageSquare, Loader2, Upload, FileText, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

interface AppointmentData {
  id: string;
  title: string;
  client_name: string;
  client_id: string;
  scheduled_date: string;
  scheduled_time: string;
  duration_minutes: number;
  meeting_type: 'video' | 'phone' | 'in-person';
  status: string;
  description: string;
  meeting_link?: string;
  payment_status: string;
  service_title?: string;
  avatar_url?: string;
}

interface SharedDocument {
  name: string;
  url: string;
}

const ResearchAidsAppointments = () => {
  const [view, setView] = useState("upcoming"); // Only show upcoming/past
  const [appointments, setAppointments] = useState<AppointmentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [clientMessage, setClientMessage] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [actionLoading, setActionLoading] = useState<{ [id: string]: boolean }>({});
  const [uploading, setUploading] = useState<{ [id: string]: boolean }>({});
  const [documents, setDocuments] = useState<{ [id: string]: SharedDocument[] }>({});
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchAppointments();
    }
  }, [user]);

  const fetchDocumentsForAppointments = useCallback(async (appointments: AppointmentData[]) => {
    const docMap: { [id: string]: SharedDocument[] } = {};
    for (const apt of appointments) {
      const { data, error } = await supabase
        .from('service_bookings')
        .select('shared_documents')
        .eq('id', apt.id)
        .single();
      if (!error && data && Array.isArray(data.shared_documents)) {
        docMap[apt.id] = data.shared_documents;
      } else {
        docMap[apt.id] = [];
      }
    }
    setDocuments(docMap);
  }, []);

  const fetchAppointments = async () => {
    if (!user) return;
    setLoading(true);
    try {
      // Debug: log user id
      console.log('Current user id:', user.id);
      // Fetch all appointments for this aid from service_bookings, joined with consultation_services and users (client)
      const { data: bookings, error: bookingsError } = await supabase
        .from('service_bookings')
        .select(`
          *,
          consultation_services:service_id (
            title,
            description,
            duration_minutes
          ),
          users!client_id (
            name,
            email,
            avatar_url
          )
        `)
        .eq('provider_id', user.id)
        .order('scheduled_date', { ascending: true });
      console.log('Raw bookings from Supabase:', bookings, bookingsError);
      const processedAppointments: AppointmentData[] = (bookings || []).map(booking => ({
        id: booking.id,
        title: booking.consultation_services?.title || 'Consultation',
        client_name: booking['users']?.name || 'Unknown Client',
        client_id: booking.client_id,
        scheduled_date: booking.scheduled_date,
        scheduled_time: booking.scheduled_time,
        duration_minutes: booking.duration_minutes || booking.consultation_services?.duration_minutes || 60,
        meeting_type: 'video', // hardcoded fallback
        status: booking.status,
        description: booking.consultation_services?.description || booking.notes || '',
        meeting_link: booking.meeting_link,
        payment_status: booking.payment_status,
        service_title: booking.consultation_services?.title,
        avatar_url: booking['users']?.avatar_url || undefined
      }));
      setAppointments(processedAppointments);
      await fetchDocumentsForAppointments(processedAppointments);
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

  const handleConfirmAppointment = useCallback(async (appointmentId: string) => {
    setActionLoading(prev => ({ ...prev, [appointmentId]: true }));
    try {
      // 1. Call Supabase Edge Function to generate Google Meet link
      const { data, error: functionError } = await supabase.functions.invoke('generate-meet-link', {
        body: { booking_id: appointmentId },
      });
      if (functionError || !data?.meetLink) {
        toast({
          title: "Error",
          description: "Failed to generate Google Meet link.",
          variant: "destructive"
        });
        setActionLoading(prev => ({ ...prev, [appointmentId]: false }));
        return;
      }
      // 2. Update booking status and meeting_link
      const { error: updateError } = await supabase
        .from('service_bookings')
        .update({ status: 'confirmed', meeting_link: data.meetLink })
        .eq('id', appointmentId);
      if (updateError) {
        toast({
          title: "Error",
          description: "Failed to update appointment status.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Appointment Confirmed",
          description: "The appointment has been confirmed and a Google Meet link was generated."
        });
        fetchAppointments();
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive"
      });
    } finally {
      setActionLoading(prev => ({ ...prev, [appointmentId]: false }));
    }
  }, [toast, fetchAppointments]);

  const handleCancelAppointment = useCallback(async (appointmentId: string) => {
    setActionLoading(prev => ({ ...prev, [appointmentId]: true }));
    try {
      const { error: updateError } = await supabase
        .from('service_bookings')
        .update({ status: 'cancelled' })
        .eq('id', appointmentId);
      if (updateError) {
        toast({
          title: "Error",
          description: "Failed to cancel appointment.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Appointment Cancelled",
          description: "The appointment has been cancelled."
        });
        fetchAppointments();
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive"
      });
    } finally {
      setActionLoading(prev => ({ ...prev, [appointmentId]: false }));
    }
  }, [toast, fetchAppointments]);

  const handleUploadDocument = async (appointmentId: string) => {
    if (!user) return;
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf,.doc,.docx,.jpg,.jpeg,.png,.txt';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      setUploading(prev => ({ ...prev, [appointmentId]: true }));
      try {
        const filePath = `consultation_documents/${appointmentId}/${user.id}/${file.name}`;
        const { error: uploadError } = await supabase.storage
          .from('lovable-uploads')
          .upload(filePath, file, { cacheControl: '3600', upsert: true });
        if (uploadError) throw uploadError;
        const { data: urlData } = supabase.storage
          .from('lovable-uploads')
          .getPublicUrl(filePath);
        if (!urlData.publicUrl) throw new Error('Could not get public URL for the uploaded file.');
        // Fetch current shared_documents
        const { data: currentBooking, error: fetchError } = await supabase
          .from('service_bookings')
          .select('shared_documents')
          .eq('id', appointmentId)
          .single();
        if (fetchError) throw fetchError;
        const existingDocs = Array.isArray(currentBooking?.shared_documents) ? currentBooking.shared_documents : [];
        const newDoc = { name: file.name, url: urlData.publicUrl };
        const updatedDocs = [...existingDocs, newDoc];
        const { error: updateError } = await supabase
          .from('service_bookings')
          .update({ shared_documents: updatedDocs })
          .eq('id', appointmentId);
        if (updateError) throw updateError;
        setDocuments(prev => ({ ...prev, [appointmentId]: updatedDocs }));
        toast({ title: 'Success', description: 'Document uploaded successfully.' });
      } catch (err: any) {
        toast({ title: 'Upload Failed', description: err.message, variant: 'destructive' });
      } finally {
        setUploading(prev => ({ ...prev, [appointmentId]: false }));
      }
    };
    input.click();
  };

  const handleDeleteDocument = async (appointmentId: string, docUrl: string) => {
    setUploading(prev => ({ ...prev, [appointmentId]: true }));
    try {
      // Remove from Supabase Storage (optional, only if you want to delete the file itself)
      const fileName = docUrl.split('/').pop();
      if (fileName) {
        await supabase.storage.from('lovable-uploads').remove([`consultation_documents/${appointmentId}/${user?.id}/${fileName}`]);
      }
      // Remove from shared_documents array
      const { data: currentBooking, error: fetchError } = await supabase
        .from('service_bookings')
        .select('shared_documents')
        .eq('id', appointmentId)
        .single();
      if (fetchError) throw fetchError;
      const existingDocs = Array.isArray(currentBooking?.shared_documents) ? currentBooking.shared_documents : [];
      const updatedDocs = existingDocs.filter((doc: SharedDocument) => doc.url !== docUrl);
      const { error: updateError } = await supabase
        .from('service_bookings')
        .update({ shared_documents: updatedDocs })
        .eq('id', appointmentId);
      if (updateError) throw updateError;
      setDocuments(prev => ({ ...prev, [appointmentId]: updatedDocs }));
      toast({ title: 'Document Removed', description: 'Document removed successfully.' });
    } catch (err: any) {
      toast({ title: 'Remove Failed', description: err.message, variant: 'destructive' });
    } finally {
      setUploading(prev => ({ ...prev, [appointmentId]: false }));
    }
  };

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

  const handleJoinMeeting = (meetingLink: string) => {
    window.open(meetingLink, '_blank');
    toast({
      title: "Joining Meeting",
      description: "Opening meeting in new tab"
    });
  };

  const handleMessageClient = async (clientId: string, clientName: string) => {
    if (!clientMessage.trim()) {
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
        user_id: clientId,
        title: `Message from Research Aid`,
        message: clientMessage,
        type: 'message',
        category: 'communication'
      });

      toast({
        title: "Message Sent",
        description: `Your message has been sent to ${clientName}`
      });
      setClientMessage("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive"
      });
    }
  };

  const handleAddToCalendar = (appointment: AppointmentData) => {
    try {
      const startDate = new Date(`${appointment.scheduled_date}T${appointment.scheduled_time}`);
      const endDate = new Date(startDate.getTime() + appointment.duration_minutes * 60000);
      
      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        throw new Error('Invalid date');
      }
      
      const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(appointment.title)}&dates=${startDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z/${endDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z&details=${encodeURIComponent(appointment.description)}`;
      
      window.open(calendarUrl, '_blank');
      
      toast({
        title: "Calendar Event",
        description: "Opening calendar to add event"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Unable to create calendar event",
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
    return appointments.filter(apt => {
      const aptDate = new Date(`${apt.scheduled_date}T${apt.scheduled_time}`);
      return aptDate >= now && apt.status === 'confirmed';
    });
  };

  const getPastAppointments = () => {
    const now = new Date();
    return appointments.filter(apt => {
      const aptDate = new Date(`${apt.scheduled_date}T${apt.scheduled_time}`);
      return aptDate < now || apt.status === 'completed';
    });
  };

  const getFilteredAppointments = () => {
    if (statusFilter === 'all') return appointments;
    return appointments.filter(apt => apt.status === statusFilter);
  };

  const getCurrentData = () => {
    switch (view) {
      case 'upcoming':
        return getUpcomingAppointments();
      case 'past':
        return getPastAppointments();
      default:
        return [];
    }
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
        <h2 className="text-2xl font-bold">Appointments</h2>
        <div className="flex space-x-2 items-center">
          <label htmlFor="statusFilter" className="text-sm font-medium">Status:</label>
          <select
            id="statusFilter"
            className="border rounded px-2 py-1 text-sm"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="confirmed">Confirmed</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {getFilteredAppointments().length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">
                No appointments found.
              </p>
            </CardContent>
          </Card>
        ) : (
          getFilteredAppointments().map((appointment) => (
            <Card key={appointment.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      {appointment.avatar_url ? (
                        <img src={appointment.avatar_url} alt={appointment.client_name} className="h-7 w-7 rounded-full inline-block mr-2" />
                      ) : (
                        <Avatar className="h-6 w-6 inline-block mr-2">
                          <AvatarFallback>{appointment.client_name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                      )}
                      {appointment.title}
                    </CardTitle>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback>{appointment.client_name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <span>{appointment.client_name}</span>
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
                <div className="mb-2">
                  {documents[appointment.id] && documents[appointment.id].length > 0 && (
                    <div className="mb-2">
                      <span className="font-medium text-sm text-green-700">Uploaded Documents:</span>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {documents[appointment.id].map((doc, idx) => (
                          <div key={idx} className="flex items-center">
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-green-700 border-green-300"
                              onClick={() => window.open(doc.url, '_blank')}
                            >
                              <FileText className="h-4 w-4 mr-1" />
                              {doc.name}
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-5 w-5 ml-1"
                              onClick={() => handleDeleteDocument(appointment.id, doc.url)}
                              disabled={uploading[appointment.id]}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {appointment.status === 'confirmed' && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-1"
                      onClick={() => handleUploadDocument(appointment.id)}
                      disabled={uploading[appointment.id]}
                    >
                      {uploading[appointment.id] ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Upload className="h-4 w-4 mr-1" />}
                      Upload Document
                    </Button>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {appointment.status === "pending" && (
                    <>
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white"
                        disabled={actionLoading[appointment.id]}
                        onClick={() => handleConfirmAppointment(appointment.id)}
                      >
                        {actionLoading[appointment.id] ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : null}
                        Confirm
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-red-600 text-red-600 hover:bg-red-50"
                        disabled={actionLoading[appointment.id]}
                        onClick={() => handleCancelAppointment(appointment.id)}
                      >
                        {actionLoading[appointment.id] ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : null}
                        Cancel
                      </Button>
                    </>
                  )}
                  {appointment.status === "confirmed" && (
                    <>
                      {appointment.meeting_type === "video" && appointment.meeting_link && (
                        <Button size="sm" onClick={() => handleJoinMeeting(appointment.meeting_link)}>
                          <Video className="h-4 w-4 mr-1" />
                          Join Meeting
                        </Button>
                      )}
                      <Button
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                        disabled={actionLoading[appointment.id]}
                        onClick={async () => {
                          setActionLoading(prev => ({ ...prev, [appointment.id]: true }));
                          try {
                            const { error: updateError } = await supabase
                              .from('service_bookings')
                              .update({ status: 'completed' })
                              .eq('id', appointment.id);
                            if (updateError) {
                              toast({
                                title: "Error",
                                description: "Failed to mark appointment as completed.",
                                variant: "destructive"
                              });
                            } else {
                              toast({
                                title: "Appointment Completed",
                                description: "The appointment has been marked as completed."
                              });
                              fetchAppointments();
                            }
                          } catch (err) {
                            toast({
                              title: "Error",
                              description: err.message,
                              variant: "destructive"
                            });
                          } finally {
                            setActionLoading(prev => ({ ...prev, [appointment.id]: false }));
                          }
                        }}
                      >
                        {actionLoading[appointment.id] ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : null}
                        Mark as Completed
                      </Button>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <MessageSquare className="h-4 w-4 mr-1" />
                            Message Client
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Message {appointment.client_name}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="clientMessage">Message</Label>
                              <Textarea
                                id="clientMessage"
                                placeholder="Write your message..."
                                value={clientMessage}
                                onChange={(e) => setClientMessage(e.target.value)}
                                rows={4}
                              />
                            </div>
                            <Button 
                              onClick={() => handleMessageClient(appointment.client_id, appointment.client_name)} 
                              className="w-full"
                            >
                              Send Message
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </>
                  )}
                  <Button variant="ghost" size="sm" onClick={() => handleAddToCalendar(appointment)}>
                    <Calendar className="h-4 w-4 mr-1" />
                    Add to Calendar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default ResearchAidsAppointments;
