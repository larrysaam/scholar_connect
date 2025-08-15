import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  CreditCard, 
  Loader2, 
  CheckCircle,
  AlertCircle,
  User,
  BookOpen,
  DollarSign
} from "lucide-react";
import { format } from "date-fns";
import { useBookingSystem } from "@/hooks/useBookingSystem";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/integrations/supabase/client';

interface ComprehensiveBookingModalProps {
  researcher: {
    id: string;
    name: string;
    title: string;
    institution: string;
    hourlyRate: number;
    imageUrl: string;
  };
}

interface PaymentMethod {
  id: string;
  name: string;
  type: 'card' | 'mobile_money' | 'bank_transfer';
  description: string;
}

const ComprehensiveBookingModal = ({ researcher }: ComprehensiveBookingModalProps) => {
  const { toast } = useToast();
  const { 
    createBooking, 
    processPayment, 
    getAvailableSlots,
    creating, 
    processing 
  } = useBookingSystem();

  // Modal state
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  // Booking form state
  const [selectedService, setSelectedService] = useState<string>("");
  const [selectedAcademicLevel, setSelectedAcademicLevel] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [clientNotes, setClientNotes] = useState("");
  const [challenges, setChallenges] = useState<string[]>([]);

  // Payment state
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [paymentDetails, setPaymentDetails] = useState<any>({});

  // Available slots
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  // Add state for services and loading
  const [services, setServices] = useState<any[]>([]);
  const [servicesLoading, setServicesLoading] = useState(true);

  // Fetch all active services for this researcher on open
  useEffect(() => {
    if (!isOpen) return;
    const fetchServices = async () => {
      setServicesLoading(true);
      const { data, error } = await supabase
        .from('consultation_services')
        .select(`*, pricing:service_pricing(*), addons:service_addons(*)`)
        .eq('user_id', researcher.id)
        .eq('is_active', true);
      if (error) {
        setServices([]);
      } else {
        setServices(data || []);
      }
      setServicesLoading(false);
    };
    fetchServices();
  }, [isOpen, researcher.id]);

  // researcherServices now just filters the fetched services
  const researcherServices = services;

  const paymentMethods: PaymentMethod[] = [
    {
      id: 'card',
      name: 'Credit/Debit Card',
      type: 'card',
      description: 'Pay securely with your credit or debit card'
    },
    {
      id: 'mobile_money',
      name: 'Mobile Money',
      type: 'mobile_money',
      description: 'Pay with MTN Mobile Money or Orange Money'
    },
    {
      id: 'bank_transfer',
      name: 'Bank Transfer',
      type: 'bank_transfer',
      description: 'Direct bank transfer'
    }
  ];

  const researchChallenges = [
    "Literature Review",
    "Research Methodology",
    "Data Collection",
    "Data Analysis",
    "Statistical Analysis",
    "Writing & Structure",
    "Citation & Referencing",
    "Research Proposal",
    "Thesis Defense Preparation",
    "Publication Strategy"
  ];

  // Get selected service details
  const getSelectedService = () => {
    return researcherServices.find(service => service.id === selectedService);
  };

  // Get pricing for selected academic level
  const getServicePrice = () => {
    const service = getSelectedService();
    if (!service || !selectedAcademicLevel) return 0;
    
    const pricing = service.pricing.find(p => p.academic_level === selectedAcademicLevel);
    return pricing ? pricing.price : 0;
  };

  // Calculate addon prices
  const getAddonPrice = () => {
    const service = getSelectedService();
    if (!service) return 0;
    
    return selectedAddons.reduce((total, addonId) => {
      const addon = service.addons.find(a => a.id === addonId);
      return total + (addon ? addon.price : 0);
    }, 0);
  };

  // Calculate total price
  const getTotalPrice = () => {
    return getServicePrice() + getAddonPrice();
  };

  // Load available slots when date changes
  useEffect(() => {
    if (selectedDate && researcher.id) {
      setLoadingSlots(true);
      getAvailableSlots(researcher.id, format(selectedDate, 'yyyy-MM-dd'))
        .then(slots => {
          setAvailableSlots(slots);
          setLoadingSlots(false);
        })
        .catch(() => {
          setLoadingSlots(false);
          setAvailableSlots([]);
        });
    }
  }, [selectedDate, researcher.id]);

  // Handle challenge toggle
  const handleChallengeToggle = (challenge: string) => {
    setChallenges(prev => 
      prev.includes(challenge) 
        ? prev.filter(c => c !== challenge)
        : [...prev, challenge]
    );
  };

  // Handle addon toggle
  const handleAddonToggle = (addonId: string) => {
    setSelectedAddons(prev => 
      prev.includes(addonId)
        ? prev.filter(id => id !== addonId)
        : [...prev, addonId]
    );
  };

  // Validate current step
  const isStepValid = (step: number) => {
    switch (step) {
      case 1:
        return selectedService && selectedAcademicLevel;
      case 2:
        return selectedDate && selectedTime;
      case 3:
        return challenges.length > 0;
      case 4:
        return paymentMethod;
      default:
        return false;
    }
  };

  // Handle booking submission
  const handleBooking = async () => {
    if (!selectedDate || !selectedTime || !selectedService || !selectedAcademicLevel) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const service = getSelectedService();
    if (!service) return;

    // Create booking
    const bookingResult = await createBooking({
      provider_id: researcher.id,
      service_id: selectedService,
      academic_level: selectedAcademicLevel as any,
      scheduled_date: format(selectedDate, 'yyyy-MM-dd'),
      scheduled_time: selectedTime,
      duration_minutes: service.duration_minutes,
      base_price: getServicePrice(),
      addon_price: getAddonPrice(),
      total_price: getTotalPrice(),
      currency: 'XAF',
      client_notes: clientNotes,
      selected_addons: selectedAddons,
      challenges
    });

    if (!bookingResult.success || !bookingResult.booking) {
      return;
    }

    // Process payment
    const paymentResult = await processPayment({
      amount: getTotalPrice(),
      currency: 'XAF',
      booking_id: bookingResult.booking.id,
      payment_method: paymentMethod as any,
      payment_details: paymentDetails
    });

    if (paymentResult.success) {
      setCurrentStep(5); // Success step
      // Reset form after a delay
      setTimeout(() => {
        resetForm();
        setIsOpen(false);
      }, 3000);
    }
  };

  // Reset form
  const resetForm = () => {
    setCurrentStep(1);
    setSelectedService("");
    setSelectedAcademicLevel("");
    setSelectedDate(undefined);
    setSelectedTime("");
    setSelectedAddons([]);
    setClientNotes("");
    setChallenges([]);
    setPaymentMethod("");
    setPaymentDetails({});
  };

  // Render step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        if (servicesLoading) {
          return (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="ml-2">Loading services...</span>
            </div>
          );
        }
        if (researcherServices.length === 0) {
          return (
            <div className="text-center py-8">
              <AlertCircle className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
              <h4 className="font-semibold mb-2">No Consultation Services Available</h4>
              <p className="text-gray-600">This researcher has not published any consultation services yet. Please check back later.</p>
            </div>
          );
        }
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-base font-medium">Select Service</Label>
              <div className="mt-3 space-y-3">
                {researcherServices.map((service) => (
                  <Card 
                    key={service.id} 
                    className={`cursor-pointer transition-all ${
                      selectedService === service.id 
                        ? 'ring-2 ring-blue-500 bg-blue-50' 
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedService(service.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium">{service.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="outline">{service.category}</Badge>
                            <span className="text-sm text-gray-500">
                              {service.duration_minutes} minutes
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500">Starting from</p>
                          <p className="font-semibold text-green-600">
                            {service.pricing && service.pricing.length > 0 ? Math.min(...service.pricing.map(p => p.price)).toLocaleString() : 0} XAF
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
            {selectedService && (
              <div>
                <Label className="text-base font-medium">Academic Level</Label>
                <Select value={selectedAcademicLevel} onValueChange={setSelectedAcademicLevel}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select your academic level" />
                  </SelectTrigger>
                  <SelectContent>
                    {getSelectedService()?.pricing.map((pricing) => (
                      <SelectItem key={pricing.academic_level} value={pricing.academic_level}>
                        <div className="flex items-center justify-between w-full">
                          <span>{pricing.academic_level}</span>
                          <span className="ml-4 font-medium text-green-600">
                            {pricing.price.toLocaleString()} XAF
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            {selectedService && getSelectedService()?.addons.length > 0 && (
              <div>
                <Label className="text-base font-medium">Add-ons (Optional)</Label>
                <div className="mt-3 space-y-2">
                  {getSelectedService()?.addons.map((addon) => (
                    <div key={addon.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={addon.id}
                        checked={selectedAddons.includes(addon.id)}
                        onCheckedChange={() => handleAddonToggle(addon.id)}
                      />
                      <Label htmlFor={addon.id} className="flex-1 cursor-pointer">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="font-medium">{addon.name}</span>
                            {addon.description && (
                              <p className="text-sm text-gray-600">{addon.description}</p>
                            )}
                          </div>
                          <span className="font-medium text-green-600">
                            +{addon.price.toLocaleString()} XAF
                          </span>
                        </div>
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-base font-medium">Select Date</Label>
              <div className="mt-3">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => date < new Date() || date.getDay() === 0} // Disable past dates and Sundays
                  className="rounded-md border"
                />
              </div>
            </div>

            {selectedDate && (
              <div>
                <Label className="text-base font-medium">Available Time Slots</Label>
                {loadingSlots ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin" />
                    <span className="ml-2">Loading available slots...</span>
                  </div>
                ) : (
                  <div className="mt-3 grid grid-cols-3 gap-2">
                    {availableSlots.map((slot) => (
                      <Button
                        key={slot}
                        variant={selectedTime === slot ? "default" : "outline"}
                        onClick={() => setSelectedTime(slot)}
                        className="h-12"
                      >
                        <Clock className="h-4 w-4 mr-2" />
                        {slot}
                      </Button>
                    ))}
                  </div>
                )}
                {availableSlots.length === 0 && !loadingSlots && (
                  <p className="text-sm text-gray-500 mt-3">
                    No available slots for this date. Please select another date.
                  </p>
                )}
              </div>
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-base font-medium">Research Challenges</Label>
              <p className="text-sm text-gray-600 mt-1">
                Select the areas where you need help (select at least one)
              </p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {researchChallenges.map((challenge) => (
                  <div key={challenge} className="flex items-center space-x-2">
                    <Checkbox
                      id={challenge}
                      checked={challenges.includes(challenge)}
                      onCheckedChange={() => handleChallengeToggle(challenge)}
                    />
                    <Label htmlFor={challenge} className="text-sm cursor-pointer">
                      {challenge}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="notes" className="text-base font-medium">
                Additional Notes (Optional)
              </Label>
              <Textarea
                id="notes"
                value={clientNotes}
                onChange={(e) => setClientNotes(e.target.value)}
                placeholder="Provide any additional details about your consultation needs..."
                rows={4}
                className="mt-2"
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-base font-medium">Payment Method</Label>
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="mt-3">
                {paymentMethods.map((method) => (
                  <div key={method.id} className="flex items-center space-x-2">
                    <RadioGroupItem value={method.id} id={method.id} />
                    <Label htmlFor={method.id} className="flex-1 cursor-pointer">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-medium">{method.name}</span>
                          <p className="text-sm text-gray-600">{method.description}</p>
                        </div>
                        <CreditCard className="h-5 w-5 text-gray-400" />
                      </div>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {paymentMethod === 'card' && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input
                    id="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    value={paymentDetails.cardNumber || ''}
                    onChange={(e) => setPaymentDetails(prev => ({ ...prev, cardNumber: e.target.value }))}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expiry">Expiry Date</Label>
                    <Input
                      id="expiry"
                      placeholder="MM/YY"
                      value={paymentDetails.expiry || ''}
                      onChange={(e) => setPaymentDetails(prev => ({ ...prev, expiry: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="cvv">CVV</Label>
                    <Input
                      id="cvv"
                      placeholder="123"
                      value={paymentDetails.cvv || ''}
                      onChange={(e) => setPaymentDetails(prev => ({ ...prev, cvv: e.target.value }))}
                    />
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'mobile_money' && (
              <div>
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  placeholder="+237 6XX XXX XXX"
                  value={paymentDetails.phoneNumber || ''}
                  onChange={(e) => setPaymentDetails(prev => ({ ...prev, phoneNumber: e.target.value }))}
                />
              </div>
            )}

            <Card className="bg-gray-50">
              <CardContent className="p-4">
                <h4 className="font-medium mb-3">Booking Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Service:</span>
                    <span>{getSelectedService()?.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Academic Level:</span>
                    <span>{selectedAcademicLevel}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Date & Time:</span>
                    <span>
                      {selectedDate && format(selectedDate, 'PPP')} at {selectedTime}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Base Price:</span>
                    <span>{getServicePrice().toLocaleString()} XAF</span>
                  </div>
                  {getAddonPrice() > 0 && (
                    <div className="flex justify-between">
                      <span>Add-ons:</span>
                      <span>{getAddonPrice().toLocaleString()} XAF</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between font-medium text-base">
                    <span>Total:</span>
                    <span className="text-green-600">{getTotalPrice().toLocaleString()} XAF</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 5:
        return (
          <div className="text-center py-8">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Booking Confirmed!</h3>
            <p className="text-gray-600 mb-4">
              Your consultation with {researcher.name} has been successfully booked and paid for.
            </p>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-green-800">
                <strong>Next Steps:</strong>
              </p>
              <ul className="text-sm text-green-700 mt-2 space-y-1">
                <li>• You'll receive a confirmation email shortly</li>
                <li>• The researcher will contact you before the session</li>
                <li>• Meeting link will be provided 24 hours before</li>
                <li>• You can view this booking in your dashboard</li>
              </ul>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const stepTitles = [
    'Select Service',
    'Choose Date & Time',
    'Enter Details',
    'Review & Pay'
  ];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">
          <CalendarIcon className="h-4 w-4 mr-2" />
          Book Consultation
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Book Consultation with {researcher.name}</DialogTitle>
          <DialogDescription>
            {researcher.title} at {researcher.institution}
          </DialogDescription>
        </DialogHeader>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-6">
          {stepTitles.map((title, index) => (
            <div key={index} className="flex items-center">
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                ${currentStep > index + 1 
                  ? 'bg-green-500 text-white' 
                  : currentStep === index + 1 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }
              `}>
                {currentStep > index + 1 ? '✓' : index + 1}
              </div>
              {index < stepTitles.length - 1 && (
                <div className={`
                  w-12 h-0.5 mx-2
                  ${currentStep > index + 1 ? 'bg-green-500' : 'bg-gray-200'}
                `} />
              )}
            </div>
          ))}
        </div>

        <div className="mb-4">
          <h3 className="text-lg font-medium">{stepTitles[currentStep - 1]}</h3>
        </div>

        {/* Step Content */}
        <div className="min-h-[400px]">
          {renderStepContent()}
        </div>

        {/* Navigation Buttons */}
        {currentStep < 5 && (
          <div className="flex justify-between pt-6 border-t">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
              disabled={currentStep === 1}
            >
              Previous
            </Button>
            
            {currentStep < 4 ? (
              <Button
                onClick={() => setCurrentStep(prev => prev + 1)}
                disabled={!isStepValid(currentStep) || researcherServices.length === 0}
              >
                Next
              </Button>
            ) : (
              <Button
                onClick={handleBooking}
                disabled={!isStepValid(currentStep) || creating || processing}
              >
                {creating || processing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {creating ? 'Creating Booking...' : 'Processing Payment...'}
                  </>
                ) : (
                  <>
                    <CreditCard className="h-4 w-4 mr-2" />
                    Complete Booking & Pay
                  </>
                )}
              </Button>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ComprehensiveBookingModal;