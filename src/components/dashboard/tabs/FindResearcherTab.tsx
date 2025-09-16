import { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Star, MapPin, Filter, Users, Award, BookOpen, Eye, Loader2, AlertCircle, ChevronDown, ChevronUp, ArrowDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useResearchers, Researcher } from "@/hooks/useResearchers";

const FindResearcherTab = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedField, setSelectedField] = useState("all");
  const [selectedLanguage, setSelectedLanguage] = useState("all");
  const [priceRange, setPriceRange] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(true);
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

  // Handle scroll to show/hide button
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = window.innerHeight;
      
      // Hide button when near bottom (within 100px of bottom)
      const isNearBottom = scrollTop + clientHeight >= scrollHeight - 100;
      setShowScrollButton(!isNearBottom);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const ResearcherCard = ({ researcher }: { researcher: Researcher }) => {
    // Map title to prefix
    let displayTitle = researcher.title || '';
    let prefix = '';
    if (displayTitle === 'PhD Holder') prefix = 'Prof.';
    else if (displayTitle === 'Senior Research Officer') prefix = 'Dr.';
    else if (displayTitle) prefix = displayTitle;
    // Compose display name
    const displayName = prefix ? `${prefix} ${researcher.name}` : researcher.name;
    return (
      <Card className="group hover:shadow-xl hover:shadow-blue-100/50 transition-all duration-500 border-0 bg-gradient-to-br from-white to-blue-50/30 backdrop-blur-sm overflow-hidden relative">
        {/* Gradient border effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-lg p-[2px]">
          <div className="h-full w-full bg-white rounded-[6px]" />
        </div>
        
        <CardContent className="relative p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-start space-y-3 sm:space-y-0 sm:space-x-4">
            {/* Profile Image */}
            <div className="relative mx-auto sm:mx-0 flex-shrink-0">
              <div className="relative">
                <img 
                  src={researcher.imageUrl} 
                  alt={researcher.name}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-3 border-white shadow-lg group-hover:scale-105 transition-transform duration-300"
                />
                {researcher.featured && (
                  <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full p-2 shadow-lg animate-pulse">
                    <Award className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                  </div>
                )}
              </div>
              {/* Online status indicator */}
              <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-sm"></div>
            </div>
            
            {/* Content */}
            <div className="flex-1 min-w-0 text-center sm:text-left">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3">
                <div className="space-y-1">
                  <h3 className="font-bold text-lg sm:text-xl bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    {displayName}
                  </h3>
                  <p className="text-sm sm:text-base text-blue-600 font-semibold">{researcher.title}</p>
                  <div className="flex items-center justify-center sm:justify-start space-x-1 text-gray-600">
                    <BookOpen className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="text-xs sm:text-sm font-medium">{researcher.institution}</span>
                  </div>
                </div>
                {researcher.featured && (
                  <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0 shadow-md mt-2 sm:mt-0 mx-auto sm:mx-0 w-fit">
                    ⭐ Featured
                  </Badge>
                )}
              </div>
              
              {/* Field & Location */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-3">
                <Badge variant="outline" className="border-blue-300 text-blue-700 bg-blue-50/80 font-medium">
                  {researcher.field}
                </Badge>
                {researcher.admin_verified && (
                  <Badge className="bg-green-500 hover:bg-green-600 text-white border-0 shadow-sm">
                    ✓ Verified
                  </Badge>
                )}
                <div className="flex items-center space-x-1 text-gray-500">
                  <MapPin className="h-3 w-3" />
                  <span className="text-xs font-medium">{researcher.location}</span>
                </div>
              </div>
              
              {/* Specializations */}
              <div className="flex flex-wrap gap-1 mb-4 justify-center sm:justify-start">
                {researcher.specializations.slice(0, 3).map((spec, index) => (
                  <Badge key={index} variant="secondary" className="text-xs bg-gradient-to-r from-gray-100 to-gray-50 text-gray-700 border border-gray-200">
                    {spec}
                  </Badge>
                ))}
                {researcher.specializations.length > 3 && (
                  <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-600">
                    +{researcher.specializations.length - 3} more
                  </Badge>
                )}
              </div>
              
              {/* Stats & Action */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                <div className="flex items-center justify-center sm:justify-start space-x-4">
                  <div className="flex items-center space-x-1 bg-yellow-50 px-2 py-1 rounded-full">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-bold text-yellow-700">{researcher.rating}</span>
                    <span className="text-xs text-yellow-600">({researcher.reviewCount})</span>
                  </div>
                  <div className="text-sm font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                    {researcher.hourlyRate.toLocaleString()} XAF/hr
                  </div>
                </div>
                <Button 
                  size="sm" 
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300 w-full sm:w-auto"
                  onClick={() => navigate(`/researcher/${researcher.id}`)}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View Profile
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Modern Hero Section */}
      <div className=" relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 p-6 sm:p-8 rounded-2xl shadow-2xl">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="text-center sm:text-left mb-4 sm:mb-0">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">
                Find Expert Researchers
              </h1>
              <p className="text-blue-100 text-sm sm:text-base lg:text-lg">
                Connect with verified academic experts for personalized research guidance
              </p>
            </div>
            <div className="flex items-center justify-center sm:justify-end space-x-2">
              <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                <span className="text-white text-sm font-medium">{researchers.length} Experts</span>
              </div>
            </div>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-4 right-4 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-4 left-4 w-16 h-16 bg-yellow-400/20 rounded-full blur-lg"></div>
      </div>

      {/* Enhanced Search and Filters */}
      <Card className="border-0 shadow-xl bg-gradient-to-br from-white via-blue-50/20 to-indigo-50/30 backdrop-blur-sm relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-transparent to-indigo-500/5"></div>
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
        <CardContent className="p-6 sm:p-8 relative">
          {/* Header with Toggle Button for Mobile */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <Search className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Search & Filter</h3>
                <p className="text-sm text-gray-600 hidden sm:block">Find expert researchers for your project</p>
              </div>
            </div>
            
            {/* Mobile Toggle Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="sm:hidden bg-white/80 border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300 transition-all duration-300"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
              {showFilters ? (
                <ChevronUp className="h-4 w-4 ml-2" />
              ) : (
                <ChevronDown className="h-4 w-4 ml-2" />
              )}
            </Button>
          </div>
          
          {/* Search Filters - Hidden on Mobile by default, Always visible on Desktop */}
          <div className={`${showFilters ? 'block' : 'hidden'} sm:block transition-all duration-300`}>
            <div className="space-y-6">
              {/* Search Bar */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-blue-500" />
                </div>
                <Input
                  placeholder="Search by name, topic, institution, or keyword..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-3 text-base border-2 border-blue-100 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 rounded-xl transition-all duration-200"
                />
              </div>
              
              {/* Filter Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Select value={selectedField} onValueChange={setSelectedField}>
                  <SelectTrigger className="h-12 border-2 border-gray-200 hover:border-blue-300 transition-colors rounded-xl">
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
                  <SelectTrigger className="h-12 border-2 border-gray-200 hover:border-blue-300 transition-colors rounded-xl">
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
                  <SelectTrigger className="h-12 border-2 border-gray-200 hover:border-blue-300 transition-colors rounded-xl">
                    <SelectValue placeholder="Price Range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any Price</SelectItem>
                    <SelectItem value="0-10000">0 - 10,000 XAF</SelectItem>
                    <SelectItem value="10000-15000">10,000 - 15,000 XAF</SelectItem>
                    <SelectItem value="15000+">15,000+ XAF</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button 
                  variant="outline" 
                  className="h-12 border-2 border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 rounded-xl font-medium transition-all duration-200"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Advanced Filters
                </Button>
              </div>
            </div>
          </div>
          
          {/* Active Filters Summary for Mobile (when filters are hidden) */}
          {!showFilters && (searchQuery || selectedField !== "all" || selectedLanguage !== "all" || priceRange !== "all") && (
            <div className="sm:hidden bg-gradient-to-r from-blue-50 to-indigo-50 p-3 rounded-xl border border-blue-200">
              <div className="flex items-center justify-between">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-semibold text-blue-700">Active:</span>
                  {searchQuery && (
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                      Search: "{searchQuery.substring(0, 10)}{searchQuery.length > 10 ? '...' : ''}"
                    </span>
                  )}
                  {selectedField !== "all" && (
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
                      {selectedField}
                    </span>
                  )}
                  {selectedLanguage !== "all" && (
                    <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs">
                      {selectedLanguage}
                    </span>
                  )}
                  {priceRange !== "all" && (
                    <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-xs">
                      {priceRange}
                    </span>
                  )}
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedField("all");
                    setSelectedLanguage("all");
                    setPriceRange("all");
                  }}
                  className="text-xs text-gray-500 hover:text-gray-700 p-1 h-auto"
                >
                  Clear
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="hidden sm:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-blue-50 to-blue-100/50">
          <CardContent className="p-6 text-center">
            <div className="bg-blue-500 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
              <Users className="h-8 w-8 text-white" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{researchers.length}</div>
            <div className="text-sm text-gray-600 font-medium">Expert Researchers</div>
          </CardContent>
        </Card>
        <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-green-50 to-green-100/50">
          <CardContent className="p-6 text-center">
            <div className="bg-green-500 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
              <BookOpen className="h-8 w-8 text-white" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{uniqueFields.length}</div>
            <div className="text-sm text-gray-600 font-medium">Research Fields</div>
          </CardContent>
        </Card>
        <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-yellow-50 to-yellow-100/50 sm:col-span-2 lg:col-span-1">
          <CardContent className="p-6 text-center">
            <div className="bg-yellow-500 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
              <Star className="h-8 w-8 text-white" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">4.8</div>
            <div className="text-sm text-gray-600 font-medium">Average Rating</div>
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
          </h3>            <div className="grid sm:grid-cols-2  grid-cols-1 gap-3 sm:gap-6">
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
            <div className="grid sm:grid-cols-2 grid-cols-1 gap-3 sm:gap-6">
              {filteredResearchers.map((researcher) => (
                <ResearcherCard key={researcher.id} researcher={researcher} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Scroll to Bottom Button */}
      {showScrollButton && (
        <div className="fixed bottom-6 right-6 z-50">
          <Button
            className="w-14 h-14 bg-white/20 hover:bg-white/30 backdrop-blur-md border-2 border-white/40 hover:border-white/60 text-blue-600 hover:text-blue-700 shadow-lg hover:shadow-xl rounded-full transition-all duration-300 hover:scale-110 active:scale-95 group"
            onClick={() => {
              window.scrollTo({
                top: document.body.scrollHeight,
                behavior: 'smooth'
              });
            }}
          >
            <ArrowDown className="h-6 w-6 group-hover:scale-110 group-hover:translate-y-0.5 transition-all duration-200" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default FindResearcherTab;
