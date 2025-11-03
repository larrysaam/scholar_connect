
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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

interface AcademicLevelSelectorProps {
  selectedService: ConsultationService | undefined;
  selectedAcademicLevel: string | null;
  onAcademicLevelChange: (level: string) => void;
}

const AcademicLevelSelector = ({ 
  selectedService, 
  selectedAcademicLevel, 
  onAcademicLevelChange 
}: AcademicLevelSelectorProps) => {
  if (!selectedService) return null;

  return (
    <div>
      <h3 className="mb-3 font-medium">Select Academic Level:</h3>
      <Select value={selectedAcademicLevel || ""} onValueChange={onAcademicLevelChange}>
        <SelectTrigger>
          <SelectValue placeholder="Choose your academic level" />
        </SelectTrigger>
        <SelectContent>
          {selectedService.academicLevelPrices.map((levelPrice) => (
            <SelectItem key={levelPrice.level} value={levelPrice.level}>
              {levelPrice.level} - {levelPrice.price.toLocaleString()} XAF
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default AcademicLevelSelector;
