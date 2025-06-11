
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Calendar as CalendarIcon, DollarSign } from "lucide-react";

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

const challenges = [
  "Generate a research idea",
  "Proposal writing", 
  "Literature review",
  "Conceptual and theoretical frameworks",
  "Methodology",
  "Report writing",
  "Live document review",
  "General research guidance",
  "Expert knowledge",
  "Interview a researcher",
  "Media visibility"
];

const BookingModal = ({ researcher }: BookingModalProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedAcademicLevel, setSelectedAcademicLevel] = useState<string | null>(null);
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [selectedChallenges, setSelectedChallenges] = useState<string[]>([]);
  const [comment, setComment] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);

  // Mock consultation services - in real app, this would come from the researcher's profile
  const consultationServices: ConsultationService[] = [
    {
      id: "1",
      category: "General Consultation",
      academicLevelPrices: [
        { level: "Undergraduate", price: 8000 },
        { level: "Master's", price: 8000 },
        { level: "PhD", price: 8000 }
      ],
      description: "General research guidance and consultation",
      addOns: []
    },
    {
      id: "2", 
      category: "Chapter Review",
      academicLevelPrices: [
        { level: "Undergraduate", price: 15000 },
        { level: "Master's", price: 20000 },
        { level: "PhD", price: 25000 }
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
      category: "Full Thesis Review", 
      academicLevelPrices: [
        { level: "Undergraduate", price: 75000 },
        { level: "Master's", price: 120000 },
        { level: "PhD", price: 200000 }
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
      category: "Full Thesis Cycle Support",
      academicLevelPrices: [
        { level: "Undergraduate", price: 100000 },
        { level: "Master's", price: 180000 },
        { level: "PhD", price: 300000 }
      ],
      description: "Complete thesis guidance from topic development to defense",
      addOns: [
        { name: "Formatting & Language Polishing", price: 20000 },
        { name: "Citation & Reference Check", price: 15000 },
        { name: "Express Review", price: 30000 }
      ]
    }
  ];

  // Function to check if a date has available slots
  const hasSlots = (date: Date) => {
    return researcher.availableTimes.some(
      item => item.date.toDateString() === date.toDateString()
    );
  };

  // Get available time slots for the selected date
  const getAvailableSlots = () => {
    if (!selectedDate) return [];
    
    const dateInfo = researcher.availableTimes.find(
      item => item.date.toDateString() === selectedDate.toDateString()
    );
    
    return dateInfo ? dateInfo.slots : [];
  };

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

  // Handle booking
  const handleBooking = () => {
    console.log("Booking with", researcher.name);
    console.log("Service:", selectedService);
    console.log("Academic Level:", selectedAcademicLevel);
    console.log("Date:", selectedDate);
    console.log("Time:", selectedTime);
    console.log("Add-ons:", selectedAddOns);
    console.log("Challenges:", selectedChallenges);
    console.log("Comment:", comment);
    console.log("Total Price:", calculateTotalPrice());
    setIsOpen(false);
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
          {/* Consultation Services */}
          <div>
            <h3 className="mb-3 font-medium">Select Consultation Service:</h3>
            <div className="space-y-3">
              <Select value={selectedService || ""} onValueChange={setSelectedService}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a consultation service" />
                </SelectTrigger>
                <SelectContent>
                  {consultationServices.map((service) => (
                    <SelectItem key={service.id} value={service.id}>
                      {service.category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {selectedService && (
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">
                    {getSelectedServiceDetails()?.description}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Academic Level Selection */}
          {selectedService && (
            <div>
              <h3 className="mb-3 font-medium">Select Academic Level:</h3>
              <Select value={selectedAcademicLevel || ""} onValueChange={setSelectedAcademicLevel}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose your academic level" />
                </SelectTrigger>
                <SelectContent>
                  {getSelectedServiceDetails()?.academicLevelPrices.map((levelPrice) => (
                    <SelectItem key={levelPrice.level} value={levelPrice.level}>
                      {levelPrice.level} - {levelPrice.price.toLocaleString()} XAF
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Add-ons Selection */}
          {selectedService && getSelectedServiceDetails()?.addOns.length > 0 && (
            <div>
              <h3 className="mb-3 font-medium">Optional Add-ons:</h3>
              <div className="space-y-3">
                {getSelectedServiceDetails()?.addOns.map((addon) => (
                  <div key={addon.name} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id={addon.name}
                        checked={selectedAddOns.includes(addon.name)}
                        onCheckedChange={() => handleAddOnToggle(addon.name)}
                      />
                      <Label htmlFor={addon.name} className="cursor-pointer">
                        {addon.name}
                      </Label>
                    </div>
                    <div className="flex items-center space-x-1">
                      <DollarSign className="h-3 w-3" />
                      <span className="text-sm font-medium">{addon.price.toLocaleString()} XAF</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <h3 className="mb-2 font-medium">Select a Date:</h3>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
              disabled={date => 
                !hasSlots(date) || 
                date < new Date() || 
                date > new Date(2025, 6, 31)
              }
            />
          </div>
          
          {selectedDate && (
            <div>
              <h3 className="mb-2 font-medium">Select a Time:</h3>
              <div className="grid grid-cols-3 gap-2">
                {getAvailableSlots().map((time) => (
                  <Button
                    key={time}
                    variant={selectedTime === time ? "default" : "outline"}
                    onClick={() => setSelectedTime(time)}
                    className="text-sm"
                  >
                    {time}
                  </Button>
                ))}
              </div>
            </div>
          )}

          <div>
            <h3 className="mb-3 font-medium">What's your challenge? (Select all that apply)</h3>
            <div className="grid grid-cols-1 gap-3">
              {challenges.map((challenge) => (
                <div key={challenge} className="flex items-center space-x-3">
                  <Checkbox
                    id={challenge}
                    checked={selectedChallenges.includes(challenge)}
                    onCheckedChange={() => handleChallengeToggle(challenge)}
                    className="h-5 w-5"
                  />
                  <Label htmlFor={challenge} className="cursor-pointer text-sm">
                    {challenge}
                  </Label>
                </div>
              ))}
            </div>
          </div>

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
          
          <div className="pt-4 border-t">
            <div className="space-y-2 mb-4">
              {selectedService && selectedAcademicLevel && (
                <div className="flex justify-between items-center">
                  <span>Service Fee:</span>
                  <span className="font-medium">{getServicePrice().toLocaleString()} XAF</span>
                </div>
              )}
              
              {selectedAddOns.length > 0 && (
                <div className="flex justify-between items-center">
                  <span>Add-ons:</span>
                  <span className="font-medium">
                    {(calculateTotalPrice() - getServicePrice()).toLocaleString()} XAF
                  </span>
                </div>
              )}
              
              <div className="flex justify-between items-center text-lg font-bold border-t pt-2">
                <span>Total Fee:</span>
                <span>{calculateTotalPrice().toLocaleString()} XAF</span>
              </div>
            </div>
            
            <Button 
              className="w-full" 
              disabled={!selectedDate || !selectedTime || !selectedService || !selectedAcademicLevel || selectedChallenges.length === 0}
              onClick={handleBooking}
            >
              Complete Booking
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookingModal;
