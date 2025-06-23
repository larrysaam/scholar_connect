
import { Input } from "@/components/ui/input";
import { Calendar, MapPin, Clock } from "lucide-react";

interface AdditionalDetailsSectionProps {
  deadline: string;
  location: string;
  duration: string;
  onDeadlineChange: (value: string) => void;
  onLocationChange: (value: string) => void;
  onDurationChange: (value: string) => void;
}

const AdditionalDetailsSection = ({
  deadline,
  location,
  duration,
  onDeadlineChange,
  onLocationChange,
  onDurationChange
}: AdditionalDetailsSectionProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <label className="block text-sm font-medium mb-2">Deadline</label>
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="date"
            value={deadline}
            onChange={(e) => onDeadlineChange(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Location</label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="e.g., Remote, Yaoundé"
            value={location}
            onChange={(e) => onLocationChange(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Duration</label>
        <div className="relative">
          <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="e.g., 2 weeks"
            value={duration}
            onChange={(e) => onDurationChange(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
    </div>
  );
};

export default AdditionalDetailsSection;
