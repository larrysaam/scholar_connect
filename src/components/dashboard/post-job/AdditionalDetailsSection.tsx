
import { Input } from "@/components/ui/input";
import { Calendar, MapPin } from "lucide-react";

interface AdditionalDetailsSectionProps {
  deadline: string;
  location: string;
  onDeadlineChange: (value: string) => void;
  onLocationChange: (value: string) => void;
}

const AdditionalDetailsSection = ({
  deadline,
  location,
  onDeadlineChange,
  onLocationChange
}: AdditionalDetailsSectionProps) => {  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium mb-2">
          Deadline <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="date"
            value={deadline}
            onChange={(e) => onDeadlineChange(e.target.value)}
            className="pl-10"
            required
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
    </div>
  );
};

export default AdditionalDetailsSection;
