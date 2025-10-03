import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SearchBar from "@/components/SearchBar";
import ResearcherCard from "@/components/ResearcherCard";
import NotificationCenter from "@/components/notifications/NotificationCenter";
import AdvancedSearchFilters from "@/components/search/AdvancedSearchFilters";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious,
  PaginationEllipsis
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Filter, Bell } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface ResearcherFilters {
  availability?: string[];
  rating?: number[];
  expertise?: string;
  field?: string;
  specialty?: string[];
  priceRange?: {
    min: number;
    max: number;
  };
}

interface Researcher {
  id: string;
  name: string;
  email: string;
  title: string;
  institution: string;
  field: string;
  department: string;
  specialties: string[];
  researchInterests: string[];
  hourlyRate: number;
  rating: number;
  reviews: number;
  studentsSupervised: number;
  onlineStatus: string;
  bio: string;
  imageUrl: string;
  verifications: {
    academic: 'verified' | 'pending' | 'unverified';
    publication: 'verified' | 'pending' | 'unverified';
    institutional: 'verified' | 'pending' | 'unverified';
  };
}

const ITEMS_PER_PAGE = 9; // Show 9 researchers per page for a 3x3 grid

const Researchers = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [researchers, setResearchers] = useState<Researcher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ResearcherFilters>({
    availability: [],
    rating: [0],
    expertise: '',
    specialty: [],
    priceRange: { min: 0, max: 100000 }
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const fetchResearchers = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all expert users with profiles
      const { data: allData, error: fetchError } = await supabase
        .from('users')
        .select(`
          id,
          name,
          email,
          institution,
          avatar_url,
          researcher_profiles:researcher_profiles_user_id_fkey(
            title,
            department,
            hourly_rate,
            rating,
            total_reviews,
            online_status,
            profile_visibility,
            verifications,
            specialties,
            research_interests,
            bio
          )
        `)
        .eq('role', 'expert');      if (fetchError) throw fetchError;

      // List all researchers (no profile_visibility filter)
      setTotalCount((allData || []).length);
      
      // Get researcher IDs for consultation counts
      const researcherIds = (allData || []).map(r => r.id);
      console.log('Total researchers found:', researcherIds.length);
      
      // Fetch consultation counts for all researchers
      const { data: consultationCounts, error: consultationError } = await supabase
        .from('service_bookings')
        .select('provider_id, client_id')
        .in('provider_id', researcherIds)
        .in('status', ['confirmed', 'completed']);

      if (consultationError) {
        console.error('Error fetching consultation counts:', consultationError);
      }

      console.log('Total consultation records:', consultationCounts?.length || 0);

      // Calculate unique students supervised per researcher
      const studentsSupervisionMap = new Map<string, Set<string>>();
      (consultationCounts || []).forEach(booking => {
        if (!studentsSupervisionMap.has(booking.provider_id)) {
          studentsSupervisionMap.set(booking.provider_id, new Set());
        }
        studentsSupervisionMap.get(booking.provider_id)?.add(booking.client_id);
      });      // Debug: Log supervision counts
      console.log('--- Supervision Summary ---');
      studentsSupervisionMap.forEach((students, providerId) => {
        const researcher = (allData || []).find(r => r.id === providerId);
        const researcherName = researcher?.name || 'Unknown';
        console.log(`${researcherName} (${providerId}): ${students.size} unique students`);
      });

      const totalUniqueStudents = new Set<string>();
      studentsSupervisionMap.forEach((students) => {
        students.forEach(studentId => totalUniqueStudents.add(studentId));
      });
      console.log(`Total unique students across platform: ${totalUniqueStudents.size}`);

      // Map the raw data to our researcher format
      const mappedData = (allData || []).map((r: any) => {
        const profile = r.researcher_profiles;
        const defaultVerifications = {
          academic: 'pending',
          publication: 'pending',
          institutional: 'pending'
        } as const;        const studentsSupervised = studentsSupervisionMap.get(r.id)?.size || 0;
        
        return {
          id: r.id,
          name: r.name || '',
          email: r.email || '',
          title: profile?.title || '',
          institution: r.institution || '',
          field: profile?.department || '',
          department: profile?.department || '',
          specialties: Array.isArray(profile?.specialties) ? profile.specialties : [],
          researchInterests: Array.isArray(profile?.research_interests) ? profile.research_interests : [],
          hourlyRate: typeof profile?.hourly_rate === 'number' ? profile.hourly_rate : 0,
          rating: typeof profile?.rating === 'number' ? profile.rating : 0,
          reviews: typeof profile?.total_reviews === 'number' ? profile.total_reviews : 0,
          studentsSupervised,
          onlineStatus: profile?.online_status || 'offline',
          bio: profile?.bio || '',
          imageUrl: r.avatar_url || '/default-avatar.png',
          verifications: {
            ...defaultVerifications,
            ...(profile?.verification_status || {})
          }
        };
      });

      // Apply search filter
      let filteredData = mappedData;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filteredData = filteredData.filter(r => 
          r.name.toLowerCase().includes(query) ||
          r.title.toLowerCase().includes(query) ||
          r.institution.toLowerCase().includes(query) ||
          r.department.toLowerCase().includes(query) ||
          r.specialties.some(s => s.toLowerCase().includes(query)) ||
          r.researchInterests.some(i => i.toLowerCase().includes(query))
        );
      }      // Paginate in JS
      const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
      const endIndex = startIndex + ITEMS_PER_PAGE;
      const paginatedResearchers = filteredData.slice(startIndex, endIndex);
      
      // Debug: Show what's being passed to UI
      console.log('--- Researchers Being Displayed on Current Page ---');
      paginatedResearchers.forEach(researcher => {
        console.log(`UI Display: ${researcher.name} - ${researcher.studentsSupervised} students supervised`);
      });
      
      setResearchers(paginatedResearchers);
      setTotalCount(filteredData.length);
    } catch (error: any) {
      console.error('Error fetching researchers:', error);
      setError(error.message || 'Failed to load researchers');
      setResearchers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResearchers();
  }, [filters, searchQuery, currentPage]);

  const handleFiltersChange = (newFilters: ResearcherFilters) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      ...newFilters
    }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page when search changes
  };

  const totalPages = Math.max(1, Math.ceil(totalCount / ITEMS_PER_PAGE));

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow bg-gray-50 py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Find Researchers</h1>
            <p className="text-gray-600">Connect with leading academic experts for personalized consultations</p>
          </div>
          
          {/* Search Section */}
          <div className="mb-6">
            <SearchBar onSearch={handleSearch} />
            <div className="flex justify-between items-center mt-4">
              <Dialog open={showFilters} onOpenChange={setShowFilters}>
            
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                  <AdvancedSearchFilters onFiltersChange={handleFiltersChange} />
                </DialogContent>
              </Dialog>
              
              <Dialog open={showNotifications} onOpenChange={setShowNotifications}>
                <DialogTrigger asChild>
                  
                </DialogTrigger>
                <DialogContent>
                  <NotificationCenter />
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-4 text-gray-500">Loading researchers...</span>
            </div>
          ) : error ? (
            <div className="text-center text-red-500 py-12">{error}</div>
          ) : (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {researchers.length === 0 ? (
                  <div className="col-span-3 text-center text-gray-500 py-12">
                    No researchers found matching your criteria.
                  </div>
                ) : (
                  researchers.map((researcher) => (
                    <ResearcherCard key={researcher.id} {...researcher} />
                  ))
                )}
              </div>

              {/* Pagination UI */}
              {researchers.length > 0 && (
                <div className="mt-12">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                          className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'} 
                        />
                      </PaginationItem>

                      {/* First page */}
                      <PaginationItem>
                        <PaginationLink 
                          onClick={() => setCurrentPage(1)}
                          isActive={currentPage === 1}
                          className="cursor-pointer"
                        >
                          1
                        </PaginationLink>
                      </PaginationItem>

                      {/* Show ellipsis if there are many pages */}
                      {currentPage > 3 && (
                        <PaginationItem>
                          <PaginationEllipsis />
                        </PaginationItem>
                      )}

                      {/* Show current page and surrounding pages */}
                      {currentPage > 2 && currentPage < totalPages && (
                        <PaginationItem>
                          <PaginationLink 
                            onClick={() => setCurrentPage(currentPage)}
                            isActive={true}
                            className="cursor-pointer"
                          >
                            {currentPage}
                          </PaginationLink>
                        </PaginationItem>
                      )}

                      {/* Show ellipsis before last page */}
                      {currentPage < totalPages - 2 && (
                        <PaginationItem>
                          <PaginationEllipsis />
                        </PaginationItem>
                      )}

                      {/* Last page */}
                      {totalPages > 1 && (
                        <PaginationItem>
                          <PaginationLink 
                            onClick={() => setCurrentPage(totalPages)}
                            isActive={currentPage === totalPages}
                            className="cursor-pointer"
                          >
                            {totalPages}
                          </PaginationLink>
                        </PaginationItem>
                      )}

                      <PaginationItem>
                        <PaginationNext 
                          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                          className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'} 
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>

                  {/* Show total results */}
                  <div className="text-center mt-4 text-sm text-gray-600">
                    Showing {Math.min(ITEMS_PER_PAGE * (currentPage - 1) + 1, totalCount)} to {Math.min(ITEMS_PER_PAGE * currentPage, totalCount)} of {totalCount} researchers
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Researchers;
