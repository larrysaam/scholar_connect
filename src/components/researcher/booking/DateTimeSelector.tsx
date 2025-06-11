
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";

interface DateTimeSelectorProps {
  selectedDate: Date | undefined;
  selectedTime: string | null;
  availableTimes: Array<{
    date: Date;
    slots: string[];
  }>;
  onDateSelect: (date: Date | undefined) => void;
  onTimeSelect: (time: string) => void;
}

const DateTimeSelector = ({ 
  selectedDate, 
  selectedTime, 
  availableTimes, 
  onDateSelect, 
  onTimeSelect 
}: DateTimeSelectorProps) => {
  // Function to check if a date has available slots
  const hasSlots = (date: Date) => {
    return availableTimes.some(
      item => item.date.toDateString() === date.toDateString()
    );
  };

  // Get available time slots for the selected date
  const getAvailableSlots = () => {
    if (!selectedDate) return [];
    
    const dateInfo = availableTimes.find(
      item => item.date.toDateString() === selectedDate.toDateString()
    );
    
    return dateInfo ? dateInfo.slots : [];
  };

  return (
    <>
      <div>
        <h3 className="mb-2 font-medium">Select a Date:</h3>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={onDateSelect}
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
                onClick={() => onTimeSelect(time)}
                className="text-sm"
              >
                {time}
              </Button>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default DateTimeSelector;
