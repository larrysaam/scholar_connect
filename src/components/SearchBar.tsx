
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

const SearchBar = () => {
  return (
    <div className="w-full bg-white rounded-lg shadow-sm border p-4">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="md:col-span-2">
          <Input 
            placeholder="Search by name or keywords" 
            className="w-full" 
          />
        </div>
        <div className="md:col-span-1">
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Field of Study" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="computer-science">Computer Science</SelectItem>
              <SelectItem value="biology">Biology</SelectItem>
              <SelectItem value="physics">Physics</SelectItem>
              <SelectItem value="psychology">Psychology</SelectItem>
              <SelectItem value="economics">Economics</SelectItem>
              <SelectItem value="medicine">Medicine</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="md:col-span-1">
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Price Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0-50">$0 - $50</SelectItem>
              <SelectItem value="50-100">$50 - $100</SelectItem>
              <SelectItem value="100-150">$100 - $150</SelectItem>
              <SelectItem value="150+">$150+</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button className="md:col-span-1">
          <Search size={16} className="mr-2" /> Search
        </Button>
      </div>
    </div>
  );
};

export default SearchBar;
