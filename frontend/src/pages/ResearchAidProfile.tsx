import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Video, 
  Phone, 
  Star, 
  Loader2, 
  CreditCard, 
  Award,
  BookOpen,
  Users,
  MessageSquare,
  CheckCircle,
  ArrowLeft
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface ResearchAidProfile {
  id: string;
  name: string;
  email: string;
  bio: string;
  expertise: string[];
  specialties: string[];
  years_experience: number;
  hourly_rate: number;
  rating: number;
  total_reviews: number;
  response_time: string;
  is_online: boolean;
  academic_rank: string;
  highest_education: string;
  languages: string[];
  certifications: string[];
  profile_image_url?: string;
  location?: string; // Added location field
}

interface ConsultationService {
  id: string;
  title: string;
  description: string;
  duration_minutes: number;
  category: string;
  pricing: {
    academic_level: string;
    price: number;
    currency: string;
  }[];
}

interface BookingFormData {
  service_id: string;
  requested_date: string;
  requested_time: string;
  meeting_type: 'video' | 'phone' | 'in-person';
  project_description: string;
  specific_requirements: string;
  academic_level: string;
}

const ResearchAidProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<ResearchAidProfile | null>(null);
  const [services, setServices] = useState<ConsultationService[]>([]);
  const [selectedService, setSelectedService] = useState<ConsultationService | null>(null);
  const [bookingForm, setBookingForm] = useState<BookingFormData>({
    service_id: 'appointment', // Always use 'appointment' as the service
    requested_date: '',
    requested_time: '',
    meeting_type: 'video', // Always use 'video' as the meeting type
    project_description: '',
    specific_requirements: '',
    academic_level: 'undergraduate'
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const { toast } = useToast();
  const { user, profile: userProfile } = useAuth();

  useEffect(() => {
    if (id) {
      fetchResearchAidProfile();
    }
  }, [id]);

  useEffect(() => {
    // If no services are available, close the booking dialog and show a toast
    if (showBookingDialog && services.length === 0) {
      setShowBookingDialog(false);
      toast({
        title: "No Services Available",
        description: "This research aid has not published any consultation services yet. Please check back later or contact support.",
        variant: "destructive"
      });
    }
  }, [showBookingDialog, services, toast]);

  const fetchResearchAidProfile = async () => {
    if (!id) return;

    setLoading(true);
    try {
      // Fetch user and profile data
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id, name, email, avatar_url, expertise, role')
        .eq('id', id)
        .eq('role', 'aid')
        .single();
      if (userError) throw userError;

      // Fetch research aid profile (by id)
      const { data: profileData, error: profileError } = await supabase
        .from('research_aid_profiles')
        .select('*')
        .eq('id', id)
        .single();
      if (profileError) throw profileError;

      // Fetch consultation services
      const { data: servicesData, error: servicesError } = await supabase
        .from('consultation_services')
        .select('*, pricing:service_pricing(*)')
        .eq('user_id', id);
      if (servicesError) throw servicesError;

      // Compose profile
      const processedProfile: ResearchAidProfile = {
        id: userData.id,
        name: userData.name || 'Unknown',
        email: userData.email,
        bio: profileData?.bio || '',
        expertise: userData.expertise || [],
        specialties: profileData?.specialties || [],
        years_experience: profileData?.years_experience || 0,
        hourly_rate: profileData?.hourly_rate || 0,
        rating: profileData?.rating || 0,
        total_reviews: profileData?.total_reviews || 0,
        response_time: profileData?.response_time || 'Within 24 hours',
        is_online: profileData?.is_online || false,
        academic_rank: profileData?.academic_rank || '',
        highest_education: profileData?.highest_education || '',
        languages: profileData?.languages || [],
        certifications: profileData?.certifications || [],
        profile_image_url: userData.avatar_url || '/placeholder-avatar.jpg',
        location: profileData?.location || '', // Map location
      };

      // Compose services
      const processedServices: ConsultationService[] = (servicesData || []).map((service: any) => ({
        id: service.id,
        title: service.title,
        description: service.description,
        duration_minutes: service.duration_minutes || 60,
        category: service.category,
        pricing: service.pricing || []
      }));

      setProfile(processedProfile);
      setServices(processedServices);

      // Set default service if available
      if (processedServices.length > 0) {
        setSelectedService(processedServices[0]);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to load research aid profile',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Always select the 'Appointment' service if present
    if (services.length > 0) {
      const appointmentService = services.find(s => s.title.toLowerCase() === 'appointment');
      if (appointmentService) {
        setSelectedService(appointmentService);
        setBookingForm(prev => ({ ...prev, service_id: appointmentService.id }));
      } else {
        setSelectedService(services[0]);
        setBookingForm(prev => ({ ...prev, service_id: services[0].id }));
      }
    }
  }, [services]);

  const handleServiceSelect = (serviceId: string) => {
    const service = services.find(s => s.id === serviceId);
    if (service) {
      setSelectedService(service);
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
      navigate('/login');
      return;
    }

    // Check if user role prevents booking
    if (userProfile?.role === 'expert' || userProfile?.role === 'aid') {
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

      // Defensive: ensure selectedService is set before booking
      if (!selectedService) {
        toast({
          title: "No Service Available",
          description: "No consultation service is available for this research aid. Please contact support.",
          variant: "destructive"
        });
        setSubmitting(false);
        return;
      }      // Create appointment request (use valid table/fields) - FREE APPOINTMENT
      const { data: request, error: requestError } = await supabase
        .from('service_bookings')
        .insert({
          academic_level: bookingForm.academic_level,
          base_price: 0, // FREE appointment
          client_id: user.id,
          currency: 'XAF',
          duration_minutes: selectedService.duration_minutes || 60,
          provider_id: id,
          scheduled_date: bookingForm.requested_date,
          scheduled_time: bookingForm.requested_time,
          service_id: selectedService.id, // Always a valid UUID now
          status: 'pending',
          total_price: 0, // FREE appointment
          payment_status: 'paid', // Set as paid since it's free
          payment_id: 'Free', // Set payment ID as 'Free' as requested
          meeting_type: 'video',
          project_description: bookingForm.project_description,
          client_notes: bookingForm.specific_requirements || null
        })
        .select()
        .single();

      if (requestError) throw requestError;

      // Create payment record (use valid table/fields) - FREE APPOINTMENT
      await supabase.from('transactions').insert({
        user_id: user.id,
        amount: 0, // FREE appointment
        currency: 'XAF',
        status: 'completed',
        type: 'consultation',
        description: `Free appointment booking with ${profile.name}`,
        payment_id: 'Free' // Set payment ID as 'Free' as requested
      });

      // Send notification to research aid (use valid fields)
      await supabase.from('notifications').insert({
        user_id: id,
        title: 'New Appointment Request',
        message: `You have a new appointment request from ${user.email || 'a student'} for appointment`,
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
    // Always succeed for testing
    return {
      success: true,
      transaction_id: `mock_${Date.now()}_${Math.random().toString(36).substring(7)}`
    };
  };

  const resetBookingForm = () => {
    setBookingForm({
      service_id: 'appointment', // Always use 'appointment' as the service
      requested_date: '',
      requested_time: '',
      meeting_type: 'video', // Always use 'video' as the meeting type
      project_description: '',
      specific_requirements: '',
      academic_level: 'undergraduate'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex justify-center items-center">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span>Loading profile...</span>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex justify-center items-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Research Aid Not Found</h2>
            <p className="text-gray-600 mb-4">The research aid you're looking for doesn't exist.</p>
            <Button onClick={() => navigate('/dashboard')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-gray-50 py-12">
        <div className="container mx-auto px-4 md:px-6">
          {/* Back Button */}
          <Button 
            variant="ghost" 
            onClick={() => navigate('/dashboard')}
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Information */}
            <div className="lg:col-span-2 space-y-6">
              {/* Header Card */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={profile.profile_image_url} alt={profile.name} />
                      <AvatarFallback className="text-lg">
                        {profile.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h1 className="text-2xl font-bold">{profile.name}</h1>
                        {profile.is_online && (
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            Online
                          </Badge>
                        )}
                        {profile.location && (
                          <span className="ml-2 flex items-center text-gray-500 text-sm">
                            <MapPin className="h-4 w-4 mr-1" />
                            {profile.location}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-4 mb-3">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="ml-1 font-medium">{profile.rating.toFixed(1)}</span>
                          <span className="text-gray-500 ml-1">({profile.total_reviews} reviews)</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>{profile.response_time}</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Award className="h-4 w-4 mr-1" />
                          <span>{profile.academic_rank || 'Research Aid'}</span>
                        </div>
                        <div className="flex items-center">
                          <BookOpen className="h-4 w-4 mr-1" />
                          <span>{profile.years_experience} years experience</span>
                        </div>
                        {/* <div className="flex items-center">
                          <span className="font-medium">{profile.hourly_rate} XAF/hour</span>
                        </div> */}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* About Section */}
              <Card>
                <CardHeader>
                  <CardTitle>About</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed mb-4">{profile.bio}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-2">Education</h4>
                      <p className="text-gray-600">{profile.highest_education}</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Languages</h4>
                      <div className="flex flex-wrap gap-1">
                        {profile.languages.map((lang, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {lang}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Expertise & Specialties */}
              <Card>
                <CardHeader>
                  <CardTitle>Expertise & Specialties</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Areas of Expertise</h4>
                      <div className="flex flex-wrap gap-2">
                        {profile.expertise.map((area, index) => (
                          <Badge key={index} className="bg-blue-100 text-blue-800">
                            {area}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Specialties</h4>
                      <div className="flex flex-wrap gap-2">
                        {profile.specialties.map((specialty, index) => (
                          <Badge key={index} variant="outline">
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {profile.certifications.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-2">Certifications</h4>
                        <div className="flex flex-wrap gap-2">
                          {profile.certifications.map((cert, index) => (
                            <Badge key={index} className="bg-green-100 text-green-800">
                              {cert}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Services */}
              <Card>
                <CardHeader>
                  <CardTitle>Services Offered</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {services.map((service) => (
                      <div key={service.id} className="p-4 border rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium">{service.title}</h4>
                          <Badge variant="outline">{service.category}</Badge>
                        </div>
                        <p className="text-gray-600 text-sm mb-3">{service.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">
                            Duration: {service.duration_minutes} minutes
                          </span>
                          <div className="text-sm">
                            <span className="text-gray-500">From </span>
                            <span className="font-medium">
                              {getServicePrice(service, 'undergraduate')}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Service Management (Visible only to profile owner) */}
              {user && user.id === profile.id && (
                <Card>
                  <CardHeader>
                    <CardTitle>Manage Your Services</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 mb-4">Add, edit, or remove the consultation services you offer, including their pricing.</p>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="w-full">
                          <CreditCard className="h-4 w-4 mr-2" />
                          Edit Services & Pricing
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Manage Your Consultation Services</DialogTitle>
                        </DialogHeader>
                        {/* Service Management Form will go here */}
                        <p>This is where the service management form will be implemented.</p>
                      </DialogContent>
                    </Dialog>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Booking Sidebar */}
            <div className="space-y-6">
              <Card className="sticky top-6">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2" />
                    Book Appointment
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {profile.hourly_rate} XAF
                      </div>
                      <div className="text-sm text-gray-600">per hour</div>
                    </div> */}

                     <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        FREE
                      </div>
                  
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        <span>Instant booking available</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        <span>Responds within {profile.response_time.toLowerCase()}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        <span>Secure payment processing</span>
                      </div>
                    </div>

                    <Separator />

                    <Dialog open={showBookingDialog} onOpenChange={setShowBookingDialog}>
                      <DialogTrigger asChild>
                        <Button className="w-full" size="lg">
                          <Calendar className="h-4 w-4 mr-2" />
                          Book Appointment
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Book Appointment with {profile.name}</DialogTitle>
                        </DialogHeader>
                        
                        <div className="space-y-6">
                          {/* Service Selection */}
                          <div>
                            <Label htmlFor="service">Select Service</Label>
                            <Select value={bookingForm.service_id} onValueChange={() => {}} disabled>
                              <SelectTrigger>
                                <SelectValue placeholder="Appointment" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="appointment">Appointment</SelectItem>
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
                            <Select value={bookingForm.meeting_type} onValueChange={() => {}} disabled>
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
                          </div>                          {/* Payment Summary */}
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
                            disabled={submitting || !bookingForm.project_description.trim() || !selectedService || selectedService.title.toLowerCase() !== 'appointment'}
                            className="w-full"
                          >                            {submitting ? (
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

                    <Button variant="outline" className="w-full">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Send Message
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ResearchAidProfile;