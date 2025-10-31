import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, Info } from "lucide-react";
import { CreateServiceData } from "@/hooks/useConsultationServices";
import { AcademicLevelPrice, ServiceAddon } from "@/types/consultations";
import PriceGridModal from "./PriceGridModal";

// Predefined add-on options with descriptions
const ADDON_OPTIONS = [
  {
    name: 'Express Review',
    description: 'Expedited review process with faster turnaround time',
  },
  {
    name: 'Citation & Reference Check',
    description: 'Thorough check and verification of citations and references',
  },
  {
    name: 'Formatting & Language Polishing',
    description: 'Advanced formatting and academic language enhancement',
  }
];

interface ServiceFormProps {
  formData: CreateServiceData;
  onFormDataChange: (data: CreateServiceData) => void;
  serviceType?: 'free' | 'paid';
}

const ServiceForm: React.FC<ServiceFormProps> = ({ formData, onFormDataChange, serviceType = 'paid' }) => {
  const updateFormData = (updates: Partial<CreateServiceData>) => {
    onFormDataChange({ ...formData, ...updates });
  };

  const handleCategoryChange = (value: any) => {
    const updatedData: Partial<CreateServiceData> = { category: value };
    
    // If Free Consultation is selected, set all prices to 0
    if (value === 'Free Consultation') {
      updatedData.pricing = [
        { academic_level: 'Undergraduate', price: 0, currency: 'XAF' },
        { academic_level: 'Masters', price: 0, currency: 'XAF' },
        { academic_level: 'PhD', price: 0, currency: 'XAF' },
        { academic_level: 'Postdoc', price: 0, currency: 'XAF' }
      ];
      // Clear any existing add-ons for free consultation
      updatedData.addons = [];
      // Also set title if it's empty or default
      if (!formData.title || formData.title === '') {
        updatedData.title = 'Free Consultation Session';
      }      // Set default duration to 60 minutes
      if (!formData.duration_minutes || formData.duration_minutes === 0) {
        updatedData.duration_minutes = 60;
      }
    } else {
      // Set appropriate default duration based on category
      if (!formData.duration_minutes || formData.duration_minutes === 0) {
        switch (value) {
          case 'Chapter Review':
            updatedData.duration_minutes = 10080; // 7 days
            break;
          case 'Full Thesis Review':
            updatedData.duration_minutes = 43200; // 30 days
            break;
          case 'Full Thesis Cycle Support':
            updatedData.duration_minutes = 129600; // 90 days
            break;
          default:
            updatedData.duration_minutes = 60; // 1 hour
        }
      }
    }
    
    updateFormData(updatedData);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFormData({ title: e.target.value });
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateFormData({ description: e.target.value });
  };
  const handleDurationChange = (value: string) => {
    // Convert duration to minutes based on the selected value
    const durationMap: { [key: string]: number } = {
      '1': 60,     // 1 hour
      '2': 120,    // 2 hours
      '3': 180,    // 3 hours
      '4': 240,    // 4 hours
      '5': 300,    // 5 hours
      '7': 10080,  // 7 days in minutes
      '14': 20160, // 14 days in minutes
      '30': 43200, // 30 days in minutes
      '90': 129600, // 90 days in minutes
      '180': 259200, // 180 days in minutes
      '365': 525600  // 365 days in minutes
    };
    updateFormData({ duration_minutes: durationMap[value] || 60 });
  };

  const getCurrentDurationValue = () => {
    const minutes = formData.duration_minutes;
    // Map minutes back to dropdown values
    const durationMap: { [key: number]: string } = {
      60: '1',      // 1 hour
      120: '2',     // 2 hours
      180: '3',     // 3 hours
      240: '4',     // 4 hours
      300: '5',     // 5 hours
      10080: '7',   // 7 days
      20160: '14',  // 14 days
      43200: '30',  // 30 days
      129600: '90', // 90 days
      259200: '180', // 180 days
      525600: '365'  // 365 days
    };
    return durationMap[minutes] || '1';
  };

  const getDurationOptions = () => {
    // For free services, only show 1 hour option
    if (serviceType === 'free') {
      return [{ value: '1', label: '1 hour' }];
    }

    switch (formData.category) {
      case 'General Consultation':
      case 'Free Consultation':
        return [
          { value: '1', label: '1 hour' },
          { value: '2', label: '2 hours' },
          { value: '3', label: '3 hours' },
          { value: '4', label: '4 hours' },
          { value: '5', label: '5 hours' }
        ];
      case 'Chapter Review':
        return [
          { value: '7', label: '7 days' },
          { value: '14', label: '14 days' },
          { value: '30', label: '30 days' }
        ];
      case 'Full Thesis Review':
        return [
          { value: '30', label: '30 days' },
          { value: '90', label: '90 days' }
        ];
      case 'Full Thesis Cycle Support':
        return [
          { value: '90', label: '90 days' },
          { value: '180', label: '180 days' },
          { value: '365', label: '365 days' }
        ];
      default:
        return [{ value: '1', label: '1 hour' }];
    }
  };

  const getCategoryOptions = () => {
    const allCategories = [
      { value: 'General Consultation', label: 'General Consultation' },
      { value: 'Chapter Review', label: 'Chapter Review' },
      { value: 'Full Thesis Cycle Support', label: 'Full Thesis Cycle Support' },
      { value: 'Full Thesis Review', label: 'Full Thesis Review' },
      { value: 'Free Consultation', label: 'Free Consultation' }
    ];

    if (serviceType === 'free') {
      return allCategories.filter(cat => cat.value === 'Free Consultation');
    } else {
      return allCategories.filter(cat => cat.value !== 'Free Consultation');
    }
  };

  const addPricing = () => {
    updateFormData({
      pricing: [...formData.pricing, { academic_level: 'Masters', price: 0, currency: 'XAF' }]
    });
  };

  const removePricing = (index: number) => {
    updateFormData({
      pricing: formData.pricing.filter((_, i) => i !== index)
    });
  };

  const updatePricing = (index: number, field: keyof AcademicLevelPrice, value: any) => {
    // Prevent price changes for free consultation, but allow academic level changes
    if (formData.category === 'Free Consultation' && field === 'price') {
      return; // Don't update price for free consultations
    }
    
    updateFormData({
      pricing: formData.pricing.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    });
  };
  const addAddon = () => {
    // Add a new add-on with first option as default
    const defaultAddon = ADDON_OPTIONS[0];
    updateFormData({
      addons: [...(formData.addons || []), { 
        name: defaultAddon.name, 
        description: defaultAddon.description, 
        price: 0, 
        currency: 'XAF', 
        is_active: true 
      }]
    });
  };

  const removeAddon = (index: number) => {
    updateFormData({
      addons: formData.addons?.filter((_, i) => i !== index) || []
    });
  };

  const updateAddon = (index: number, field: keyof ServiceAddon, value: any) => {
    updateFormData({
      addons: formData.addons?.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      ) || []
    });
  };

  return (
    <div className="space-y-4 sm:space-y-6 p-1 sm:p-0">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div>
          <Label htmlFor="category" className="text-sm font-medium">Service Category</Label>
          <Select
            value={formData.category}
            onValueChange={handleCategoryChange}
          >
            <SelectTrigger className="text-sm">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {getCategoryOptions().map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>        <div>
          <Label htmlFor="duration" className="text-sm font-medium">Duration</Label>
          <Select
            value={getCurrentDurationValue()}
            onValueChange={handleDurationChange}
          >
            <SelectTrigger className="text-sm">
              <SelectValue placeholder="Select duration" />
            </SelectTrigger>
            <SelectContent>
              {getDurationOptions().map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="title" className="text-sm font-medium">Service Title</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={handleTitleChange}
          placeholder="e.g., Research Methodology Consultation"
          className="text-sm"
        />
      </div>

      <div>
        <Label htmlFor="description" className="text-sm font-medium">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={handleDescriptionChange}
          placeholder="Describe what this service includes..."
          rows={3}
          className="text-sm resize-none"
        />
      </div>

      <div>
        <div className="flex flex-col space-y-2 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between mb-3 sm:mb-4">
          <div className="flex items-center gap-2">
            <Label className="text-sm font-medium">
              Pricing by Academic Level
              {formData.category === 'Free Consultation' && (
                <span className="ml-2 text-green-600 font-semibold">(FREE SERVICE)</span>
              )}
            </Label>
            {formData.category !== 'Free Consultation' && (
              <PriceGridModal 
                category={formData.category} 
                variant="ghost"
                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 -ml-2"
              />
            )}
          </div>
          {formData.category !== 'Free Consultation' && (
            <Button type="button" onClick={addPricing} size="sm" variant="outline" className="w-full sm:w-auto text-xs sm:text-sm">
              <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
              Add Level
            </Button>
          )}
        </div>
        
        <div className="space-y-3">
          {formData.pricing.map((pricing, index) => (
            <div key={`pricing-${index}`} className="flex flex-col space-y-2 sm:space-y-0 sm:flex-row sm:items-center gap-2 sm:gap-3 p-3 border rounded-lg">
              <Select
                value={pricing.academic_level}
                onValueChange={(value: any) => updatePricing(index, 'academic_level', value)}
              >
                <SelectTrigger className="w-full sm:w-40 text-xs sm:text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Undergraduate">Undergraduate</SelectItem>
                  <SelectItem value="Masters">Masters</SelectItem>
                  <SelectItem value="PhD">PhD</SelectItem>
                  <SelectItem value="Postdoc">Postdoc</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex items-center gap-2 flex-1 sm:flex-none">
                {formData.category === 'Free Consultation' ? (
                  <div className="flex items-center gap-2 flex-1 sm:w-32">
                    <div className="flex-1 sm:w-32 px-3 py-2 bg-green-50 border border-green-200 rounded-md text-green-700 font-semibold text-center text-xs sm:text-sm">
                      FREE
                    </div>
                  </div>
                ) : (
                  <>
                    <Input
                      type="number"
                      value={pricing.price}
                      onChange={(e) => updatePricing(index, 'price', parseFloat(e.target.value) || 0)}
                      placeholder="Price"
                      className="flex-1 sm:w-32 text-xs sm:text-sm"
                    />
                    <span className="text-xs sm:text-sm text-gray-600 flex-shrink-0">XAF</span>
                  </>
                )}
                {formData.pricing.length > 1 && formData.category !== 'Free Consultation' && (
                  <Button
                    type="button"
                    onClick={() => removePricing(index)}
                    size="sm"
                    variant="ghost"
                    className="text-red-600 flex-shrink-0 px-2"
                  >
                    <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {formData.category !== 'Free Consultation' && formData.pricing.length > 0 && (
          <div className="mt-2 flex items-center gap-2 text-xs sm:text-sm text-blue-600">
            <Info className="h-3 w-3 sm:h-4 sm:w-4" />
            <span>Click "View Price Grid" above to see recommended price ranges for your academic level</span>
          </div>
        )}
      </div>

      {formData.category !== 'Free Consultation' && (
        <div>
          <div className="flex flex-col space-y-2 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between mb-3 sm:mb-4">
            <Label className="text-sm font-medium">Add-ons (Optional)</Label>
            <Button type="button" onClick={addAddon} size="sm" variant="outline" className="w-full sm:w-auto text-xs sm:text-sm">
              <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
              Add Add-on
            </Button>
          </div>          
          
          <div className="space-y-3">
            {formData.addons?.map((addon, index) => (
              <div key={`addon-${index}`} className="p-3 border rounded-lg space-y-3">
                <div className="flex flex-col space-y-2 sm:space-y-0 sm:flex-row sm:items-center gap-2 sm:gap-3">
                  <Select
                    value={addon.name}
                    onValueChange={(value) => {
                      const selectedAddon = ADDON_OPTIONS.find(opt => opt.name === value);
                      updateAddon(index, 'name', value);
                      if (selectedAddon) {
                        updateAddon(index, 'description', selectedAddon.description);
                      }
                    }}
                  >
                    <SelectTrigger className="flex-1 text-xs sm:text-sm">
                      <SelectValue placeholder="Select an add-on" />
                    </SelectTrigger>
                    <SelectContent>
                      {ADDON_OPTIONS.map((option) => (
                        <SelectItem key={option.name} value={option.name} className="text-xs sm:text-sm">
                          {option.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={addon.price}
                      onChange={(e) => updateAddon(index, 'price', parseFloat(e.target.value) || 0)}
                      placeholder="Price"
                      className="w-24 sm:w-32 text-xs sm:text-sm"
                    />
                    <span className="text-xs sm:text-sm text-gray-600 flex-shrink-0">XAF</span>
                    <Button
                      type="button"
                      onClick={() => removeAddon(index)}
                      size="sm"
                      variant="ghost"
                      className="text-red-600 flex-shrink-0 px-2"
                    >
                      <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-gray-600">
                  {addon.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceForm;