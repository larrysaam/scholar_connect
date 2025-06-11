
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

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

interface ServiceSelectorProps {
  services: ConsultationService[];
  selectedService: string | null;
  onServiceChange: (serviceId: string) => void;
}

const ServiceSelector = ({ services, selectedService, onServiceChange }: ServiceSelectorProps) => {
  const selectedServiceDetails = services.find(service => service.id === selectedService);

  return (
    <div>
      <h3 className="mb-3 font-medium">Select Consultation Service:</h3>
      <div className="space-y-3">
        <Select value={selectedService || ""} onValueChange={onServiceChange}>
          <SelectTrigger>
            <SelectValue placeholder="Choose a consultation service" />
          </SelectTrigger>
          <SelectContent>
            {services.map((service) => (
              <SelectItem key={service.id} value={service.id}>
                {service.category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        {selectedService && selectedServiceDetails && (
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              {selectedServiceDetails.description}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceSelector;
