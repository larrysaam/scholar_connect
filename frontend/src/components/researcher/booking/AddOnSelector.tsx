
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { DollarSign } from "lucide-react";

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

interface AddOnSelectorProps {
  selectedService: ConsultationService | undefined;
  selectedAddOns: string[];
  onAddOnToggle: (addonName: string) => void;
}

const AddOnSelector = ({ selectedService, selectedAddOns, onAddOnToggle }: AddOnSelectorProps) => {
  if (!selectedService || selectedService.addOns.length === 0) return null;

  return (
    <div>
      <h3 className="mb-3 font-medium">Optional Add-ons:</h3>
      <div className="space-y-3">
        {selectedService.addOns.map((addon) => (
          <div key={addon.name} className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center space-x-3">
              <Checkbox
                id={addon.name}
                checked={selectedAddOns.includes(addon.name)}
                onCheckedChange={() => onAddOnToggle(addon.name)}
              />
              <Label htmlFor={addon.name} className="cursor-pointer">
                {addon.name}
              </Label>
            </div>
            <div className="flex items-center space-x-1">
              <DollarSign className="h-3 w-3" />
              <span className="text-sm font-medium">{addon.price.toLocaleString()} XAF</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AddOnSelector;
