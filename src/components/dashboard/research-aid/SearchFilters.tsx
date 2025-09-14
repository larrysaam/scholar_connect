
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, Filter } from "lucide-react";

interface SearchFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  priceRange: string;
  setPriceRange: (range: string) => void;
  categories: string[];
}

const SearchFilters = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  priceRange,
  setPriceRange,
  categories
}: SearchFiltersProps) => {
  return (
    <Card className="border-green-100 shadow-sm">
      <CardContent className="p-4 sm:p-6">
        <div className="space-y-4">
          {/* Search Input */}
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 flex-shrink-0" />
            <Input
              placeholder="Search by name, skills, or expertise..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 border-green-200 focus:border-green-400 text-sm sm:text-base"
            />
          </div>
          
          {/* Filter Controls - Responsive Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {/* Category Filter */}
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="border-green-200 text-sm sm:text-base h-9 sm:h-10">
                <SelectValue placeholder="Service Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {/* Price Range Filter */}
            <Select value={priceRange} onValueChange={setPriceRange}>
              <SelectTrigger className="border-green-200 text-sm sm:text-base h-9 sm:h-10">
                <SelectValue placeholder="Price Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any Price</SelectItem>
                <SelectItem value="0-5000">0 - 5,000 XAF</SelectItem>
                <SelectItem value="5000-10000">5,000 - 10,000 XAF</SelectItem>
                <SelectItem value="10000+">10,000+ XAF</SelectItem>
              </SelectContent>
            </Select>
            
            {/* More Filters Button */}
            <Button 
              variant="outline" 
              className="border-green-200 text-green-600 hover:bg-green-50 w-full sm:w-auto text-sm sm:text-base h-9 sm:h-10"
            >
              <Filter className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">More Filters</span>
              <span className="sm:hidden">Filters</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SearchFilters;
