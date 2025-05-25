
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, Filter, X, Circle } from "lucide-react";
import StatusIndicator from "@/components/researcher/StatusIndicator";

interface FilterState {
  field: string;
  priceRange: [number, number];
  rating: number;
  availability: string;
  experience: string;
  languages: string[];
  specialties: string[];
  onlineStatus: string[];
}

const AdvancedSearchFilters = () => {
  const [filters, setFilters] = useState<FilterState>({
    field: '',
    priceRange: [35000, 55000],
    rating: 4.0,
    availability: '',
    experience: '',
    languages: [],
    specialties: [],
    onlineStatus: []
  });

  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const fields = [
    'Computer Science', 'Physics', 'Biology', 'Chemistry', 'Mathematics',
    'Economics', 'Psychology', 'Medicine', 'Engineering', 'Literature'
  ];

  const specialties = [
    'Machine Learning', 'Quantum Computing', 'Genetics', 'Organic Chemistry',
    'Statistics', 'Macroeconomics', 'Cognitive Psychology', 'Immunology',
    'Software Engineering', 'Creative Writing'
  ];

  const languages = ['English', 'French', 'Spanish', 'German', 'Dutch', 'Russian', 'Mandarin'];

  const applyFilter = (filterName: string, value: any) => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
    if (!activeFilters.includes(filterName)) {
      setActiveFilters(prev => [...prev, filterName]);
    }
  };

  const removeFilter = (filterName: string) => {
    setActiveFilters(prev => prev.filter(f => f !== filterName));
  };

  const clearAllFilters = () => {
    setFilters({
      field: '',
      priceRange: [35000, 55000],
      rating: 4.0,
      availability: '',
      experience: '',
      languages: [],
      specialties: [],
      onlineStatus: []
    });
    setActiveFilters([]);
  };

  const handleOnlineStatusChange = (status: string, checked: boolean) => {
    if (checked) {
      applyFilter('onlineStatus', [...filters.onlineStatus, status]);
    } else {
      applyFilter('onlineStatus', filters.onlineStatus.filter(s => s !== status));
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Filter className="h-5 w-5" />
          <span>Advanced Search Filters</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Active Filters */}
        {activeFilters.length > 0 && (
          <div className="space-y-2">
            <Label>Active Filters</Label>
            <div className="flex flex-wrap gap-2">
              {activeFilters.map(filter => (
                <Badge key={filter} variant="secondary" className="cursor-pointer">
                  {filter}
                  <X 
                    className="h-3 w-3 ml-1" 
                    onClick={() => removeFilter(filter)}
                  />
                </Badge>
              ))}
              <Button size="sm" variant="outline" onClick={clearAllFilters}>
                Clear All
              </Button>
            </div>
          </div>
        )}

        {/* Field Selection */}
        <div className="space-y-2">
          <Label>Field of Study</Label>
          <Select onValueChange={(value) => applyFilter('field', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select field" />
            </SelectTrigger>
            <SelectContent>
              {fields.map(field => (
                <SelectItem key={field} value={field}>{field}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Price Range */}
        <div className="space-y-2">
          <Label>Price Range (XAF/hour)</Label>
          <div className="px-3">
            <Slider
              value={filters.priceRange}
              onValueChange={(value) => applyFilter('priceRange', value)}
              max={60000}
              min={30000}
              step={5000}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-500 mt-1">
              <span>{filters.priceRange[0].toLocaleString()} XAF</span>
              <span>{filters.priceRange[1].toLocaleString()} XAF</span>
            </div>
          </div>
        </div>

        {/* Minimum Rating */}
        <div className="space-y-2">
          <Label>Minimum Rating</Label>
          <Select onValueChange={(value) => applyFilter('rating', parseFloat(value))}>
            <SelectTrigger>
              <SelectValue placeholder="Select minimum rating" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="4.5">4.5+ Stars</SelectItem>
              <SelectItem value="4.0">4.0+ Stars</SelectItem>
              <SelectItem value="3.5">3.5+ Stars</SelectItem>
              <SelectItem value="3.0">3.0+ Stars</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Online Status */}
        <div className="space-y-2">
          <Label>Online Status</Label>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="online" 
                checked={filters.onlineStatus.includes('online')}
                onCheckedChange={(checked) => handleOnlineStatusChange('online', !!checked)}
              />
              <Label htmlFor="online" className="flex items-center space-x-2 text-sm">
                <StatusIndicator status="online" />
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="offline" 
                checked={filters.onlineStatus.includes('offline')}
                onCheckedChange={(checked) => handleOnlineStatusChange('offline', !!checked)}
              />
              <Label htmlFor="offline" className="flex items-center space-x-2 text-sm">
                <StatusIndicator status="offline" />
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="in-session" 
                checked={filters.onlineStatus.includes('in-session')}
                onCheckedChange={(checked) => handleOnlineStatusChange('in-session', !!checked)}
              />
              <Label htmlFor="in-session" className="flex items-center space-x-2 text-sm">
                <StatusIndicator status="in-session" />
              </Label>
            </div>
          </div>
        </div>

        {/* Availability */}
        <div className="space-y-2">
          <Label>Availability</Label>
          <Select onValueChange={(value) => applyFilter('availability', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select availability" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Available Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="flexible">Flexible</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Experience Level */}
        <div className="space-y-2">
          <Label>Experience Level</Label>
          <Select onValueChange={(value) => applyFilter('experience', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select experience level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="phd">PhD Students</SelectItem>
              <SelectItem value="postdoc">Postdocs</SelectItem>
              <SelectItem value="assistant">Assistant Professors</SelectItem>
              <SelectItem value="associate">Associate Professors</SelectItem>
              <SelectItem value="full">Full Professors</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Specialties */}
        <div className="space-y-2">
          <Label>Specialties</Label>
          <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
            {specialties.map(specialty => (
              <div key={specialty} className="flex items-center space-x-2">
                <Checkbox
                  id={specialty}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      applyFilter('specialties', [...filters.specialties, specialty]);
                    } else {
                      applyFilter('specialties', filters.specialties.filter(s => s !== specialty));
                    }
                  }}
                />
                <Label htmlFor={specialty} className="text-sm">{specialty}</Label>
              </div>
            ))}
          </div>
        </div>

        {/* Languages */}
        <div className="space-y-2">
          <Label>Languages</Label>
          <div className="flex flex-wrap gap-2">
            {languages.map(language => (
              <div key={language} className="flex items-center space-x-2">
                <Checkbox
                  id={language}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      applyFilter('languages', [...filters.languages, language]);
                    } else {
                      applyFilter('languages', filters.languages.filter(l => l !== language));
                    }
                  }}
                />
                <Label htmlFor={language} className="text-sm">{language}</Label>
              </div>
            ))}
          </div>
        </div>

        <Button className="w-full">
          <Search className="h-4 w-4 mr-2" />
          Apply Filters
        </Button>
      </CardContent>
    </Card>
  );
};

export default AdvancedSearchFilters;
