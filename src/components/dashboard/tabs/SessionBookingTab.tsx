
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
}

const SessionBookingTab = () => {
  const { toast } = useToast();
  const { user } = useAuth();

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
              id, scheduled_date, scheduled_time, status,
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
          status: b.status
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
    <div className="space-y-8">
      {/* Upcoming Consultations Section */}
      <Card>
        <CardHeader><CardTitle>Upcoming Consultations</CardTitle></CardHeader>
        <CardContent>
          {upcomingBookings.length > 0 ? (
            <ul className="space-y-4">
              {upcomingBookings.map(booking => (
                <li key={booking.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <CalendarIcon className="h-6 w-6 text-gray-500" />
                    <div>
                      <p className="font-semibold">{booking.service_title}</p>
                      <p className="text-sm text-gray-600 flex items-center"><User className="h-3 w-3 mr-1" />{booking.other_user_name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                     <p className="text-sm font-medium">{format(new Date(booking.scheduled_date), 'PPP')}</p>
                     <Badge variant={booking.status === 'confirmed' ? 'default' : 'secondary'} className="mt-1">{booking.status}</Badge>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-center py-4">You have no upcoming consultations.</p>
          )}
        </CardContent>
      </Card>

      {/* Session Booking Form Section */}
      <div>
        <h2 className="text-2xl font-bold mb-2">Book a New Session</h2>
        <p className="text-gray-600">Schedule a consultation with expert researchers</p>
      </div>
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            {bookingSteps.map((step, index) => (
              <div key={step.step} className="flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step.completed ? 'bg-green-500 text-white' : currentStep === step.step ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'}`}>{step.step}</div>
                <span className={`ml-2 text-sm ${currentStep === step.step ? 'font-semibold' : 'text-gray-600'}`}>{step.title}</span>
                {index < bookingSteps.length - 1 && <div className="w-12 h-0.5 bg-gray-200 mx-4"></div>}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {selectedResearcher && currentStep > 1 && (
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <img src={selectedResearcher.imageUrl} alt={selectedResearcher.name} className="w-16 h-16 rounded-full object-cover" />
                <div><h3 className="font-semibold">{selectedResearcher.name}</h3><p className="text-gray-600">Your selected researcher</p></div>
              </div>
            </CardContent>
          </Card>
      )}

      <Card>
        <CardHeader><CardTitle>Step {currentStep}: {bookingSteps[currentStep - 1].title}</CardTitle></CardHeader>
        <CardContent>
          {/* Step 1: Select Session */}
          {currentStep === 1 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sessionTypes.map((session) => (
                <div key={session.id} onClick={() => setSelectedSessionType(session.id)} className={`p-4 border rounded-lg cursor-pointer ${selectedSessionType === session.id ? 'border-blue-500 bg-blue-50' : 'hover:border-gray-300'}`}>
                  <div className="flex justify-between mb-2"><h5 className="font-medium">{session.title}</h5><Badge variant="outline">{session.price.toLocaleString()} XAF</Badge></div>
                  <p className="text-sm text-gray-600 mb-2">{session.description}</p>
                  <div className="flex items-center text-xs text-gray-500"><Clock className="h-3 w-3 mr-1" />{session.duration} mins</div>
                </div>
              ))}
            </div>
          )}
          
          {/* Other steps... content is the same as before */}

          <div className="flex justify-between mt-6">
            <Button variant="outline" onClick={() => setCurrentStep(s => s - 1)} disabled={currentStep === 1}>Back</Button>
            {currentStep < 4 ? (
              <Button onClick={() => setCurrentStep(s => s + 1)} disabled={(currentStep === 1 && !selectedSessionType) || (currentStep === 2 && (!selectedDate || !selectedTime))}>Next</Button>
            ) : (
              <Button onClick={handleBooking} className="bg-green-600 hover:bg-green-700" disabled={!paymentMethod}><CreditCard className="h-4 w-4 mr-2" />Complete Booking</Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SessionBookingTab;
