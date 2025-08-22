import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import FindResearchAidHeader from "@/components/dashboard/research-aid/FindResearchAidHeader";
import SearchFilters from "@/components/dashboard/research-aid/SearchFilters";
import StatsCards from "@/components/dashboard/research-aid/StatsCards";
import ResearchAidCard from "@/components/dashboard/research-aid/ResearchAidCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

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
  payout_details?: any; // Or a more specific type
}

const FindResearchAidTab = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceRange, setPriceRange] = useState("all");
  const [researchAids, setResearchAids] = useState<ResearchAid[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Dummy categories, as the original was from mockData.
  // This could be fetched from the database if needed.
  const categories = ["All", "Data Analysis", "Literature Review", "Writing", "Methodology"];

  useEffect(() => {
    const fetchResearchAids = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .in('role', ['expert', 'aid']);

        if (error) throw error;

        // Map the data from the 'users' table to the 'ResearchAid' shape.
        // This mapping is a best guess and may need to be adjusted.
        const mappedAids: ResearchAid[] = data.map(user => ({
          id: user.id,
          name: user.name || 'No Name Provided',
          title: user.topic_title || 'Research Specialist',
          specializations: user.expertise || [],
          experience: user.experience || 'N/A',
          rating: 4.5, // Placeholder, as rating is not in the users table
          reviewCount: 10, // Placeholder
        }));

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
      <div className="space-y-6">
        <FindResearchAidHeader />
        <Skeleton className="h-24 w-full" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <FindResearchAidHeader />

      <SearchFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        priceRange={priceRange}
        setPriceRange={setPriceRange}
        categories={categories}
      />

      <StatsCards />

      <div>
        <h3 className="text-xl font-semibold mb-4">
          Available Research Aids
          <span className="text-gray-500 font-normal ml-2">({filteredAids.length} found)</span>
        </h3>
        {filteredAids.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredAids.map((aid) => (
              <ResearchAidCard key={aid.id} aid={aid} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 border-2 border-dashed rounded-lg">
            <h4 className="text-lg font-medium">No researchers found</h4>
            <p className="text-gray-500">Try adjusting your search filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FindResearchAidTab;