
import { useState } from "react";
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
import { Filter, Bell } from "lucide-react";

// Mock data for research aids with verification status
const researchAids = [
  {
    id: "1",
    name: "Dr. Ngozi Amina",
    title: "GIS Specialist",
    specialization: "Geographic Information Systems",
    skills: ["ArcGIS", "QGIS", "Remote Sensing", "Spatial Analysis"],
    hourlyRate: 15000,
    rating: 4.8,
    reviews: 32,
    imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1376&q=80",
    languages: ["English", "French", "Fulfulde"],
    company: "MapTech Solutions Cameroon",
    verifications: {
      academic: "verified" as const,
      publication: "verified" as const,
      institutional: "verified" as const
    }
  },
  {
    id: "2", 
    name: "Emmanuel Talla",
    title: "Statistician",
    specialization: "Statistical Analysis",
    skills: ["SPSS", "R", "Python", "Survey Design", "Data Visualization"],
    hourlyRate: 12500,
    rating: 4.9,
    reviews: 28,
    imageUrl: "https://images.unsplash.com/photo-1601582589907-f92af5ed9db8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1064&q=80",
    languages: ["English", "French"],
    company: "DataCrunch Analytics",
    verifications: {
      academic: "verified" as const,
      publication: "pending" as const,
      institutional: "verified" as const
    }
  },
  {
    id: "3",
    name: "Marie Chantal Fokou",
    title: "Academic Editor",
    specialization: "Academic Publishing",
    skills: ["Copy Editing", "Proofreading", "LaTeX", "Citation Management"],
    hourlyRate: 10000,
    rating: 4.7,
    reviews: 45,
    imageUrl: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
    languages: ["English", "French", "German"],
    company: "Academic Excellence Services",
    verifications: {
      academic: "verified" as const,
      publication: "verified" as const,
      institutional: "pending" as const
    }
  },
  {
    id: "4",
    name: "Paul Biya Jr.",
    title: "Research Methodology Consultant", 
    specialization: "Research Design",
    skills: ["Qualitative Research", "Mixed Methods", "Survey Design", "Interview Techniques"],
    hourlyRate: 18000,
    rating: 4.6,
    reviews: 22,
    imageUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
    languages: ["English", "French"],
    company: "Research Hub Cameroon",
    verifications: {
      academic: "pending" as const,
      publication: "verified" as const,
      institutional: "verified" as const
    }
  }
];

const ResearchAides = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

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
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {researchAids.map((aid) => (
              <ResearchAidCard key={aid.id} {...aid} />
            ))}
          </div>
          
          <div className="mt-12">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious href="#" />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#" isActive>1</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">2</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">3</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext href="#" />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ResearchAides;
