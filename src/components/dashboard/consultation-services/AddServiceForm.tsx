
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, DollarSign } from "lucide-react";
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
  category: "General Consultation" | "Chapter Review" | "Full Thesis Cycle Support" | "Full Thesis Review";
  academicLevelPrices: AcademicLevelPrice[];
  description: string;
  addOns: AddOn[];
}

interface AddServiceFormProps {
  onAddService: (service: Omit<ServiceType, "id">) => void;
}

const AddServiceForm = ({ onAddService }: AddServiceFormProps) => {
  const [newService, setNewService] = useState<Partial<ServiceType>>({
    category: "General Consultation",
    academicLevelPrices: [],
    description: "",
    addOns: []
  });

  const [tempAcademicLevel, setTempAcademicLevel] = useState<"Undergraduate" | "Master's" | "PhD">("Undergraduate");
  const [tempPrice, setTempPrice] = useState<number>(0);
  const [tempAddOnName, setTempAddOnName] = useState<string>("");
  const [tempAddOnPrice, setTempAddOnPrice] = useState<number>(0);

  const serviceCategories = [
    "General Consultation",
    "Chapter Review", 
    "Full Thesis Cycle Support",
    "Full Thesis Review"
  ];

  const academicLevels = ["Undergraduate", "Master's", "PhD"];

  const getAvailableAddOns = (category: string) => {
    switch (category) {
      case "Chapter Review":
        return [
          "Formatting & Language Polishing",
          "Citation & Reference Check",
          "Express Review (24–72 hours)"
        ];
      case "Full Thesis Review":
        return [
          "Formatting & Language Polishing",
          "Citation & Reference Check",
          "Express Review (72 hours)"
        ];
      case "Full Thesis Cycle Support":
        return [
          "Formatting & Language Polishing",
          "Citation & Reference Check",
          "Express Review"
        ];
      default:
        return [];
    }
  };

  const addAcademicLevelPrice = () => {
    if (tempAcademicLevel && tempPrice > 0) {
      const existingIndex = newService.academicLevelPrices?.findIndex(
        item => item.level === tempAcademicLevel
      );
      
      if (existingIndex !== undefined && existingIndex >= 0) {
        // Update existing level
        const updatedPrices = [...(newService.academicLevelPrices || [])];
        updatedPrices[existingIndex] = { level: tempAcademicLevel, price: tempPrice };
        setNewService(prev => ({ ...prev, academicLevelPrices: updatedPrices }));
      } else {
        // Add new level
        setNewService(prev => ({
          ...prev,
          academicLevelPrices: [...(prev.academicLevelPrices || []), { level: tempAcademicLevel, price: tempPrice }]
        }));
      }
      
      setTempPrice(0);
    }
  };

  const addAddOn = () => {
    if (tempAddOnName && tempAddOnPrice > 0) {
      const existingIndex = newService.addOns?.findIndex(
        addon => addon.name === tempAddOnName
      );
      
      if (existingIndex !== undefined && existingIndex >= 0) {
        // Update existing add-on
        const updatedAddOns = [...(newService.addOns || [])];
        updatedAddOns[existingIndex] = { name: tempAddOnName, price: tempAddOnPrice };
        setNewService(prev => ({ ...prev, addOns: updatedAddOns }));
      } else {
        // Add new add-on
        setNewService(prev => ({
          ...prev,
          addOns: [...(prev.addOns || []), { name: tempAddOnName, price: tempAddOnPrice }]
        }));
      }
      
      setTempAddOnName("");
      setTempAddOnPrice(0);
    }
  };

  const removeAcademicLevelPrice = (level: string) => {
    setNewService(prev => ({
      ...prev,
      academicLevelPrices: prev.academicLevelPrices?.filter(item => item.level !== level) || []
    }));
  };

  const removeAddOn = (name: string) => {
    setNewService(prev => ({
      ...prev,
      addOns: prev.addOns?.filter(addon => addon.name !== name) || []
    }));
  };

  const handleAddService = () => {
    if (newService.category && newService.academicLevelPrices && newService.academicLevelPrices.length > 0) {
      onAddService(newService as Omit<ServiceType, "id">);
      setNewService({
        category: "General Consultation",
        academicLevelPrices: [],
        description: "",
        addOns: []
      });
    }
  };

  return (
    <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 space-y-4">
      <h4 className="font-medium">Add New Service</h4>
      
      <div>
        <Label htmlFor="category">Service Category</Label>
        <div className="flex items-center space-x-2">
          <Select
            value={newService.category}
            onValueChange={(value) => setNewService(prev => ({ ...prev, category: value as any }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {serviceCategories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {newService.category && (
            <PriceGridModal category={newService.category} />
          )}
        </div>
      </div>
      
      <div>
        <Label htmlFor="description">Service Description</Label>
        <Textarea
          id="description"
          placeholder="Describe your service offering..."
          value={newService.description}
          onChange={(e) => setNewService(prev => ({ ...prev, description: e.target.value }))}
        />
      </div>

      {/* Academic Level and Price Input */}
      <div className="space-y-3">
        <Label>Academic Level Pricing</Label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <Label htmlFor="academicLevel">Academic Level</Label>
            <Select
              value={tempAcademicLevel}
              onValueChange={(value) => setTempAcademicLevel(value as any)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {academicLevels.map((level) => (
                  <SelectItem key={level} value={level}>
                    {level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="price">Price (XAF)</Label>
            <Input
              id="price"
              type="number"
              placeholder="Enter price"
              value={tempPrice || ''}
              onChange={(e) => setTempPrice(parseInt(e.target.value) || 0)}
            />
          </div>
          
          <div className="flex items-end">
            <Button 
              type="button" 
              onClick={addAcademicLevelPrice}
              disabled={!tempAcademicLevel || tempPrice <= 0}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>
        </div>

        {/* Display added academic level prices */}
        {newService.academicLevelPrices && newService.academicLevelPrices.length > 0 && (
          <div className="space-y-2">
            <Label>Added Pricing:</Label>
            <div className="flex flex-wrap gap-2">
              {newService.academicLevelPrices.map((levelPrice, index) => (
                <div key={index} className="flex items-center space-x-2 bg-blue-50 rounded-lg p-2">
                  <Badge variant="secondary">{levelPrice.level}</Badge>
                  <div className="flex items-center space-x-1">
                    <DollarSign className="h-3 w-3" />
                    <span className="text-sm">{levelPrice.price.toLocaleString()} XAF</span>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => removeAcademicLevelPrice(levelPrice.level)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Add-ons Section */}
      {newService.category && getAvailableAddOns(newService.category).length > 0 && (
        <div className="space-y-3">
          <Label>Optional Add-ons</Label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <Label htmlFor="addonName">Add-on Service</Label>
              <Select
                value={tempAddOnName}
                onValueChange={setTempAddOnName}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select add-on" />
                </SelectTrigger>
                <SelectContent>
                  {getAvailableAddOns(newService.category).map((addon) => (
                    <SelectItem key={addon} value={addon}>
                      {addon}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="addonPrice">Add-on Price (XAF)</Label>
              <Input
                id="addonPrice"
                type="number"
                placeholder="Enter price"
                value={tempAddOnPrice || ''}
                onChange={(e) => setTempAddOnPrice(parseInt(e.target.value) || 0)}
              />
            </div>
            
            <div className="flex items-end">
              <Button 
                type="button" 
                onClick={addAddOn}
                disabled={!tempAddOnName || tempAddOnPrice <= 0}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>
          </div>

          {/* Display added add-ons */}
          {newService.addOns && newService.addOns.length > 0 && (
            <div className="space-y-2">
              <Label>Added Add-ons:</Label>
              <div className="flex flex-wrap gap-2">
                {newService.addOns.map((addon, index) => (
                  <div key={index} className="flex items-center space-x-2 bg-green-50 rounded-lg p-2">
                    <span className="text-sm">{addon.name}</span>
                    <div className="flex items-center space-x-1">
                      <DollarSign className="h-3 w-3" />
                      <span className="text-sm font-medium">{addon.price.toLocaleString()} XAF</span>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeAddOn(addon.name)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      
      <Button 
        onClick={handleAddService} 
        className="w-full"
        disabled={!newService.category || !newService.academicLevelPrices || newService.academicLevelPrices.length === 0}
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Service
      </Button>
    </div>
  );
};

export default AddServiceForm;
