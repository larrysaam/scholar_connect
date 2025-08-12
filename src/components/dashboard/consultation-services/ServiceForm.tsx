import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";
import { CreateServiceData, AcademicLevelPrice, ServiceAddon } from "@/hooks/useConsultationServices";

interface ServiceFormProps {
  formData: CreateServiceData;
  onFormDataChange: (data: CreateServiceData) => void;
}

const ServiceForm: React.FC<ServiceFormProps> = ({ formData, onFormDataChange }) => {
  const updateFormData = (updates: Partial<CreateServiceData>) => {
    onFormDataChange({ ...formData, ...updates });
  };

  const handleCategoryChange = (value: any) => {
    updateFormData({ category: value });
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
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="category">Service Category</Label>
          <Select
            value={formData.category}
            onValueChange={handleCategoryChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="General Consultation">General Consultation</SelectItem>
              <SelectItem value="Chapter Review">Chapter Review</SelectItem>
              <SelectItem value="Full Thesis Cycle Support">Full Thesis Cycle Support</SelectItem>
              <SelectItem value="Full Thesis Review">Full Thesis Review</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="duration">Duration (minutes)</Label>
          <Input
            id="duration"
            type="number"
            value={formData.duration_minutes}
            onChange={handleDurationChange}
            placeholder="60"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="title">Service Title</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={handleTitleChange}
          placeholder="e.g., Research Methodology Consultation"
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={handleDescriptionChange}
          placeholder="Describe what this service includes..."
          rows={3}
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <Label>Pricing by Academic Level</Label>
          <Button type="button" onClick={addPricing} size="sm" variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Add Level
          </Button>
        </div>
        <div className="space-y-3">
          {formData.pricing.map((pricing, index) => (
            <div key={`pricing-${index}`} className="flex items-center gap-3 p-3 border rounded-lg">
              <Select
                value={pricing.academic_level}
                onValueChange={(value: any) => updatePricing(index, 'academic_level', value)}
              >
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Undergraduate">Undergraduate</SelectItem>
                  <SelectItem value="Masters">Masters</SelectItem>
                  <SelectItem value="PhD">PhD</SelectItem>
                  <SelectItem value="Postdoc">Postdoc</SelectItem>
                </SelectContent>
              </Select>
              <Input
                type="number"
                value={pricing.price}
                onChange={(e) => updatePricing(index, 'price', parseFloat(e.target.value) || 0)}
                placeholder="Price"
                className="w-32"
              />
              <span className="text-sm text-gray-600">XAF</span>
              {formData.pricing.length > 1 && (
                <Button
                  type="button"
                  onClick={() => removePricing(index)}
                  size="sm"
                  variant="ghost"
                  className="text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <Label>Add-ons (Optional)</Label>
          <Button type="button" onClick={addAddon} size="sm" variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Add Add-on
          </Button>
        </div>
        <div className="space-y-3">
          {formData.addons?.map((addon, index) => (
            <div key={`addon-${index}`} className="p-3 border rounded-lg space-y-3">
              <div className="flex items-center gap-3">
                <Input
                  value={addon.name}
                  onChange={(e) => updateAddon(index, 'name', e.target.value)}
                  placeholder="Add-on name"
                  className="flex-1"
                />
                <Input
                  type="number"
                  value={addon.price}
                  onChange={(e) => updateAddon(index, 'price', parseFloat(e.target.value) || 0)}
                  placeholder="Price"
                  className="w-32"
                />
                <span className="text-sm text-gray-600">XAF</span>
                <Button
                  type="button"
                  onClick={() => removeAddon(index)}
                  size="sm"
                  variant="ghost"
                  className="text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <Input
                value={addon.description || ''}
                onChange={(e) => updateAddon(index, 'description', e.target.value)}
                placeholder="Add-on description (optional)"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServiceForm;