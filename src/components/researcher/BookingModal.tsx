
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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

const challenges = [
  "Generate a research idea",
  "Proposal writing",
  "Literature review",
  "Conceptual and theoretical frameworks",
  "Methodology",
  "Report writing",
  "Live document review",
  "General research guidance",
  "Co-author an article",
  "Expert knowledge",
  "Interview a researcher",
  "Media visibility"
];

const BookingModal = ({ researcher }: BookingModalProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedChallenges, setSelectedChallenges] = useState<string[]>([]);
  const [comment, setComment] = useState<string>("");
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

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
    console.log("Date:", selectedDate);
    console.log("Time:", selectedTime);
    console.log("Challenges:", selectedChallenges);
    console.log("Comment:", comment);
    setIsBookingModalOpen(false);
  };

  return (
    <Dialog open={isBookingModalOpen} onOpenChange={setIsBookingModalOpen}>
      <DialogTrigger asChild>
        <Button className="bg-white text-blue-700 hover:bg-blue-50">
          Book Consultation
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Book a Consultation</DialogTitle>
          <DialogDescription>
            Select a date and time to schedule your consultation with {researcher.name}.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
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
              <span>Consultation Fee:</span>
              <span className="font-semibold">{researcher.hourlyRate * 600} XAF</span>
            </div>
            
            <Button 
              className="w-full" 
              disabled={!selectedDate || !selectedTime || selectedChallenges.length === 0}
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
