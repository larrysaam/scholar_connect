import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import StatusIndicator from "../researcher/StatusIndicator";

interface Filters {
  availability: string[];
  rating: number[];
  expertise: string;
  field?: string;
  specialty?: string[];
  priceRange?: {
    min: number;
    max: number;
  };
}

interface AdvancedSearchFiltersProps {
  onFiltersChange: (filters: Filters) => void;
}

const AdvancedSearchFilters = ({ onFiltersChange }: AdvancedSearchFiltersProps) => {
  const [filters, setFilters] = useState<Filters>({
    availability: [],
    rating: [0],
    expertise: '',
  });

  const handleAvailabilityChange = (option: string, checked: boolean) => {
    setFilters(prev => {
      let newAvailability = [...prev.availability];
      if (checked) {
        newAvailability.push(option);
      } else {
        newAvailability = newAvailability.filter(item => item !== option);
      }
      const updatedFilters = { ...prev, availability: newAvailability };
      onFiltersChange(updatedFilters);
      return updatedFilters;
    });
  };

  const handleRatingChange = (value: number[]) => {
    setFilters(prev => {
      const updatedFilters = { ...prev, rating: value };
      onFiltersChange(updatedFilters);
      return updatedFilters;
    });
  };

  const handleExpertiseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFilters(prev => {
      const updatedFilters = { ...prev, expertise: value };
      onFiltersChange(updatedFilters);
      return updatedFilters;
    });
  };

  const handleResetFilters = () => {
    const resetFilters: Filters = {
      availability: [],
      rating: [0],
      expertise: '',
    };
    setFilters(resetFilters);
    onFiltersChange(resetFilters);
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Advanced Filters</h3>
      
      <div className="space-y-6">
        {/* Availability Status */}
        <div>
          <Label className="text-sm font-medium mb-3 block">Availability Status</Label>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="online" 
                checked={filters.availability.includes('online')}
                onCheckedChange={(checked) => handleAvailabilityChange('online', checked as boolean)}
              />
              <StatusIndicator isOnline={true} />
              <Label htmlFor="online" className="text-sm">Currently Online</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="available" 
                checked={filters.availability.includes('available')}
                onCheckedChange={(checked) => handleAvailabilityChange('available', checked as boolean)}
              />
              <StatusIndicator isOnline={false} />
              <Label htmlFor="available" className="text-sm">Available Today</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="busy" 
                checked={filters.availability.includes('busy')}
                onCheckedChange={(checked) => handleAvailabilityChange('busy', checked as boolean)}
              />
              <StatusIndicator isOnline={false} />
              <Label htmlFor="busy" className="text-sm">Busy</Label>
            </div>
          </div>
        </div>

        {/* Rating */}
        <div>
          <Label className="text-sm font-medium mb-3 block">Rating</Label>
          <Slider
            defaultValue={filters.rating}
            min={0}
            max={5}
            step={0.5}
            onValueChange={(value) => handleRatingChange(value)}
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>0 Star</span>
            <span>5 Stars</span>
          </div>
        </div>

        {/* Expertise */}
        <div>
          <Label htmlFor="expertise" className="text-sm font-medium mb-3 block">Expertise</Label>
          <Input 
            type="text" 
            id="expertise" 
            placeholder="e.g., Machine Learning" 
            value={filters.expertise}
            onChange={handleExpertiseChange}
          />
        </div>

        {/* Reset Filters */}
        <div>
          <Button variant="outline" className="w-full" onClick={handleResetFilters}>
            Reset Filters
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default AdvancedSearchFilters;
