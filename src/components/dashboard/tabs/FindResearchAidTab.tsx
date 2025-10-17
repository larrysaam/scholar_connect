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
import { AlertTriangle, Users, Filter, ChevronDown, ChevronUp } from "lucide-react";
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
      <div className="space-y-6 animate-pulse">
        {/* Loading Header */}
        <div className="bg-gray-100 p-6 rounded-lg">
          <Skeleton className="h-8 w-64 bg-gray-200 rounded mb-2" />
          <Skeleton className="h-4 w-96 bg-gray-200 rounded" />
        </div>
        
        {/* Loading Search */}
        <div className="bg-white border p-6 rounded-lg space-y-4">
          <Skeleton className="h-6 w-48 bg-gray-200 rounded" />
          <Skeleton className="h-10 w-full bg-gray-200 rounded" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-10 bg-gray-200 rounded" />
            ))}
          </div>
        </div>
        
        {/* Loading Results */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white border p-6 rounded-lg space-y-4">
              <div className="flex items-start space-x-4">
                <Skeleton className="h-12 w-12 bg-gray-200 rounded-full flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-32 bg-gray-200 rounded" />
                  <Skeleton className="h-4 w-24 bg-gray-200 rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error Loading Research Aids</AlertTitle>
          <AlertDescription>
            {error}
          </AlertDescription>
        </Alert>
        
        <Card>
          <CardContent className="text-center py-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">What you can try:</h3>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => window.location.reload()}
                variant="outline"
              >
                Refresh Page
              </Button>
              <Button variant="outline">
                Contact Support
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Simple Header */}
      <div className="text-gray-800 p-6 rounded-lg" style={{ backgroundColor: '#edfdf4' }}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Find Research Aids</h1>
            <p className="text-gray-600">
              Connect with skilled research aids to help with specific tasks and projects
            </p>
          </div>
          <div className="mt-4 sm:mt-0 text-center sm:text-right">
            <div className="text-2xl font-bold">{researchAids.length}</div>
            <div className="text-gray-500 text-sm">Available</div>
          </div>
        </div>
      </div>

      {/* Simple Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Search & Filter</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="sm:hidden"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
              {showFilters ? <ChevronUp className="h-4 w-4 ml-2" /> : <ChevronDown className="h-4 w-4 ml-2" />}
            </Button>
          </div>
          
          <div className={`${showFilters ? 'block' : 'hidden'} sm:block`}>
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
          
          {/* Active filters summary for mobile */}
          {!showFilters && (searchQuery || selectedCategory !== "all" || priceRange !== "all") && (
            <div className="sm:hidden bg-gray-50 p-3 rounded border">
              <div className="flex items-center justify-between">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">Active filters:</span>
                  {searchQuery && (
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                      "{searchQuery.substring(0, 15)}{searchQuery.length > 15 ? '...' : ''}"
                    </span>
                  )}
                  {selectedCategory !== "all" && selectedCategory !== "All" && (
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                      {selectedCategory}
                    </span>
                  )}
                  {priceRange !== "all" && (
                    <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">
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
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Clear
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stats Cards */}
      {/* <StatsCards /> */}

      {/* Research Aids Results */}
      <div>
        {filteredAids.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredAids.map((aid) => (
              <ResearchAidCard key={aid.id} aid={aid} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-gray-900 mb-2">No Research Aids Found</h4>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                We couldn't find any research aids matching your search criteria. 
                Try adjusting your filters or search terms.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button 
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("all");
                    setPriceRange("all");
                  }}
                >
                  Clear Filters
                </Button>
                <Button onClick={() => window.location.reload()}>
                  Refresh Results
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default FindResearchAidTab;