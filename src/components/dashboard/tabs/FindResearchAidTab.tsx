import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import FindResearchAidHeader from "@/components/dashboard/research-aid/FindResearchAidHeader";
import SearchFilters from "@/components/dashboard/research-aid/SearchFilters";
import StatsCards from "@/components/dashboard/research-aid/StatsCards";
import ResearchAidCard from "@/components/dashboard/research-aid/ResearchAidCard";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, Users, Search, Filter, ChevronDown, ChevronUp, ArrowDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Assuming ResearchAidCard expects an 'aid' prop with this shape.
// This may need adjustment based on the actual props of ResearchAidCard.
export interface ResearchAid {
  id: string;
  name: string;
  title: string;
  specializations: string[];
  experience: string;
  rating: number;
  reviewCount: number;
  avatar_url?: string | null; // Add avatar_url for profile picture
  payout_details?: any; // Or a more specific type
  location?: string; // Add location
  hourly_rate?: number; // Add hourly_rate
  isAvailable?: boolean; // Add isAvailable
  admin_verified?: boolean; // Add admin verification status
}

const FindResearchAidTab = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceRange, setPriceRange] = useState("all");
  const [researchAids, setResearchAids] = useState<ResearchAid[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(true);
  const { toast } = useToast();

  // Dummy categories, as the original was from mockData.
  // This could be fetched from the database if needed.
  const categories = ["All", "Data Analysis", "Literature Review", "Writing", "Methodology"];

  useEffect(() => {
    const fetchResearchAids = async () => {
      setLoading(true);
      setError(null);
      try {
        // 1. Fetch all aids from users
        const { data: users, error: userError } = await supabase
          .from('users')
          .select('id, name, topic_title, expertise, experience, avatar_url')
          .in('role', ['aid']);
        if (userError) throw userError;

        // 2. Fetch all research_aid_profiles for those users
        const userIds = users.map((u: any) => u.id);
        // @ts-expect-error: Supabase type inference bug for .in()
        const { data: profiles, error: profileError } = await supabase
          .from('research_aid_profiles')
          .select('id, title, location, hourly_rate, availability, admin_verified')
          .in('id', userIds);
        if (profileError) throw profileError;

        // 3. Map id to profile
        const profileMap = Object.fromEntries(
          profiles.map((p: any) => [p.id, p])
        );

        // 4. Merge data and filter for available aids
        const mappedAids: ResearchAid[] = users.map((user: any) => {
          const profile = profileMap[user.id];
          return {
            id: user.id,
            // Show title in front of name, fallback to 'Research Specialist' if missing
            name: profile?.title ? `${profile.title} ${user.name || 'No Name Provided'}` : user.name || 'No Name Provided',
            title: profile?.title || 'Research Specialist',
            specializations: user.expertise || [],
            rating: 4.5, // Placeholder
            reviewCount: 10, // Placeholder
            avatar_url: user.avatar_url || null,
            location: profile?.location || 'Not set',
            hourly_rate: profile?.hourly_rate ?? 0,
            experience: user.experience || 'N/A',
            isAvailable: profile?.availability?.isAvailable ?? false,
            admin_verified: profile?.admin_verified ?? false,
          };
        }).filter(aid => aid.isAvailable);

        setResearchAids(mappedAids);
      } catch (err: any) {
        setError(err.message);
        console.error("Error fetching research aids:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchResearchAids();
  }, []);

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

  const filteredAids = researchAids.filter(aid => {
    const matchesSearch = searchQuery === "" ||
      aid.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      aid.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (aid.specializations && aid.specializations.some(spec => spec.toLowerCase().includes(searchQuery.toLowerCase())));

    const matchesCategory = selectedCategory === "all" || selectedCategory === "All" || aid.title.includes(selectedCategory);

    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="space-y-6 sm:space-y-8 max-w-full overflow-hidden animate-pulse">
        {/* Loading Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-br from-emerald-200 via-green-200 to-teal-200 p-6 sm:p-8 rounded-3xl">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="text-center sm:text-left mb-4 sm:mb-0 space-y-3">
              <Skeleton className="h-8 w-64 bg-white/30 rounded-full" />
              <Skeleton className="h-4 w-80 bg-white/20 rounded-full" />
            </div>
            <Skeleton className="h-16 w-24 bg-white/30 rounded-2xl mx-auto sm:mx-0" />
          </div>
        </div>
        
        {/* Loading Search Section */}
        <div className="bg-gradient-to-br from-gray-50 to-emerald-50/30 p-6 sm:p-8 rounded-2xl space-y-4">
          <Skeleton className="h-6 w-48 bg-emerald-200 rounded-full" />
          <Skeleton className="h-12 w-full bg-white/80 rounded-2xl" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-12 bg-white/60 rounded-xl" />
            ))}
          </div>
        </div>
        
        {/* Loading Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gradient-to-br from-gray-50 to-emerald-50/20 p-6 rounded-2xl space-y-4">
              <Skeleton className="h-16 w-16 bg-emerald-200 rounded-2xl mx-auto" />
              <Skeleton className="h-8 w-16 bg-emerald-200 rounded mx-auto" />
              <Skeleton className="h-4 w-24 bg-gray-300 rounded mx-auto" />
            </div>
          ))}
        </div>
        
        {/* Loading Results */}
        <div className="space-y-4">
          <Skeleton className="h-20 w-full bg-gradient-to-r from-gray-100 to-emerald-100/50 rounded-2xl" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-gradient-to-br from-gray-50 to-emerald-50/30 p-6 rounded-2xl space-y-4">
                <div className="flex items-start space-x-4">
                  <Skeleton className="h-16 w-16 bg-emerald-200 rounded-2xl flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-32 bg-gray-300 rounded" />
                    <Skeleton className="h-4 w-24 bg-emerald-200 rounded-full" />
                    <Skeleton className="h-3 w-40 bg-gray-200 rounded" />
                  </div>
                </div>
                <div className="flex space-x-2">
                  {[1, 2, 3].map((j) => (
                    <Skeleton key={j} className="h-6 w-16 bg-emerald-200/50 rounded-full" />
                  ))}
                </div>
                <div className="flex justify-between items-center">
                  <Skeleton className="h-8 w-20 bg-yellow-200 rounded-full" />
                  <div className="flex space-x-2">
                    <Skeleton className="h-8 w-16 bg-gray-300 rounded-lg" />
                    <Skeleton className="h-8 w-20 bg-emerald-200 rounded-lg" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6 sm:space-y-8 max-w-full overflow-hidden">
        {/* Error Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-br from-red-600 via-rose-600 to-pink-700 p-6 sm:p-8 rounded-3xl shadow-2xl">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10 text-center">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              Unable to Load Research Aids
            </h1>
            <p className="text-red-100 text-sm sm:text-base mb-6">
              We're experiencing technical difficulties. Please try again in a moment.
            </p>
            <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-2xl border border-white/30 inline-block">
              <p className="text-white text-sm font-medium">{error}</p>
            </div>
          </div>
        </div>
        
        {/* Error Actions */}
        <Card className="border-0 shadow-2xl bg-gradient-to-br from-white via-red-50/20 to-rose-50/30">
          <CardContent className="text-center py-12">
            <h3 className="text-xl font-bold text-gray-900 mb-4">What you can try:</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
              <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <span className="text-white font-bold">↻</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Refresh the page</h4>
                <Button 
                  onClick={() => window.location.reload()}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white w-full"
                >
                  Refresh Now
                </Button>
              </div>
              
              <div className="p-4 bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl border border-emerald-200">
                <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <span className="text-white font-bold">?</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Get support</h4>
                <Button 
                  variant="outline"
                  className="border-2 border-emerald-300 text-emerald-700 hover:bg-emerald-100 w-full"
                >
                  Contact Support
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 max-w-full overflow-hidden relative">
      {/* Background Pattern */}
      <div className="fixed inset-0 -z-10 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 via-green-600 to-teal-700"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill=%22%23059669%22 fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      {/* Enhanced Hero Section with Animation - Hidden on Mobile */}
      <div className=" relative overflow-hidden bg-gradient-to-br from-emerald-600 via-green-600 to-teal-700 p-6 sm:p-8 rounded-3xl shadow-2xl border border-emerald-500/20">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-800/20 via-transparent to-teal-800/20"></div>
        
        {/* Animated background elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <div className="absolute top-4 right-8 w-24 h-24 bg-white/10 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute bottom-6 left-8 w-20 h-20 bg-emerald-400/20 rounded-full blur-xl animate-bounce"></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-teal-400/15 rounded-full blur-lg animate-pulse delay-300"></div>
          <div className="absolute bottom-1/4 right-1/3 w-12 h-12 bg-green-400/20 rounded-full blur-md animate-bounce delay-700"></div>
        </div>
        
        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="text-center sm:text-left mb-6 sm:mb-0">
              <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-4">
                <div className="w-2 h-2 bg-emerald-300 rounded-full animate-pulse mr-2"></div>
                <span className="text-emerald-100 text-sm font-medium">Research Support Platform</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3 leading-tight">
                Find Expert
                <span className="block bg-gradient-to-r from-emerald-300 via-green-300 to-teal-300 bg-clip-text text-transparent">
                  Research Aids
                </span>
              </h1>
              <p className="text-emerald-100 text-sm sm:text-base lg:text-lg max-w-2xl leading-relaxed">
                Connect with qualified research aids, book consultations, and accelerate your academic journey with expert support
              </p>
            </div>
            <div className="flex flex-col items-center sm:items-end space-y-3">
              <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-2xl border border-white/30">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{researchAids.length}</div>
                  <div className="text-emerald-200 text-sm font-medium">Available Now</div>
                </div>
              </div>
              <div className="flex items-center space-x-2 bg-emerald-500/20 backdrop-blur-sm px-4 py-2 rounded-full">
                <div className="w-2 h-2 bg-emerald-300 rounded-full animate-ping"></div>
                <span className="text-emerald-200 text-xs font-medium">Live Updates</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Search and Filters */}
      <Card className="border-0 shadow-2xl bg-gradient-to-br from-white via-emerald-50/20 to-green-50/30 backdrop-blur-sm relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-transparent to-green-500/5"></div>
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500"></div>
        <CardContent className="p-6 sm:p-8 relative">
          {/* Header with Toggle Button for Mobile */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-green-600 rounded-xl flex items-center justify-center">
                <Search className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Search & Filter</h3>
                <p className="text-sm text-gray-600 hidden sm:block">Find the perfect research aid for your needs</p>
              </div>
            </div>
            
            {/* Mobile Toggle Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="sm:hidden bg-white/80 border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-300 transition-all duration-300"
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
            <SearchFilters
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              categories={categories}
            />
          </div>
          
          {/* Active Filters Summary for Mobile (when filters are hidden) */}
          {!showFilters && (searchQuery || selectedCategory !== "all" || priceRange !== "all") && (
            <div className="sm:hidden bg-gradient-to-r from-emerald-50 to-green-50 p-3 rounded-xl border border-emerald-200">
              <div className="flex items-center justify-between">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-semibold text-emerald-700">Active:</span>
                  {searchQuery && (
                    <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full text-xs">
                      Search: "{searchQuery.substring(0, 10)}{searchQuery.length > 10 ? '...' : ''}"
                    </span>
                  )}
                  {selectedCategory !== "all" && selectedCategory !== "All" && (
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                      {selectedCategory}
                    </span>
                  )}
                  {priceRange !== "all" && (
                    <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs">
                      {priceRange}
                    </span>
                  )}
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("all");
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

      {/* Stats Cards */}
      <StatsCards />

      {/* Research Aids Results */}
      <div className="min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 p-6 bg-gradient-to-r from-white via-emerald-50/30 to-green-50/30 rounded-2xl border border-emerald-200/50 shadow-lg">
          <div className="text-center sm:text-left mb-4 sm:mb-0">
            <h3 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-emerald-700 via-green-700 to-teal-700 bg-clip-text text-transparent mb-1">
              Available Research Aids
            </h3>
            <p className="text-gray-600 text-sm sm:text-base">
              {filteredAids.length === 0 
                ? "No results found with current filters" 
                : `Showing ${filteredAids.length} of ${researchAids.length} research aids`}
            </p>
          </div>
          <div className="flex items-center justify-center sm:justify-end space-x-4">
            <div className="bg-gradient-to-r from-emerald-100 to-green-100 px-4 py-2 rounded-full">
              <span className="text-emerald-700 text-sm font-semibold">{filteredAids.length} Results</span>
            </div>
            {filteredAids.length > 0 && (
              <div className="flex items-center space-x-2 bg-green-100 px-3 py-2 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-700 text-xs font-medium">Live</span>
              </div>
            )}
          </div>
        </div>
        
        {filteredAids.length > 0 ? (
          <div className="grid sm:grid-cols-2 grid-cols-1 gap-3 sm:gap-6">
            {filteredAids.map((aid, index) => (
              <div 
                key={aid.id}
                className="animate-in slide-in-from-bottom-4 fade-in-0"
                style={{ 
                  animationDelay: `${index * 100}ms`,
                  animationFillMode: 'both'
                }}
              >
                <ResearchAidCard aid={aid} />
              </div>
            ))}
          </div>
        ) : (
          <Card className="border-0 shadow-2xl bg-gradient-to-br from-white via-gray-50/50 to-emerald-50/30 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-transparent to-green-500/5"></div>
            <CardContent className="text-center py-16 sm:py-20 relative">
              <div className="relative mx-auto mb-8">
                <div className="w-24 h-24 bg-gradient-to-br from-emerald-100 via-green-100 to-teal-100 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                  <Users className="h-12 w-12 text-emerald-500" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-bounce">
                  <span className="text-white text-xs font-bold flex items-center justify-center w-full h-full">!</span>
                </div>
              </div>
              <h4 className="text-2xl font-bold text-gray-900 mb-3">No Research Aids Found</h4>
              <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
                We couldn't find any research aids matching your current search criteria. 
                Try adjusting your filters or search terms to discover more options.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button 
                  variant="outline" 
                  className="bg-gradient-to-r from-emerald-50 to-green-50 border-2 border-emerald-200 text-emerald-700 hover:bg-emerald-100 hover:border-emerald-300 px-6 py-3 rounded-xl font-semibold shadow-lg transition-all duration-200"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("all");
                    setPriceRange("all");
                  }}
                >
                  <Users className="h-4 w-4 mr-2" />
                  Clear All Filters
                </Button>
                <Button 
                  className="bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 hover:from-emerald-700 hover:via-green-700 hover:to-teal-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                  onClick={() => window.location.reload()}
                >
                  <Search className="h-4 w-4 mr-2" />
                  Refresh Results
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Scroll to Bottom Button */}
      {showScrollButton && (
        <div className="fixed bottom-6 right-6 z-50">
          <Button
            className="w-14 h-14 bg-white/20 hover:bg-white/30 backdrop-blur-md border-2 border-white/40 hover:border-white/60 text-emerald-600 hover:text-emerald-700 shadow-lg hover:shadow-xl rounded-full transition-all duration-300 hover:scale-110 active:scale-95 group"
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

export default FindResearchAidTab;