
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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

const BookingModal = ({ researcher }: BookingModalProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
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

  // Handle booking
  const handleBooking = () => {
    // In a real app, this would handle the booking process
    console.log("Booking with", researcher.name);
    console.log("Date:", selectedDate);
    console.log("Time:", selectedTime);
    setIsBookingModalOpen(false);
  };

  return (
    <Dialog open={isBookingModalOpen} onOpenChange={setIsBookingModalOpen}>
      <DialogTrigger asChild>
        <Button className="bg-white text-blue-700 hover:bg-blue-50">
          Book Consultation
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
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
          
          <div className="pt-4 border-t">
            <div className="flex justify-between items-center mb-4">
              <span>Consultation Fee:</span>
              <span className="font-semibold">${researcher.hourlyRate}</span>
            </div>
            
            <Button 
              className="w-full" 
              disabled={!selectedDate || !selectedTime}
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
