import { useState } from "react";
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
import ServiceSelector from "./booking/ServiceSelector";
import AcademicLevelSelector from "./booking/AcademicLevelSelector";
import AddOnSelector from "./booking/AddOnSelector";
import DateTimeSelector from "./booking/DateTimeSelector";
import ChallengeSelector from "./booking/ChallengeSelector";
import BookingSummary from "./booking/BookingSummary";

interface BookingModalProps {
  researcher: {
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

  // Mock consultation services - in real app, this would come from the researcher's profile
  const consultationServices = [
    {
      id: "1",
      category: "General Consultation" as const,
      academicLevelPrices: [
        { level: "Undergraduate" as const, price: 8000 },
        { level: "Master's" as const, price: 8000 },
        { level: "PhD" as const, price: 8000 }
      ],
      description: "General research guidance and consultation",
      addOns: []
    },
    {
      id: "2", 
      category: "Chapter Review" as const,
      academicLevelPrices: [
        { level: "Undergraduate" as const, price: 15000 },
        { level: "Master's" as const, price: 20000 },
        { level: "PhD" as const, price: 25000 }
      ],
      description: "Comprehensive review of individual thesis chapters",
      addOns: [
        { name: "Formatting & Language Polishing", price: 7500 },
        { name: "Citation & Reference Check", price: 3500 },
        { name: "Express Review (24–72 hours)", price: 5000 }
      ]
    },
    {
      id: "3",
      category: "Full Thesis Review" as const, 
      academicLevelPrices: [
        { level: "Undergraduate" as const, price: 75000 },
        { level: "Master's" as const, price: 120000 },
        { level: "PhD" as const, price: 200000 }
      ],
      description: "Complete thesis review with comprehensive feedback",
      addOns: [
        { name: "Formatting & Language Polishing", price: 15000 },
        { name: "Citation & Reference Check", price: 10000 },
        { name: "Express Review (72 hours)", price: 25000 }
      ]
    },
    {
      id: "4",
      category: "Full Thesis Cycle Support" as const,
      academicLevelPrices: [
        { level: "Undergraduate" as const, price: 100000 },
        { level: "Master's" as const, price: 180000 },
        { level: "PhD" as const, price: 300000 }
      ],
      description: "Complete thesis guidance from topic development to defense",
      addOns: [
        { name: "Formatting & Language Polishing", price: 20000 },
        { name: "Citation & Reference Check", price: 15000 },
        { name: "Express Review", price: 30000 }
      ]
    }
  ];

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
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookingModal;
