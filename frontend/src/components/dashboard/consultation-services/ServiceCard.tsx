
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DollarSign, X } from "lucide-react";
import PriceGridModal from "./PriceGridModal";

interface AcademicLevelPrice {
  level: "Undergraduate" | "Master's" | "PhD";
  price: number;
}

interface AddOn {
  name: string;
  price: number;
}

interface ServiceType {
  id: string;
  category: "General Consultation" | "Chapter Review" | "Full Thesis Cycle Support" | "Full Thesis Review" | "Free Consultation";
  academicLevelPrices: AcademicLevelPrice[];
  description: string;
  addOns: AddOn[];
}

interface ServiceCardProps {
  service: ServiceType;
  onRemove: (id: string) => void;
}

const ServiceCard = ({ service, onRemove }: ServiceCardProps) => {
  return (
    <div className="border rounded-lg p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <h4 className="font-medium">{service.category}</h4>
          <PriceGridModal category={service.category} />
        </div>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => onRemove(service.id)}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      <p className="text-sm text-gray-600">{service.description}</p>
      
      {/* Academic Level Prices */}
      <div className="space-y-2">
        <h5 className="font-medium text-sm">Academic Level Pricing:</h5>
        <div className="flex flex-wrap gap-2">
          {service.academicLevelPrices.map((levelPrice, index) => (
            <div key={index} className="flex items-center space-x-2 bg-gray-50 rounded-lg p-2">
              <Badge variant="secondary">{levelPrice.level}</Badge>
              <div className="flex items-center space-x-1">
                <DollarSign className="h-3 w-3" />
                <span className="text-sm">{levelPrice.price.toLocaleString()} XAF</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add-ons */}
      {service.addOns.length > 0 && (
        <div className="space-y-2">
          <h5 className="font-medium text-sm">Add-ons:</h5>
          <div className="flex flex-wrap gap-2">
            {service.addOns.map((addon, index) => (
              <div key={index} className="flex items-center space-x-2 bg-green-50 rounded-lg p-2">
                <span className="text-sm">{addon.name}</span>
                <div className="flex items-center space-x-1">
                  <DollarSign className="h-3 w-3" />
                  <span className="text-sm font-medium">{addon.price.toLocaleString()} XAF</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceCard;
