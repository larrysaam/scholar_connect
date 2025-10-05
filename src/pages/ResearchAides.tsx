
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
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

const ResearchAides = () => {
  const [researchAids, setResearchAids] = useState<ResearchAid[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);  const [showFilters, setShowFilters] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

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
        );

        // Map the data
        const mappedAids: ResearchAid[] = users.map((user: any) => {
          const profile = profileMap[user.id];
          return {
            id: user.id,
            name: user.name || 'Unknown',
            title: profile?.title || 'Research Aid',
            specialization: profile?.skills?.[0] || user.expertise?.[0] || 'General Research',
            skills: profile?.skills || user.expertise || [],            hourlyRate: profile?.hourly_rate || 0,
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
            }          };
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

  const handleFiltersChange = (filters: any) => {
    console.log("Filters changed:", filters);
    // TODO: Implement filter logic to filter researchAids based on the filters
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-gray-50 py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Find Research Aids</h1>
            <p className="text-gray-600">Connect with specialized research support professionals</p>
          </div>
          
          {/* Search and Filter Section */}
          <div className="mb-6">
            <SearchBar />
            <div className="flex justify-between items-center mt-4">
              <Dialog open={showFilters} onOpenChange={setShowFilters}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Filter className="h-4 w-4 mr-2" />
                    Advanced Filters
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                  <AdvancedSearchFilters onFiltersChange={handleFiltersChange} />
                </DialogContent>
              </Dialog>
              
              <Dialog open={showNotifications} onOpenChange={setShowNotifications}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Bell className="h-4 w-4 mr-2" />
                    Notifications
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <NotificationCenter />
                </DialogContent>
              </Dialog>
            </div>
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
            </Alert>
          ) : researchAids.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-semibold">No Research Aids Found</h3>
              <p className="text-gray-600 mt-2">Try adjusting your search criteria</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {researchAids.map((aid) => (
                <ResearchAidCard key={aid.id} {...aid} />
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
