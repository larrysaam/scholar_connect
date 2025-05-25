
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface LocationFieldsProps {
  formData: any;
  onInputChange: (field: string, value: string) => void;
  worldCountries: string[];
  cameroonCities: string[];
  showOtherCountry: boolean;
  showOtherCity: boolean;
}

const LocationFields = ({ 
  formData, 
  onInputChange, 
  worldCountries, 
  cameroonCities, 
  showOtherCountry, 
  showOtherCity 
}: LocationFieldsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="country">Country *</Label>
        <Select onValueChange={(value) => onInputChange("country", value)} required>
          <SelectTrigger>
            <SelectValue placeholder="Select country" />
          </SelectTrigger>
          <SelectContent className="max-h-[200px] overflow-y-auto">
            {worldCountries.map((country) => (
              <SelectItem key={country} value={country}>{country}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {showOtherCountry && (
          <Input 
            placeholder="Enter country name"
            value={formData.customCountry}
            onChange={(e) => onInputChange("customCountry", e.target.value)}
            required
          />
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="city">City *</Label>
        <Select onValueChange={(value) => onInputChange("city", value)} required>
          <SelectTrigger>
            <SelectValue placeholder="Select city" />
          </SelectTrigger>
          <SelectContent className="max-h-[200px] overflow-y-auto">
            {cameroonCities.map((city) => (
              <SelectItem key={city} value={city}>{city}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {showOtherCity && (
          <Input 
            placeholder="Enter city name"
            value={formData.customCity}
            onChange={(e) => onInputChange("customCity", e.target.value)}
            required
          />
        )}
      </div>
    </div>
  );
};

export default LocationFields;
