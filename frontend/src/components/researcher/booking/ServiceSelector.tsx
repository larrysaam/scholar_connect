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
  // Debug log to trace incoming services and selectedService
  if (!Array.isArray(services)) {
    console.error('[ServiceSelector] services prop is not an array:', services);
  } else {
    console.log('[ServiceSelector] services:', services);
  }
  console.log('[ServiceSelector] selectedService:', selectedService);
  const selectedServiceDetails = Array.isArray(services)
    ? services.find(service => service.id === selectedService)
    : undefined;

  return (
    <div>
      <h3 className="mb-3 font-medium">Select Consultation Service:</h3>
      <div className="space-y-3">
        {!Array.isArray(services) || services.length === 0 ? (
          <div className="text-red-500 text-sm mb-2">No consultation services are available for this researcher.</div>
        ) : null}
        <Select
          value={selectedService || ""}
          onValueChange={onServiceChange}
          disabled={!Array.isArray(services) || services.length === 0}
        >
          <SelectTrigger>
            <SelectValue placeholder={!Array.isArray(services) || services.length === 0 ? "No services available" : "Choose a consultation service"} />
          </SelectTrigger>
          <SelectContent>
            {!Array.isArray(services) || services.length === 0 ? (
              <SelectItem value="" disabled>
                No services available
              </SelectItem>
            ) : (
              services.map((service) => (
                <SelectItem key={service.id} value={service.id}>
                  {service.category}
                </SelectItem>
              ))
            )}
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
