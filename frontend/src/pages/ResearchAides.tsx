import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackToDashboard from "@/components/BackToDashboard";
import SearchBar from "@/components/SearchBar";
import ResearchAidCard from "@/components/ResearchAidCard";
import NotificationCenter from "@/components/notifications/NotificationCenter";
import AdvancedSearchFilters from "@/components/search/AdvancedSearchFilters";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Filter, Bell, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
interface ResearchAid {
  id: string;
  name: string;
  title: string;
  specialization: string;
  skills: string[];
  hourlyRate: number;
  rating: number;
  reviews: number;
  imageUrl?: string;
  languages: string[];
  company: string;
  verifications: {
    academic: "verified" | "pending" | "unverified";
    publication: "verified" | "pending" | "unverified";
    institutional: "verified" | "pending" | "unverified";
  };
  jobsCompleted?: number;
}

const ResearchAides = () => {  const [researchAids, setResearchAids] = useState<ResearchAid[]>([]);
  const [filteredAids, setFilteredAids] = useState<ResearchAid[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    expertise: "all",
    rating: "all",
    priceRange: "all"
  });

  useEffect(() => {
    const fetchResearchAids = async () => {
      try {
        setLoading(true);
        setError(null);        // Get all research aids users
        const { data: users, error: userError } = await supabase
          .from('users')
          .select('id, name, expertise, languages, avatar_url')
          .eq('role', 'aid');
          
        if (userError) throw userError;

        // Get accepted jobs count for each aid
        const { data: acceptedJobs, error: acceptedJobsError } = await supabase
          .from('job_applications')
          .select('applicant_id')
          .eq('status', 'accepted')
          .in('applicant_id', users.map(u => u.id));
          

        if (acceptedJobsError) throw acceptedJobsError;

        // Count accepted jobs for each aid
        const acceptedJobsCount = (acceptedJobs || []).reduce((acc, job) => {
          acc[job.applicant_id] = (acc[job.applicant_id] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        // Get all profiles for those users
        const userIds = users.map((u: any) => u.id);
        const { data: profiles, error: profileError } = await supabase
          .from('research_aid_profiles')
          .select('id, title, location, hourly_rate, availability, admin_verified, rating, total_consultations_completed, verifications, skills')
          .in('id', userIds);

        if (profileError) throw profileError;

        // Create a map of id to profile for efficient lookup
        const profileMap = Object.fromEntries(
          profiles.map((p: any) => [p.id, p])
        );        // Map the data
        const mappedAids: ResearchAid[] = users.map((user: any) => {
          const profile = profileMap[user.id];
          const validTitle = profile?.title === 'Dr.' || profile?.title === 'Prof.' ? profile.title : '';
          return {
            id: user.id,
            name: validTitle ? `${validTitle} ${user.name || 'Unknown'}` : user.name || 'Unknown',
            title: profile?.title || 'Research Aid',
            specialization: profile?.skills?.[0] || user.expertise?.[0] || 'General Research',
            skills: profile?.skills || user.expertise || [],
            hourlyRate: profile?.hourly_rate || 0,
            rating: profile?.rating || 0,
            reviews: 0, // TODO: Implement reviews count
            imageUrl: user.avatar_url || "",
            languages: user.languages || [],
            company: profile?.location || 'Location not set',
            acceptedJobs: acceptedJobsCount[user.id] || 0,
            jobsCompleted: profile?.total_consultations_completed || 0,
            verifications: profile?.verifications || {
              academic: "unverified",
              publication: "unverified",
              institutional: "unverified"
            }
          };
        }); // Remove the hourly rate filter to show all aids

        setResearchAids(mappedAids);
      } catch (err: any) {
        console.error('Error fetching research aids:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchResearchAids();
  }, []);

  useEffect(() => {
    // Filter research aids based on search query and filters
    const filtered = researchAids.filter(aid => {
      // Search query filter
      const matchesSearch = !searchQuery || 
        aid.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        aid.specialization.toLowerCase().includes(searchQuery.toLowerCase()) ||
        aid.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        aid.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));

      // Expertise filter
      const matchesExpertise = filters.expertise === "all" ||
        aid.skills.some(skill => skill.toLowerCase().includes(filters.expertise.toLowerCase()));

      // Rating filter
      const matchesRating = filters.rating === "all" ||
        (filters.rating === "4+" && aid.rating >= 4) ||
        (filters.rating === "3+" && aid.rating >= 3);

      // Price range filter
      const matchesPriceRange = filters.priceRange === "all" ||
        (filters.priceRange === "0-5000" && aid.hourlyRate <= 5000) ||
        (filters.priceRange === "5000-10000" && aid.hourlyRate > 5000 && aid.hourlyRate <= 10000) ||
        (filters.priceRange === "10000+" && aid.hourlyRate > 10000);

      return matchesSearch && matchesExpertise && matchesRating && matchesPriceRange;
    });

    setFilteredAids(filtered);
  }, [searchQuery, filters, researchAids]);

  const handleFiltersChange = (filters: any) => {
    console.log("Filters changed:", filters);
    // TODO: Implement filter logic to filter researchAids based on the filters
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
        <main className="flex-grow bg-gray-50 py-12">
        <div className="container mx-auto px-4 md:px-6">
          <BackToDashboard />
          
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Find Research Aids</h1>
            <p className="text-gray-600">Connect with specialized research support professionals</p>
          </div>
            {/* Search and Filter Section */}
          <div className="mb-6">
            <SearchBar 
              value={searchQuery}
              onSearch={setSearchQuery}
              onFilterChange={(field, value) => {
                setFilters(prev => ({ ...prev, [field]: value }));
              }}
            />
          </div>
            {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                {error}
              </AlertDescription>
            </Alert>          ) : filteredAids.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-semibold">No Research Aids Found</h3>
              <p className="text-gray-600 mt-2">Try adjusting your search criteria</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAids.map((aid) => (
                <ResearchAidCard 
                  key={aid.id}
                  {...aid}
                  jobTitle={aid.title}
                  acceptedJobs={aid.jobsCompleted || 0}
                />
              ))}
            </div>
          )}
          
          
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ResearchAides;
