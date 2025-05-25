
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SearchBar from "@/components/SearchBar";
import ResearcherCard from "@/components/ResearcherCard";
import AIMatchingEngine from "@/components/ai/AIMatchingEngine";
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

// Mock data for researchers with verification status
const researchers = [
  {
    id: "1",
    name: "Dr. Angeline Nkomo",
    title: "Associate Professor",
    institution: "University of Yaoundé I",
    field: "Computer Science",
    specialties: ["Machine Learning", "AI Ethics", "Data Mining"],
    hourlyRate: 25000,
    rating: 4.9,
    reviews: 24,
    imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1376&q=80",
    verifications: {
      academic: "verified" as const,
      publication: "verified" as const,
      institutional: "verified" as const
    }
  },
  {
    id: "2",
    name: "Dr. Emmanuel Mbarga",
    title: "Professor",
    institution: "University of Douala",
    field: "Physics",
    specialties: ["Quantum Computing", "Theoretical Physics", "Astrophysics"],
    hourlyRate: 30000,
    rating: 4.8,
    reviews: 32,
    imageUrl: "https://images.unsplash.com/photo-1601582589907-f92af5ed9db8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1064&q=80",
    verifications: {
      academic: "verified" as const,
      publication: "pending" as const,
      institutional: "verified" as const
    }
  },
  {
    id: "3",
    name: "Dr. Solange Ebang",
    title: "Research Scientist",
    institution: "University of Buea",
    field: "Biology",
    specialties: ["Genetics", "Molecular Biology", "Biotechnology"],
    hourlyRate: 27000,
    rating: 4.7,
    reviews: 19,
    imageUrl: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
    verifications: {
      academic: "verified" as const,
      publication: "verified" as const,
      institutional: "pending" as const
    }
  },
  {
    id: "4",
    name: "Dr. Marcel Tchinda",
    title: "Distinguished Professor",
    institution: "University of Dschang",
    field: "Economics",
    specialties: ["Macroeconomics", "Economic Policy", "International Trade"],
    hourlyRate: 32000,
    rating: 4.9,
    reviews: 28,
    imageUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
    verifications: {
      academic: "pending" as const,
      publication: "verified" as const,
      institutional: "verified" as const
    }
  },
  {
    id: "5",
    name: "Dr. Fadimatou Bello",
    title: "Associate Professor",
    institution: "University of Ngaoundéré",
    field: "Psychology",
    specialties: ["Cognitive Psychology", "Neuropsychology", "Research Methods"],
    hourlyRate: 25000,
    rating: 4.6,
    reviews: 22,
    imageUrl: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
    verifications: {
      academic: "unverified" as const,
      publication: "pending" as const,
      institutional: "unverified" as const
    }
  },
  {
    id: "6",
    name: "Dr. Paul Messi",
    title: "Professor",
    institution: "Catholic University of Central Africa",
    field: "Medicine",
    specialties: ["Immunology", "Medical Research", "Clinical Trials"],
    hourlyRate: 35000,
    rating: 4.8,
    reviews: 36,
    imageUrl: "https://images.unsplash.com/photo-1622902046580-2b47f47f5471?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
    verifications: {
      academic: "verified" as const,
      publication: "verified" as const,
      institutional: "unverified" as const
    }
  }
];

const Researchers = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-gray-50 py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Find Researchers</h1>
            <p className="text-gray-600">Connect with leading academic experts for personalized consultations</p>
          </div>
          
          {/* Enhanced Search and Filter Section */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
            <div className="lg:col-span-3">
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
                    <AdvancedSearchFilters />
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
            
            <div className="lg:col-span-1">
              <AIMatchingEngine />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {researchers.map((researcher) => (
              <ResearcherCard key={researcher.id} {...researcher} />
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

export default Researchers;
