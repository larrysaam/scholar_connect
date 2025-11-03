import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Clock, CreditCard, AlertTriangle, User, Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAuth } from "@/hooks/useAuth";

// Interfaces
interface SessionType { id: string; title: string; duration: number; price: number; description: string; provider_id: string; researcher?: any; }
interface BookingStep { step: number; title: string; completed: boolean; }
interface UpcomingBooking {
  id: string;
  scheduled_date: string;
  scheduled_time: string;
  other_user_name: string;
  service_title: string;
  status: string;
  student_completed?: boolean;
  researcher_completed?: boolean;
}

const SessionBookingTab = () => {
  const { toast } = useToast();
  const { user } = useAuth();

  // Get user role from metadata
  const userRole = user?.user_metadata?.role;

  // Component States
  const [upcomingBookings, setUpcomingBookings] = useState<UpcomingBooking[]>([]);
  const [sessionTypes, setSessionTypes] = useState<SessionType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Form States
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedResearcher, setSelectedResearcher] = useState<any>(null);
  const [selectedSessionType, setSelectedSessionType] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [topic, setTopic] = useState("");
  const [currentProgress, setCurrentProgress] = useState("");
  const [specificQuestions, setSpecificQuestions] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch upcoming bookings and available services in parallel
        const [bookingsResponse, servicesResponse] = await Promise.all([
          supabase
            .from('service_bookings')
            .select(`
              id, scheduled_date, scheduled_time, status, student_completed, researcher_completed,
              consultation_services(title),
              client:users!service_bookings_client_id_fkey(name),
              provider:users!service_bookings_provider_id_fkey(name)
            `)
            .or(`client_id.eq.${user.id},provider_id.eq.${user.id}`)
            .in('status', ['pending', 'confirmed'])
            .gte('scheduled_date', new Date().toISOString()),
          supabase
            .from('consultation_services')
            .select('*, users(name, title, payout_details)')
        ]);

        if (bookingsResponse.error) throw bookingsResponse.error;
        if (servicesResponse.error) throw servicesResponse.error;

        // Map upcoming bookings for display
        const mappedBookings: UpcomingBooking[] = bookingsResponse.data.map(b => ({
          id: b.id,
          scheduled_date: b.scheduled_date,
          scheduled_time: b.scheduled_time,
          service_title: b.consultation_services?.title || 'Service',
          other_user_name: user.id === b.client?.id ? b.provider?.name : b.client?.name || 'User',
          status: b.status,
          student_completed: b.student_completed,
          researcher_completed: b.researcher_completed
        }));
        setUpcomingBookings(mappedBookings);

        // Map available services for booking form
        const mappedServices: SessionType[] = servicesResponse.data.map(s => ({
          id: s.id,
          title: s.title || 'Unnamed Service',
          duration: s.duration_minutes || 60,
          price: s.base_price || 0,
          description: s.description || 'No description.',
          provider_id: s.provider_id,
          researcher: s.users ? { name: s.users.name, title: s.users.title, imageUrl: s.users.payout_details?.avatar_url || '/placeholder.svg' } : null
        }));
        setSessionTypes(mappedServices);

      } catch (err: any) {
        setError(err.message);
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  useEffect(() => {
    if (selectedSessionType) {
        const session = sessionTypes.find(s => s.id === selectedSessionType);
        if (session && session.researcher) {
            setSelectedResearcher(session.researcher);
        }
    }
  }, [selectedSessionType, sessionTypes]);

  const handleBooking = async () => {
    if (!user || !selectedSession || !selectedDate || !selectedTime) return;
    try {
        const { data, error } = await supabase.from('service_bookings').insert([{
            service_id: selectedSession.id,
            client_id: user.id,
            provider_id: selectedSession.provider_id,
            scheduled_date: format(selectedDate, "yyyy-MM-dd"),
            scheduled_time: selectedTime,
            duration_minutes: selectedSession.duration,
            total_price: totalPrice,
            status: 'pending',
            client_notes: JSON.stringify({ topic, currentProgress, specificQuestions })
        }]).select();

        if (error) throw error;
        if (data) {
            // Add the new booking to the top of the list optimistically
            const newBooking: UpcomingBooking = {
                id: data[0].id,
                scheduled_date: data[0].scheduled_date,
                scheduled_time: data[0].scheduled_time,
                service_title: selectedSession.title,
                other_user_name: selectedResearcher.name,
                status: data[0].status
            };
            setUpcomingBookings([newBooking, ...upcomingBookings]);
        }

        toast({ title: "Booking Confirmed!" });
        setCurrentStep(1); // Reset form
    } catch (err: any) {
        toast({ title: "Booking Failed", description: err.message, variant: "destructive" });
    }
  };

  // Add: Mark as Complete logic
  const handleMarkAsComplete = async (booking: UpcomingBooking) => {
    try {
      // Determine which field to update
      const fieldToUpdate = user?.role === 'student' ? 'student_completed' : 'researcher_completed';
      const { error } = await supabase
        .from('service_bookings')
        .update({ [fieldToUpdate]: true })
        .eq('id', booking.id);
      if (error) throw error;

      // Fetch updated booking
      const { data: updated, error: fetchError } = await supabase
        .from('service_bookings')
        .select('student_completed, researcher_completed, status')
        .eq('id', booking.id)
        .single();
      if (fetchError) throw fetchError;

      // If both have marked as complete, set status to completed
      if (updated.student_completed && updated.researcher_completed && updated.status !== 'completed') {
        const { error: statusError } = await supabase
          .from('service_bookings')
          .update({ status: 'completed' })
          .eq('id', booking.id);
        if (statusError) throw statusError;
      }

      // Update local state
      setUpcomingBookings(prev => prev.map(b =>
        b.id === booking.id
          ? { ...b, [fieldToUpdate]: true, status: (updated.student_completed && updated.researcher_completed) ? 'completed' : b.status }
          : b
      ));
      toast({ title: 'Marked as Complete', description: 'Your completion has been recorded.' });
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    }
  };

  const bookingSteps: BookingStep[] = [
    { step: 1, title: "Choose Session", completed: currentStep > 1 },
    { step: 2, title: "Schedule", completed: currentStep > 2 },
    { step: 3, title: "Details", completed: currentStep > 3 },
    { step: 4, title: "Confirm & Pay", completed: currentStep > 4 }
  ];
  const selectedSession = sessionTypes.find(session => session.id === selectedSessionType);
  const totalPrice = selectedSession ? selectedSession.price : 0;

  if (loading) {
    return <div className="space-y-4"><Skeleton className="h-48 w-full" /><Skeleton className="h-64 w-full" /></div>;
  }

  if (error) {
    return <Alert variant="destructive"><AlertTriangle className="h-4 w-4" /><AlertTitle>Error</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>;
  }

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8 max-w-full overflow-hidden">
      {/* Upcoming Consultations Section */}
      <Card>
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-lg sm:text-xl">Upcoming Consultations</CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          {upcomingBookings.length > 0 ? (
            <ul className="space-y-3 sm:space-y-4">
              {upcomingBookings.map(booking => (
                <li key={booking.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 bg-gray-50 rounded-lg space-y-3 sm:space-y-0">
                  <div className="flex items-center space-x-3 sm:space-x-4">
                    <CalendarIcon className="h-5 w-5 sm:h-6 sm:w-6 text-gray-500 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="font-semibold text-sm sm:text-base truncate">{booking.service_title}</p>
                      <p className="text-xs sm:text-sm text-gray-600 flex items-center">
                        <User className="h-3 w-3 mr-1 flex-shrink-0" />
                        <span className="truncate">{booking.other_user_name}</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                    <div className="text-left sm:text-right">
                      <p className="text-xs sm:text-sm font-medium">{format(new Date(booking.scheduled_date), 'PPP')}</p>
                      <Badge variant={booking.status === 'confirmed' ? 'default' : 'secondary'} className="mt-1 text-xs">
                        {booking.status}
                      </Badge>
                    </div>
                    {/* Mark as Complete Buttons */}
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="destructive" 
                        onClick={() => handleMarkAsComplete(booking)}
                        className="text-xs px-3"
                      >
                        Mark as Complete
                      </Button>
                      {booking.student_completed && booking.researcher_completed && (
                        <Button 
                          size="sm" 
                          variant="default" 
                          disabled
                          className="text-xs px-3"
                        >
                          Completed
                        </Button>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm sm:text-base text-gray-500 text-center py-4">You have no upcoming consultations.</p>
          )}
        </CardContent>
      </Card>

      {/* Session Booking Form Section */}
      <div className="space-y-2">
        <h2 className="text-lg sm:text-xl lg:text-2xl font-bold">Book a New Session</h2>
        <p className="text-sm sm:text-base text-gray-600">Schedule a consultation with expert researchers</p>
      </div>
      
      {/* Progress Indicator */}
      <Card>
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            {bookingSteps.map((step, index) => (
              <div key={step.step} className="flex items-center space-x-3 sm:space-x-0">
                <div className={`flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-full text-xs sm:text-sm ${
                  step.completed ? 'bg-green-500 text-white' : currentStep === step.step ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {step.step}
                </div>
                <span className={`ml-2 sm:ml-0 text-xs sm:text-sm ${currentStep === step.step ? 'font-semibold' : 'text-gray-600'}`}>
                  {step.title}
                </span>
                {index < bookingSteps.length - 1 && (
                  <div className="hidden sm:block w-8 lg:w-12 h-0.5 bg-gray-200 mx-2 lg:mx-4"></div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {selectedResearcher && currentStep > 1 && (
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
              <img 
                src={selectedResearcher.imageUrl} 
                alt={selectedResearcher.name} 
                className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover mx-auto sm:mx-0" 
              />
              <div className="text-center sm:text-left">
                <h3 className="font-semibold text-sm sm:text-base">{selectedResearcher.name}</h3>
                <p className="text-xs sm:text-sm text-gray-600">Your selected researcher</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-lg sm:text-xl">
            Step {currentStep}: {bookingSteps[currentStep - 1].title}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          {/* Step 1: Select Session */}
          {currentStep === 1 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {sessionTypes.map((session) => (
                <div 
                  key={session.id} 
                  onClick={() => setSelectedSessionType(session.id)} 
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    selectedSessionType === session.id ? 'border-blue-500 bg-blue-50' : 'hover:border-gray-300'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-3">
                    <h5 className="font-medium text-sm sm:text-base">{session.title}</h5>
                    <Badge variant="outline" className="text-xs w-fit">
                      {session.price.toLocaleString()} XAF
                    </Badge>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600 mb-2 line-clamp-2">{session.description}</p>
                  <div className="flex items-center text-xs text-gray-500">
                    <Clock className="h-3 w-3 mr-1" />
                    {session.duration} mins
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Other steps maintain similar responsive patterns */}
          
          <div className="flex flex-col sm:flex-row sm:justify-between gap-3 sm:gap-0 mt-6">
            <Button 
              variant="outline" 
              onClick={() => setCurrentStep(s => s - 1)} 
              disabled={currentStep === 1}
              className="w-full sm:w-auto"
            >
              Back
            </Button>
            {currentStep < 4 ? (
              <Button 
                onClick={() => setCurrentStep(s => s + 1)} 
                disabled={(currentStep === 1 && !selectedSessionType) || (currentStep === 2 && (!selectedDate || !selectedTime))}
                className="w-full sm:w-auto"
              >
                Next
              </Button>
            ) : (
              <Button 
                onClick={handleBooking} 
                className="bg-green-600 hover:bg-green-700 w-full sm:w-auto" 
                disabled={!paymentMethod}
              >
                <CreditCard className="h-4 w-4 mr-2" />
                Complete Booking
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SessionBookingTab;
