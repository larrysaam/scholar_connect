import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SearchBarProps {
  onSearch: (query: string) => void;
  onFilterChange?: (field: string, value: string) => void;
  value?: string;
}

const SearchBar = ({ onSearch, onFilterChange, value = "" }: SearchBarProps) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const query = (form.elements.namedItem('searchQuery') as HTMLInputElement).value;
    onSearch(query);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(e.target.value);
  };

  return (
    <div className="w-full space-y-4">
      <form onSubmit={handleSubmit} className="relative">
        <Input 
          name="searchQuery"
          value={value}
          placeholder="Search by name, expertise, or location..." 
          className="w-full pl-10 py-6 text-base bg-white border-2 border-gray-100 focus:border-primary focus:ring-4 focus:ring-primary/10 rounded-xl transition-all duration-200"
          onChange={handleInputChange}
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
      </form>

      <div className="flex items-center gap-4 flex-wrap">
        <Select onValueChange={(value) => onFilterChange?.('expertise', value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Expertise" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Expertise</SelectItem>
            <SelectItem value="statistics">Statistics</SelectItem>
            <SelectItem value="research-methods">Research Methods</SelectItem>
            <SelectItem value="data-analysis">Data Analysis</SelectItem>
            <SelectItem value="academic-writing">Academic Writing</SelectItem>
            <SelectItem value="literature-review">Literature Review</SelectItem>
          </SelectContent>
        </Select>

        <Select onValueChange={(value) => onFilterChange?.('rating', value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Rating" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Ratings</SelectItem>
            <SelectItem value="4+">4+ Stars</SelectItem>
            <SelectItem value="3+">3+ Stars</SelectItem>
          </SelectContent>
        </Select>

        <Select onValueChange={(value) => onFilterChange?.('priceRange', value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Price Range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Prices</SelectItem>
            <SelectItem value="0-5000">0 - 5,000 XAF</SelectItem>
            <SelectItem value="5000-10000">5,000 - 10,000 XAF</SelectItem>
            <SelectItem value="10000+">10,000+ XAF</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default SearchBar;
