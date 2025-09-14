
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
  const [isSearching, setIsSearching] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setIsSearching(true);
    // Simulate search delay
    setTimeout(() => setIsSearching(false), 500);
  };

  return (
    <div className="space-y-6">
      {/* Enhanced Search Bar with Loading State */}
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          {isSearching ? (
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-emerald-300 border-t-emerald-600"></div>
          ) : (
            <Search className={`h-5 w-5 transition-colors duration-200 ${searchQuery ? 'text-emerald-600' : 'text-emerald-500'}`} />
          )}
        </div>
        <Input
          placeholder="Search by name, skills, expertise, or location..."
          value={searchQuery}
          onChange={handleSearchChange}
          className={`pl-12 pr-4 py-4 text-base border-2 transition-all duration-200 rounded-2xl bg-white/80 backdrop-blur-sm shadow-lg ${
            searchQuery 
              ? 'border-emerald-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-200' 
              : 'border-emerald-100 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100'
          }`}
        />
        {searchQuery && (
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
            <button
              onClick={() => {
                setSearchQuery("");
                setIsSearching(false);
              }}
              className="h-6 w-6 bg-emerald-100 hover:bg-emerald-200 rounded-full flex items-center justify-center transition-colors duration-200"
            >
              <span className="text-emerald-600 text-sm font-bold">×</span>
            </button>
          </div>
        )}
        {/* Search suggestions indicator */}
        {searchQuery && !isSearching && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white/95 backdrop-blur-sm border border-emerald-200 rounded-xl shadow-lg p-3 z-10">
            <p className="text-xs text-emerald-600 font-medium">
              💡 Tip: Try searching for "data analysis", "writing", or specific locations
            </p>
          </div>
        )}
      </div>
        {/* Modern Filter Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className={`h-12 border-2 transition-all duration-200 rounded-xl bg-white/90 backdrop-blur-sm ${
            selectedCategory !== "all" && selectedCategory !== "All"
              ? 'border-emerald-400 bg-emerald-50 text-emerald-700'
              : 'border-emerald-200 hover:border-emerald-300'
          }`}>
            <SelectValue placeholder="Service Category" />
            {selectedCategory !== "all" && selectedCategory !== "All" && (
              <div className="absolute right-8 top-1/2 transform -translate-y-1/2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              </div>
            )}
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>{category}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select value={priceRange} onValueChange={setPriceRange}>
          <SelectTrigger className={`h-12 border-2 transition-all duration-200 rounded-xl bg-white/90 backdrop-blur-sm ${
            priceRange !== "all"
              ? 'border-emerald-400 bg-emerald-50 text-emerald-700'
              : 'border-emerald-200 hover:border-emerald-300'
          }`}>
            <SelectValue placeholder="Price Range" />
            {priceRange !== "all" && (
              <div className="absolute right-8 top-1/2 transform -translate-y-1/2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              </div>
            )}
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any Price</SelectItem>
            <SelectItem value="0-5000">0 - 5,000 XAF</SelectItem>
            <SelectItem value="5000-10000">5,000 - 10,000 XAF</SelectItem>
            <SelectItem value="10000+">10,000+ XAF</SelectItem>
          </SelectContent>
        </Select>
        
        <Button 
          variant="outline" 
          className="h-12 border-2 border-emerald-200 text-emerald-600 hover:bg-emerald-50 hover:border-emerald-300 rounded-xl font-medium transition-all duration-200 bg-white/90 backdrop-blur-sm hover:shadow-lg hover:scale-105 active:scale-95"
        >
          <Filter className="h-4 w-4 mr-2" />
          Advanced Filters
        </Button>
        
        <Button 
          className="h-12 bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 hover:from-emerald-700 hover:via-green-700 hover:to-teal-700 text-white shadow-lg hover:shadow-2xl rounded-xl font-medium transition-all duration-200 hover:scale-105 active:scale-95"
          disabled={isSearching}
        >
          {isSearching ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2"></div>
          ) : (
            <Search className="h-4 w-4 mr-2" />
          )}
          {isSearching ? 'Searching...' : 'Search Now'}
        </Button>
      </div>
      
      {/* Active Filters Display */}
      {(searchQuery || selectedCategory !== "all" || priceRange !== "all") && (
        <div className="flex flex-wrap items-center gap-3 p-4 bg-gradient-to-r from-emerald-50 via-green-50 to-teal-50 rounded-2xl border border-emerald-200">
          <span className="text-sm font-semibold text-emerald-700">Active Filters:</span>
          {searchQuery && (
            <div className="flex items-center bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm">
              <Search className="h-3 w-3 mr-1" />
              "{searchQuery}"
              <button
                onClick={() => setSearchQuery("")}
                className="ml-2 hover:bg-emerald-200 rounded-full w-4 h-4 flex items-center justify-center"
              >
                <span className="text-xs">×</span>
              </button>
            </div>
          )}
          {selectedCategory !== "all" && selectedCategory !== "All" && (
            <div className="flex items-center bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
              <Filter className="h-3 w-3 mr-1" />
              {selectedCategory}
              <button
                onClick={() => setSelectedCategory("all")}
                className="ml-2 hover:bg-blue-200 rounded-full w-4 h-4 flex items-center justify-center"
              >
                <span className="text-xs">×</span>
              </button>
            </div>
          )}
          {priceRange !== "all" && (
            <div className="flex items-center bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm">
              <span className="text-xs font-bold mr-1">XAF</span>
              {priceRange === "0-5000" ? "0 - 5K" : 
               priceRange === "5000-10000" ? "5K - 10K" : "10K+"}
              <button
                onClick={() => setPriceRange("all")}
                className="ml-2 hover:bg-purple-200 rounded-full w-4 h-4 flex items-center justify-center"
              >
                <span className="text-xs">×</span>
              </button>
            </div>
          )}
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("all");
              setPriceRange("all");
            }}
            className="text-sm text-gray-500 hover:text-gray-700 underline"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchFilters;
