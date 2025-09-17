import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";
import { CreateServiceData } from "@/hooks/useConsultationServices";
import { AcademicLevelPrice, ServiceAddon } from "@/types/consultations";

interface ServiceFormProps {
  formData: CreateServiceData;
  onFormDataChange: (data: CreateServiceData) => void;
}

const ServiceForm: React.FC<ServiceFormProps> = ({ formData, onFormDataChange }) => {
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
      // Also set title if it's empty or default
      if (!formData.title || formData.title === '') {
        updatedData.title = 'Free Consultation Session';
      }
      // Set default duration to 60 minutes
      if (!formData.duration_minutes || formData.duration_minutes === 0) {
        updatedData.duration_minutes = 60;
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

  const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFormData({ duration_minutes: parseInt(e.target.value) || 60 });
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
    updateFormData({
      addons: [...(formData.addons || []), { name: '', description: '', price: 0, currency: 'XAF', is_active: true }]
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
              <SelectItem value="General Consultation">General Consultation</SelectItem>
              <SelectItem value="Chapter Review">Chapter Review</SelectItem>
              <SelectItem value="Full Thesis Cycle Support">Full Thesis Cycle Support</SelectItem>
              <SelectItem value="Full Thesis Review">Full Thesis Review</SelectItem>
              <SelectItem value="Free Consultation">Free Consultation</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="duration" className="text-sm font-medium">Duration (minutes)</Label>
          <Input
            id="duration"
            type="number"
            value={formData.duration_minutes}
            onChange={handleDurationChange}
            placeholder="60"
            className="text-sm"
          />
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
          <Label className="text-sm font-medium">
            Pricing by Academic Level
            {formData.category === 'Free Consultation' && (
              <span className="ml-2 text-green-600 font-semibold">(FREE SERVICE)</span>
            )}
          </Label>
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
                    <span className="text-xs sm:text-sm text-green-600 flex-shrink-0">0.00 XAF</span>
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
      </div>

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
                <Input
                  value={addon.name}
                  onChange={(e) => updateAddon(index, 'name', e.target.value)}
                  placeholder="Add-on name"
                  className="flex-1 text-xs sm:text-sm"
                />
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
              <Input
                value={addon.description || ''}
                onChange={(e) => updateAddon(index, 'description', e.target.value)}
                placeholder="Add-on description (optional)"
                className="text-xs sm:text-sm"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServiceForm;