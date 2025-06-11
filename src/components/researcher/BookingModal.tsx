
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Calendar as CalendarIcon } from "lucide-react";

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

const consultationServices = [
  {
    name: "General Consultation",
    description: "Get expert guidance on your research questions",
    duration: "1 hour",
    price: "hourlyRate"
  },
  {
    name: "Proposal Writing Support",
    description: "Help with structuring and writing research proposals",
    duration: "1 hour",
    price: "hourlyRate"
  },
  {
    name: "Literature Review Assistance",
    description: "Guidance on conducting comprehensive literature reviews",
    duration: "1 hour", 
    price: "hourlyRate"
  },
  {
    name: "Methodology Consultation",
    description: "Expert advice on research design and methodology",
    duration: "1 hour",
    price: "hourlyRate"
  }
];

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
  const [selectedService, setSelectedService] = useState<string | null>("General Consultation");
  const [selectedChallenges, setSelectedChallenges] = useState<string[]>([]);
  const [comment, setComment] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);

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

  // Handle challenge selection (multi-select)
  const handleChallengeToggle = (challenge: string) => {
    setSelectedChallenges(prev => 
      prev.includes(challenge) 
        ? prev.filter(c => c !== challenge)
        : [...prev, challenge]
    );
  };

  // Handle booking
  const handleBooking = () => {
    console.log("Booking with", researcher.name);
    console.log("Service:", selectedService);
    console.log("Date:", selectedDate);
    console.log("Time:", selectedTime);
    console.log("Challenges:", selectedChallenges);
    console.log("Comment:", comment);
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
            <div className="grid gap-3">
              {consultationServices.map((service) => (
                <div
                  key={service.name}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedService === service.name
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setSelectedService(service.name)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-medium">{service.name}</h4>
                      <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline">{service.duration}</Badge>
                        <Badge variant="secondary">{researcher.hourlyRate.toLocaleString()} XAF</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

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
            <div className="flex justify-between items-center mb-4">
              <span>Total Fee:</span>
              <span className="font-semibold">{researcher.hourlyRate.toLocaleString()} XAF/hour</span>
            </div>
            
            <Button 
              className="w-full" 
              disabled={!selectedDate || !selectedTime || !selectedService || selectedChallenges.length === 0}
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
