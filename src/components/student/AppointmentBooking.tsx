import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock, MapPin, Video, Phone, Star, Loader2, CreditCard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

interface ResearchAid {
  id: string;
  name: string;
  email: string;
  expertise: string[];
  rating: number;
  total_reviews: number;
  hourly_rate: number;
  bio: string;
  specialties: string[];
  years_experience: number;
  response_time: string;
  is_online: boolean;
}

interface ConsultationService {
  id: string;
  title: string;
  description: string;
  duration_minutes: number;
  category: string;
  user_id: string;
  pricing: {
    academic_level: string;
    price: number;
    currency: string;
  }[];
}

interface BookingFormData {
  research_aid_id: string;
  service_id: string;
  requested_date: string;
  requested_time: string;
  meeting_type: 'video' | 'phone' | 'in-person';
  project_description: string;
  specific_requirements: string;
  academic_level: string;
}

const AppointmentBooking = () => {
  // Helper function to format duration in a user-friendly way
  const formatDuration = (minutes: number) => {
    if (minutes >= 525600) { // 365 days or more
      const years = Math.round(minutes / 525600);
      return `${years} year${years > 1 ? 's' : ''}`;
    } else if (minutes >= 43200) { // 30 days or more
      const months = Math.round(minutes / 43200);
      return `${months} month${months > 1 ? 's' : ''}`;
    } else if (minutes >= 1440) { // 1 day or more
      const days = Math.round(minutes / 1440);
      return `${days} day${days > 1 ? 's' : ''}`;
    } else if (minutes >= 60) { // 1 hour or more
      const hours = Math.round(minutes / 60);
      return `${hours} hour${hours > 1 ? 's' : ''}`;
    } else {
      return `${minutes} minute${minutes > 1 ? 's' : ''}`;
    }
  };

  const [researchAids, setResearchAids] = useState<ResearchAid[]>([]);
  const [services, setServices] = useState<ConsultationService[]>([]);
  const [selectedAid, setSelectedAid] = useState<ResearchAid | null>(null);
  const [selectedService, setSelectedService] = useState<ConsultationService | null>(null);
  const [bookingForm, setBookingForm] = useState<BookingFormData>({
    research_aid_id: '',
    service_id: '',
    requested_date: '',
    requested_time: '',
    meeting_type: 'video',
    project_description: '',
    specific_requirements: '',
    academic_level: 'undergraduate'
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const { toast } = useToast();
  const { user, profile } = useAuth();

  useEffect(() => {
    fetchResearchAids();
  }, []);

  const fetchResearchAids = async () => {
    setLoading(true);
    try {
      // Fetch research aids with their profiles and services
      const { data: aids, error: aidsError } = await supabase
        .from('users')
        .select(`
          *,
          researcher_profiles:researcher_profiles(*),
          consultation_services:consultation_services(
            *,
            pricing:service_pricing(*)
          )
        `)
        .eq('role', 'aid')
        .eq('researcher_profiles.profile_visibility', 'public');

      if (aidsError) {
        console.error('Error fetching research aids:', aidsError);
        return;
      }

      // Process research aids data
      const processedAids: ResearchAid[] = (aids || []).map(aid => ({
        id: aid.id,
        name: aid.name || 'Unknown',
        email: aid.email,
        expertise: aid.expertise || [],
        rating: aid.researcher_profiles?.rating || 0,
        total_reviews: aid.researcher_profiles?.total_reviews || 0,
        hourly_rate: aid.researcher_profiles?.hourly_rate || 0,
        bio: aid.researcher_profiles?.bio || '',
        specialties: aid.researcher_profiles?.specialties || [],
        years_experience: aid.researcher_profiles?.years_experience || 0,
        response_time: aid.researcher_profiles?.response_time || 'Within 24 hours',
        is_online: aid.researcher_profiles?.is_online || false
      }));

      // Collect all services
      const allServices: ConsultationService[] = [];
      aids?.forEach(aid => {
        if (aid.consultation_services) {
          aid.consultation_services.forEach((service: any) => {
            allServices.push({
              id: service.id,
              title: service.title,
              description: service.description,
              duration_minutes: service.duration_minutes || 60,
              category: service.category,
              user_id: aid.id,
              pricing: service.pricing || []
            });
          });
        }
      });

      setResearchAids(processedAids);
      setServices(allServices);

    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to load research aids",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAid = (aid: ResearchAid) => {
    setSelectedAid(aid);
    setBookingForm(prev => ({ ...prev, research_aid_id: aid.id }));
    
    // Filter services for this aid
    const aidServices = services.filter(s => s.user_id === aid.id);
    if (aidServices.length > 0) {
      setSelectedService(aidServices[0]);
      setBookingForm(prev => ({ ...prev, service_id: aidServices[0].id }));
    }
  };

  const handleServiceSelect = (serviceId: string) => {
    const service = services.find(s => s.id === serviceId);
    if (service) {
      setSelectedService(service);
      setBookingForm(prev => ({ ...prev, service_id: serviceId }));
    }
  };

  const getServicePrice = (service: ConsultationService, academicLevel: string) => {
    const pricing = service.pricing.find(p => p.academic_level === academicLevel);
    return pricing ? `${pricing.currency} ${pricing.price}` : 'Price on request';
  };

  const handleBookingSubmit = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to book an appointment",
        variant: "destructive"
      });
      return;
    }

    // Check if user role prevents booking
    if (profile?.role === 'expert' || profile?.role === 'aid') {
      toast({
        title: "Booking Not Allowed",
        description: "Research experts and research aids cannot book consultations. This feature is only available for students.",
        variant: "destructive"
      });
      return;
    }

    if (!bookingForm.project_description.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide a project description",
        variant: "destructive"
      });
      return;
    }

    setSubmitting(true);
    try {
      // Mock payment processing
      const paymentResult = await mockPaymentProcess();
      
      if (!paymentResult.success) {
        throw new Error('Payment failed');
      }

      // Create appointment request
      const { data: request, error: requestError } = await supabase
        .from('appointment_requests')
        .insert({
          student_id: user.id,
          research_aid_id: bookingForm.research_aid_id,
          service_id: bookingForm.service_id,
          requested_date: bookingForm.requested_date,
          requested_time: bookingForm.requested_time,
          duration_minutes: selectedService?.duration_minutes || 60,
          meeting_type: bookingForm.meeting_type,
          project_description: bookingForm.project_description,
          specific_requirements: bookingForm.specific_requirements,
          payment_status: 'paid'
        })
        .select()
        .single();

      if (requestError) throw requestError;      // Create payment record - FREE APPOINTMENT
      await supabase.from('appointment_payments').insert({
        appointment_request_id: request.id,
        student_id: user.id,
        research_aid_id: bookingForm.research_aid_id,
        amount: 0, // FREE appointment
        currency: 'XAF',
        payment_method: 'Free',
        payment_status: 'completed',
        transaction_id: 'Free', // Set transaction ID as 'Free' as requested
        payment_date: new Date().toISOString()
      });

      // Send notification to research aid
      await supabase.from('notifications').insert({
        user_id: bookingForm.research_aid_id,
        title: 'New Appointment Request',
        message: `You have a new appointment request from ${user.user_metadata?.full_name || user.email || 'a student'} for ${selectedService?.title}`,
        type: 'appointment',
        category: 'booking',
        action_url: '/research-aids-dashboard'
      });

      toast({
        title: "Appointment Requested",
        description: "Your appointment request has been sent. You'll be notified when it's confirmed."
      });

      setShowBookingDialog(false);
      resetBookingForm();

    } catch (error) {
      console.error('Error booking appointment:', error);
      toast({
        title: "Booking Failed",
        description: "Failed to book appointment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const mockPaymentProcess = async (): Promise<{ success: boolean; transaction_id: string }> => {
    // Simulate payment processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock payment success (90% success rate)
    const success = Math.random() > 0.1;
    
    return {
      success,
      transaction_id: `mock_${Date.now()}_${Math.random().toString(36).substring(7)}`
    };
  };

  const resetBookingForm = () => {
    setBookingForm({
      research_aid_id: '',
      service_id: '',
      requested_date: '',
      requested_time: '',
      meeting_type: 'video',
      project_description: '',
      specific_requirements: '',
      academic_level: 'undergraduate'
    });
    setSelectedAid(null);
    setSelectedService(null);
  };

  const filteredAids = researchAids.filter(aid => {
    const matchesSearch = aid.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         aid.specialties.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (filterCategory === 'all') return matchesSearch;
    
    const aidServices = services.filter(s => s.user_id === aid.id);
    const matchesCategory = aidServices.some(s => s.category === filterCategory);
    
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading research aids...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Book an Appointment</h2>
      </div>

      {/* Search and Filter */}
      <div className="flex space-x-4">
        <div className="flex-1">
          <Input
            placeholder="Search by name or specialty..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="research">Research</SelectItem>
            <SelectItem value="writing">Writing</SelectItem>
            <SelectItem value="analysis">Analysis</SelectItem>
            <SelectItem value="methodology">Methodology</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Research Aids Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAids.map((aid) => (
          <Card key={aid.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start space-x-3">
                <Avatar className="h-12 w-12">
                  <AvatarFallback>{aid.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <CardTitle className="text-lg">{aid.name}</CardTitle>
                  <div className="flex items-center space-x-2 mt-1">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm ml-1">{aid.rating.toFixed(1)}</span>
                    </div>
                    <span className="text-sm text-gray-500">({aid.total_reviews} reviews)</span>
                    {aid.is_online && (
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        Online
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{aid.bio}</p>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm">
                  <Clock className="h-4 w-4 text-gray-400 mr-2" />
                  <span>{aid.response_time}</span>
                </div>
                <div className="flex items-center text-sm">
                  <span className="font-medium">${aid.hourly_rate}/hour</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-1 mb-4">
                {aid.specialties.slice(0, 3).map((specialty, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {specialty}
                  </Badge>
                ))}
                {aid.specialties.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{aid.specialties.length - 3} more
                  </Badge>
                )}
              </div>

              <Button 
                onClick={() => {
                  handleSelectAid(aid);
                  setShowBookingDialog(true);
                }}
                className="w-full"
              >
                Book Appointment
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Booking Dialog */}
      <Dialog open={showBookingDialog} onOpenChange={setShowBookingDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Book Appointment with {selectedAid?.name}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Service Selection */}
            <div>
              <Label htmlFor="service">Select Service</Label>
              <Select value={bookingForm.service_id} onValueChange={handleServiceSelect}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a service" />
                </SelectTrigger>
                <SelectContent>                  {services
                    .filter(s => s.user_id === selectedAid?.id)
                    .map(service => (
                      <SelectItem key={service.id} value={service.id}>
                        {service.title} ({formatDuration(service.duration_minutes)})
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            {selectedService && (
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium">{selectedService.title}</h4>
                <p className="text-sm text-gray-600 mt-1">{selectedService.description}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm">Duration: {selectedService.duration_minutes} minutes</span>
                  <span className="font-medium">
                    {getServicePrice(selectedService, bookingForm.academic_level)}
                  </span>
                </div>
              </div>
            )}

            {/* Academic Level */}
            <div>
              <Label htmlFor="academic_level">Academic Level</Label>
              <Select 
                value={bookingForm.academic_level} 
                onValueChange={(value) => setBookingForm(prev => ({ ...prev, academic_level: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="undergraduate">Undergraduate</SelectItem>
                  <SelectItem value="masters">Masters</SelectItem>
                  <SelectItem value="phd">PhD</SelectItem>
                  <SelectItem value="postdoc">Post-doc</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date">Preferred Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={bookingForm.requested_date}
                  onChange={(e) => setBookingForm(prev => ({ ...prev, requested_date: e.target.value }))}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div>
                <Label htmlFor="time">Preferred Time</Label>
                <Input
                  id="time"
                  type="time"
                  value={bookingForm.requested_time}
                  onChange={(e) => setBookingForm(prev => ({ ...prev, requested_time: e.target.value }))}
                />
              </div>
            </div>

            {/* Meeting Type */}
            <div>
              <Label htmlFor="meeting_type">Meeting Type</Label>
              <Select 
                value={bookingForm.meeting_type} 
                onValueChange={(value: 'video' | 'phone' | 'in-person') => 
                  setBookingForm(prev => ({ ...prev, meeting_type: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="video">
                    <div className="flex items-center">
                      <Video className="h-4 w-4 mr-2" />
                      Video Call
                    </div>
                  </SelectItem>
                  <SelectItem value="phone">
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-2" />
                      Phone Call
                    </div>
                  </SelectItem>
                  <SelectItem value="in-person">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2" />
                      In Person
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Project Description */}
            <div>
              <Label htmlFor="project_description">Project Description *</Label>
              <Textarea
                id="project_description"
                placeholder="Describe your project and what you need help with..."
                value={bookingForm.project_description}
                onChange={(e) => setBookingForm(prev => ({ ...prev, project_description: e.target.value }))}
                rows={4}
                required
              />
            </div>

            {/* Specific Requirements */}
            <div>
              <Label htmlFor="specific_requirements">Specific Requirements (Optional)</Label>
              <Textarea
                id="specific_requirements"
                placeholder="Any specific requirements or questions you have..."
                value={bookingForm.specific_requirements}
                onChange={(e) => setBookingForm(prev => ({ ...prev, specific_requirements: e.target.value }))}
                rows={3}
              />
            </div>            {/* Payment Summary */}
            {selectedService && (
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <h4 className="font-medium mb-2 text-green-800">Payment Summary</h4>
                <div className="flex justify-between items-center">
                  <span>Service Fee:</span>
                  <span className="font-bold text-green-600 text-lg">
                    FREE
                  </span>
                </div>
                <div className="text-sm text-green-700 mt-2">
                  <CreditCard className="h-4 w-4 inline mr-1" />
                  No payment required - this appointment is completely free!
                </div>
              </div>
            )}

            {/* Submit Button */}
            <Button 
              onClick={handleBookingSubmit}
              disabled={submitting || !bookingForm.project_description.trim()}
              className="w-full"
            >              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Booking Appointment...
                </>
              ) : (
                'Book for Free'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AppointmentBooking;