
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, Filter } from "lucide-react";

interface SearchAndFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedField: string;
  setSelectedField: (field: string) => void;
  selectedLanguage: string;
  setSelectedLanguage: (language: string) => void;
  priceRange: string;
  setPriceRange: (range: string) => void;
}

const SearchAndFilters = ({
  searchQuery,
  setSearchQuery,
  selectedField,
  setSelectedField,
  selectedLanguage,
  setSelectedLanguage,
  priceRange,
  setPriceRange
}: SearchAndFiltersProps) => {
  return (
    <section className="py-8 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <Card className="border-primary/20 shadow-sm">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Search className="h-5 w-5 text-primary" />
                <Input
                  placeholder="Search by name, skills, or expertise..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 border-primary/20 focus:border-primary"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Select value={selectedField} onValueChange={setSelectedField}>
                  <SelectTrigger className="border-primary/20">
                    <SelectValue placeholder="Expertise Area" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Areas</SelectItem>
                    <SelectItem value="Statistician">Statistician</SelectItem>
                    <SelectItem value="Data Analysis">Data Analysis</SelectItem>
                    <SelectItem value="Academic Editing">Academic Editing</SelectItem>
                    <SelectItem value="GIS">GIS & Mapping</SelectItem>
                    <SelectItem value="Research">Research Assistance</SelectItem>
                    <SelectItem value="Translators">Translators</SelectItem>
                    <SelectItem value="Design & Visualization">Design & Visualization</SelectItem>
                    <SelectItem value="Transcribers">Transcribers</SelectItem>
                    <SelectItem value="Publishers / Advisors">Publishers / Advisors</SelectItem>
                    <SelectItem value="Survey Tool Experts">Survey Tool Experts</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                  <SelectTrigger className="border-primary/20">
                    <SelectValue placeholder="Language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Languages</SelectItem>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="french">French</SelectItem>
                    <SelectItem value="arabic">Arabic</SelectItem>
                    <SelectItem value="german">German</SelectItem>
                    <SelectItem value="mandarin">Mandarin</SelectItem>
                    <SelectItem value="spanish">Spanish</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={priceRange} onValueChange={setPriceRange}>
                  <SelectTrigger className="border-primary/20">
                    <SelectValue placeholder="Price Range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any Price</SelectItem>
                    <SelectItem value="0-10000">0 - 10,000 XAF</SelectItem>
                    <SelectItem value="10000-15000">10,000 - 15,000 XAF</SelectItem>
                    <SelectItem value="15000+">15,000+ XAF</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button variant="outline" className="border-primary/20 text-primary hover:bg-primary/10">
                  <Filter className="h-4 w-4 mr-2" />
                  Advanced Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default SearchAndFilters;
