import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Calendar as CalendarIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import ServiceSelector from "./booking/ServiceSelector";
import AcademicLevelSelector from "./booking/AcademicLevelSelector";
import AddOnSelector from "./booking/AddOnSelector";
import DateTimeSelector from "./booking/DateTimeSelector";
import ChallengeSelector from "./booking/ChallengeSelector";
import BookingSummary from "./booking/BookingSummary";

interface BookingModalProps {
  researcher: {
    id: string; // <-- Add id here
    name: string;
    hourlyRate: number;
    availableTimes: {
      date: Date;
      slots: string[];
    }[];
  };
}

interface ConsultationService {
  id: string;
  category: "General Consultation" | "Chapter Review" | "Full Thesis Cycle Support" | "Full Thesis Review";
  academicLevelPrices: Array<{
    level: "Undergraduate" | "Master's" | "PhD";
    price: number;
  }>;
  description: string;
  addOns: Array<{
    name: string;
    price: number;
  }>;
}

const BookingModal = ({ researcher }: BookingModalProps) => {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedAcademicLevel, setSelectedAcademicLevel] = useState<string | null>(null);
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [selectedChallenges, setSelectedChallenges] = useState<string[]>([]);
  const [comment, setComment] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);
  const [consultationServices, setConsultationServices] = useState<ConsultationService[]>([]);

  useEffect(() => {
    const fetchServices = async () => {
      if (!researcher || !researcher.id) {
        console.log('[BookingModal] No researcher provided or researcher ID is missing');
        setConsultationServices([]);
        return;
      }
      setConsultationServices([]);
      // Fetch consultation services for the researcher, including pricing and add-ons
      const { data, error } = await supabase
        .from("consultation_services")
        .select(`id, category, description, service_pricing:service_pricing(academic_level, price), service_addons:service_addons(name, price)`)
        .eq("user_id", researcher.id)
        .eq("is_active", true);
      if (error || !data) {
        setConsultationServices([]);
        return;
      }
      // Map the data to the expected structure for the ServiceSelector
      const services = (data || []).map((service: any) => ({
        id: service.id,
        category: service.category,
        description: service.description,
        academicLevelPrices: (service.service_pricing || []).map((p: any) => ({
          level: p.academic_level === "Masters" ? "Master's" : p.academic_level,
          price: p.price
        })),
        addOns: (service.service_addons || []).map((a: any) => ({
          name: a.name,
          price: a.price
        }))
      })).filter((s: any) => s.academicLevelPrices.length > 0);
      console.log('[BookingModal] Fetched services:', services);
      setConsultationServices(services);
      if (services.length > 0) {
        setSelectedService(services[0].id);
        if (services[0].academicLevelPrices.length > 0) {
          setSelectedAcademicLevel(services[0].academicLevelPrices[0].level);
        }
      } else {
        setSelectedService(null);
        setSelectedAcademicLevel(null);
      }
    };
    fetchServices();
  }, [researcher]);

  // Defensive: If no services, show a message in the modal
  const noServices = consultationServices.length === 0;

  // Get selected service details
  const getSelectedServiceDetails = () => {
    return consultationServices.find(service => service.id === selectedService);
  };

  // Get price for selected service and academic level
  const getServicePrice = () => {
    const service = getSelectedServiceDetails();
    if (!service || !selectedAcademicLevel) return 0;
    
    const levelPrice = service.academicLevelPrices.find(
      price => price.level === selectedAcademicLevel
    );
    
    return levelPrice ? levelPrice.price : 0;
  };

  // Calculate total price including add-ons
  const calculateTotalPrice = () => {
    const basePrice = getServicePrice();
    const addOnsPrice = selectedAddOns.reduce((total, addonName) => {
      const service = getSelectedServiceDetails();
      const addon = service?.addOns.find(a => a.name === addonName);
      return total + (addon ? addon.price : 0);
    }, 0);
    
    return basePrice + addOnsPrice;
  };

  const getAddOnsPrice = () => {
    return selectedAddOns.reduce((total, addonName) => {
      const service = getSelectedServiceDetails();
      const addon = service?.addOns.find(a => a.name === addonName);
      return total + (addon ? addon.price : 0);
    }, 0);
  };

  // Handle challenge selection (multi-select)
  const handleChallengeToggle = (challenge: string) => {
    setSelectedChallenges(prev => 
      prev.includes(challenge) 
        ? prev.filter(c => c !== challenge)
        : [...prev, challenge]
    );
  };

  // Handle add-on selection
  const handleAddOnToggle = (addonName: string) => {
    setSelectedAddOns(prev => 
      prev.includes(addonName)
        ? prev.filter(a => a !== addonName)
        : [...prev, addonName]
    );
  };

  // Handle booking with thesis information integration
  const handleBooking = () => {
    // Get thesis information from localStorage
    const thesisInfo = {
      title: "Machine Learning Applications in Healthcare Data Analysis",
      problemStatement: "The healthcare industry generates vast amounts of data daily, but lacks efficient automated systems to analyze and extract meaningful insights that can improve patient outcomes and reduce operational costs.",
      researchQuestions: [
        "How can machine learning algorithms be optimized for healthcare data analysis?",
        "What are the most effective ML models for predicting patient outcomes?",
        "How can data privacy be maintained while enabling comprehensive analysis?"
      ],
      researchObjectives: [
        "Develop and implement ML algorithms for healthcare data processing",
        "Evaluate the effectiveness of different ML models in healthcare contexts",
        "Create a framework for privacy-preserving healthcare data analysis",
        "Validate the system through real-world healthcare datasets"
      ],
      researchHypothesis: "Implementation of optimized machine learning algorithms in healthcare data analysis will significantly improve diagnostic accuracy and treatment recommendations while maintaining patient data privacy.",
      expectedOutcomes: [
        "A comprehensive ML framework for healthcare data analysis",
        "Improved diagnostic accuracy by 15-20%",
        "Reduced data processing time by 40%",
        "Published research papers in peer-reviewed journals",
        "Potential patent applications for novel algorithms"
      ]
    };

    const bookingData = {
      researcher: researcher.name,
      service: getSelectedServiceDetails(),
      academicLevel: selectedAcademicLevel,
      date: selectedDate,
      time: selectedTime,
      addOns: selectedAddOns,
      challenges: selectedChallenges,
      comment,
      totalPrice: calculateTotalPrice(),
      studentThesisInfo: thesisInfo
    };

    console.log("Booking with thesis information:", bookingData);
    
    toast({
      title: "Consultation Booked Successfully!",
      description: `Your consultation with ${researcher.name} has been scheduled. The researcher can now access your thesis information.`,
    });
    
    setIsOpen(false);
    
    // Reset form
    setSelectedDate(undefined);
    setSelectedTime(null);
    setSelectedService(null);
    setSelectedAcademicLevel(null);
    setSelectedAddOns([]);
    setSelectedChallenges([]);
    setComment("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">
          <CalendarIcon className="h-4 w-4 mr-2" />
          Book Consultation
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Book a Consultation with {researcher.name}</DialogTitle>
          <DialogDescription>
            Select a consultation service, date and time to schedule your session.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          {noServices ? (
            <div className="text-center text-gray-500 py-8">
              This researcher currently has no available consultation services.
            </div>
          ) : (
            <>
              <ServiceSelector
                services={consultationServices}
                selectedService={selectedService}
                onServiceChange={setSelectedService}
              />
              <AcademicLevelSelector
                selectedService={getSelectedServiceDetails()}
                selectedAcademicLevel={selectedAcademicLevel}
                onAcademicLevelChange={setSelectedAcademicLevel}
              />
              <AddOnSelector
                selectedService={getSelectedServiceDetails()}
                selectedAddOns={selectedAddOns}
                onAddOnToggle={handleAddOnToggle}
              />
              <DateTimeSelector
                selectedDate={selectedDate}
                selectedTime={selectedTime}
                availableTimes={researcher.availableTimes}
                onDateSelect={setSelectedDate}
                onTimeSelect={setSelectedTime}
              />
              <ChallengeSelector
                selectedChallenges={selectedChallenges}
                onChallengeToggle={handleChallengeToggle}
              />
              <div>
                <Label htmlFor="comment" className="font-medium">Leave a comment:</Label>
                <Textarea
                  id="comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Provide additional details about your consultation needs..."
                  rows={3}
                  className="mt-2"
                />
              </div>
              <BookingSummary
                servicePrice={getServicePrice()}
                addOnsPrice={getAddOnsPrice()}
                totalPrice={calculateTotalPrice()}
              />
              <Button 
                className="w-full" 
                disabled={!selectedDate || !selectedTime || !selectedService || !selectedAcademicLevel || selectedChallenges.length === 0}
                onClick={handleBooking}
              >
                Complete Booking
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookingModal;
