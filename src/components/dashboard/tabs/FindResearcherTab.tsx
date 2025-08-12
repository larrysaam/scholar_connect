import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Star, MapPin, Filter, Users, Award, BookOpen, Eye, Loader2, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useResearchers, Researcher } from "@/hooks/useResearchers";

const FindResearcherTab = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedField, setSelectedField] = useState("all");
  const [selectedLanguage, setSelectedLanguage] = useState("all");
  const [priceRange, setPriceRange] = useState("all");
  const navigate = useNavigate();

  const {
    researchers,
    loading,
    error,
    searchResearchers,
    getFeaturedResearchers,
    getUniqueFields,
    getUniqueLanguages
  } = useResearchers();

  const featuredResearchers = useMemo(() => getFeaturedResearchers(), [researchers]);
  const uniqueFields = useMemo(() => getUniqueFields(), [researchers]);
  const uniqueLanguages = useMemo(() => getUniqueLanguages(), [researchers]);

  const filteredResearchers = useMemo(() => 
    searchResearchers(searchQuery, selectedField, selectedLanguage, priceRange),
    [researchers, searchQuery, selectedField, selectedLanguage, priceRange]
  );

  const ResearcherCard = ({ researcher }: { researcher: Researcher }) => (
    <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-500">
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <div className="relative">
            <img 
              src={researcher.imageUrl} 
              alt={researcher.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-blue-100"
            />
            {researcher.featured && (
              <div className="absolute -top-1 -right-1 bg-yellow-400 rounded-full p-1">
                <Award className="h-3 w-3 text-yellow-800" />
              </div>
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="font-semibold text-lg text-gray-900">{researcher.name}</h3>
                <p className="text-sm text-blue-600 font-medium">{researcher.title}</p>
                <p className="text-sm text-gray-500 flex items-center mt-1">
                  <BookOpen className="h-3 w-3 mr-1" />
                  {researcher.institution}
                </p>
              </div>
              {researcher.featured && (
                <Badge className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white border-0">
                  Featured
                </Badge>
              )}
            </div>
            
            <div className="flex items-center space-x-2 mb-3">
              <Badge variant="outline" className="border-blue-200 text-blue-700 bg-blue-50">
                {researcher.field}
              </Badge>
              <div className="flex items-center space-x-1">
                <MapPin className="h-3 w-3 text-gray-400" />
                <span className="text-xs text-gray-500">{researcher.location}</span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-1 mb-4">
              {researcher.specializations.map((spec, index) => (
                <Badge key={index} variant="secondary" className="text-xs bg-gray-100 text-gray-700">
                  {spec}
                </Badge>
              ))}
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-sm font-medium">{researcher.rating}</span>
                  <span className="text-sm text-gray-500">({researcher.reviewCount})</span>
                </div>
                <div className="text-sm font-bold text-green-600">
                  {researcher.hourlyRate.toLocaleString()} XAF/hr
                </div>
              </div>
              <Button 
                size="sm" 
                className="bg-blue-600 hover:bg-blue-700"
                onClick={() => navigate(`/researcher/${researcher.id}`)}
              >
                <Eye className="h-4 w-4 mr-1" />
                View Profile
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-100">
        <h2 className="text-2xl font-bold mb-2 text-gray-900">Find Expert Researchers</h2>
        <p className="text-gray-600">Connect with verified academic experts for personalized research guidance</p>
      </div>

      {/* Enhanced Search and Filters */}
      <Card className="border-blue-100 shadow-sm">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Search className="h-5 w-5 text-blue-500" />
              <Input
                placeholder="Search by name, topic, institution, or keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 border-blue-200 focus:border-blue-400"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Select value={selectedField} onValueChange={setSelectedField}>
                <SelectTrigger className="border-blue-200">
                  <SelectValue placeholder="Research Field" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Fields</SelectItem>
                  {uniqueFields.map((field) => (
                    <SelectItem key={field} value={field}>
                      {field}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                <SelectTrigger className="border-blue-200">
                  <SelectValue placeholder="Language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Languages</SelectItem>
                  {uniqueLanguages.map((language) => (
                    <SelectItem key={language} value={language.toLowerCase()}>
                      {language}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={priceRange} onValueChange={setPriceRange}>
                <SelectTrigger className="border-blue-200">
                  <SelectValue placeholder="Price Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any Price</SelectItem>
                  <SelectItem value="0-10000">0 - 10,000 XAF</SelectItem>
                  <SelectItem value="10000-15000">10,000 - 15,000 XAF</SelectItem>
                  <SelectItem value="15000+">15,000+ XAF</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50">
                <Filter className="h-4 w-4 mr-2" />
                Advanced Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="text-center border-blue-100">
          <CardContent className="p-4">
            <Users className="h-8 w-8 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{researchers.length}</div>
            <div className="text-sm text-gray-600">Expert Researchers</div>
          </CardContent>
        </Card>
        <Card className="text-center border-blue-100">
          <CardContent className="p-4">
            <BookOpen className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{uniqueFields.length}</div>
            <div className="text-sm text-gray-600">Research Fields</div>
          </CardContent>
        </Card>
        <Card className="text-center border-blue-100">
          <CardContent className="p-4">
            <Star className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">4.8</div>
            <div className="text-sm text-gray-600">Average Rating</div>
          </CardContent>
        </Card>
      </div>

      {/* Loading State */}
      {loading && (
        <Card>
          <CardContent className="p-12 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-500" />
            <p className="text-gray-600">Loading researchers...</p>
          </CardContent>
        </Card>
      )}

      {/* Error State */}
      {error && (
        <Card className="border-red-200">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3 text-red-600">
              <AlertCircle className="h-5 w-5" />
              <div>
                <h3 className="font-medium">Error Loading Researchers</h3>
                <p className="text-sm text-red-500">{error}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Featured Experts */}
      {!loading && !error && searchQuery === "" && selectedField === "all" && featuredResearchers.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            <Award className="h-5 w-5 text-yellow-500 mr-2" />
            Featured Experts
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {featuredResearchers.map((researcher) => (
              <ResearcherCard key={researcher.id} researcher={researcher} />
            ))}
          </div>
        </div>
      )}

      {/* Search Results */}
      {!loading && !error && (
        <div>
          <h3 className="text-xl font-semibold mb-4">
            {searchQuery || selectedField !== "all" ? "Search Results" : "All Researchers"} 
            <span className="text-gray-500 font-normal ml-2">({filteredResearchers.length} found)</span>
          </h3>
          
          {filteredResearchers.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No researchers found</h3>
                <p className="text-gray-600 mb-4">
                  {searchQuery || selectedField !== "all" || selectedLanguage !== "all" || priceRange !== "all"
                    ? "Try adjusting your search criteria or filters"
                    : "No researchers are currently available"
                  }
                </p>
                {(searchQuery || selectedField !== "all" || selectedLanguage !== "all" || priceRange !== "all") && (
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedField("all");
                      setSelectedLanguage("all");
                      setPriceRange("all");
                    }}
                  >
                    Clear Filters
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredResearchers.map((researcher) => (
                <ResearcherCard key={researcher.id} researcher={researcher} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FindResearcherTab;
