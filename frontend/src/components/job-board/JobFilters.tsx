
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface JobFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  selectedUrgency: string;
  setSelectedUrgency: (urgency: string) => void;
  selectedBudget: string;
  setSelectedBudget: (budget: string) => void;
  filteredJobsCount: number;
}

const JobFilters = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  selectedUrgency,
  setSelectedUrgency,
  selectedBudget,
  setSelectedBudget,
  filteredJobsCount
}: JobFiltersProps) => {
  return (
    <>
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Job Board</h1>
          <p className="text-gray-600">Discover and apply to research assistance opportunities</p>
        </div>
        <div className="text-sm text-gray-500">
          {filteredJobsCount} jobs available
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Search className="h-5 w-5 text-primary" />
              <Input
                placeholder="Search jobs by title, description, or skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Statistics">Statistics</SelectItem>
                  <SelectItem value="GIS">GIS & Mapping</SelectItem>
                  <SelectItem value="Editing">Academic Editing</SelectItem>
                  <SelectItem value="Research Assistance">Research Assistance</SelectItem>
                  <SelectItem value="Transcription">Transcription</SelectItem>
                  <SelectItem value="Design">Design & Visualization</SelectItem>
                  <SelectItem value="Translation">Translation</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={selectedUrgency} onValueChange={setSelectedUrgency}>
                <SelectTrigger>
                  <SelectValue placeholder="Urgency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Urgency</SelectItem>
                  <SelectItem value="high">High Priority</SelectItem>
                  <SelectItem value="medium">Medium Priority</SelectItem>
                  <SelectItem value="low">Low Priority</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={selectedBudget} onValueChange={setSelectedBudget}>
                <SelectTrigger>
                  <SelectValue placeholder="Budget Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any Budget</SelectItem>
                  <SelectItem value="0-50000">0 - 50,000 XAF</SelectItem>
                  <SelectItem value="50000-100000">50,000 - 100,000 XAF</SelectItem>
                  <SelectItem value="100000-200000">100,000 - 200,000 XAF</SelectItem>
                  <SelectItem value="200000">200,000+ XAF</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline" className="w-full">
                Advanced Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default JobFilters;
