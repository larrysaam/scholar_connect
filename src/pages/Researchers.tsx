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

// Mock data for researchers
const researchers = [
  {
    id: "1",
    name: "Dr. Sarah Johnson",
    title: "Associate Professor",
    institution: "Stanford University",
    field: "Computer Science",
    specialties: ["Machine Learning", "AI Ethics", "Data Mining"],
    hourlyRate: 120,
    rating: 4.9,
    reviews: 24,
    imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1376&q=80"
  },
  {
    id: "2",
    name: "Dr. Michael Chen",
    title: "Professor",
    institution: "MIT",
    field: "Physics",
    specialties: ["Quantum Computing", "Theoretical Physics", "Astrophysics"],
    hourlyRate: 150,
    rating: 4.8,
    reviews: 32,
    imageUrl: "https://images.unsplash.com/photo-1601582589907-f92af5ed9db8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1064&q=80"
  },
  {
    id: "3",
    name: "Dr. Emily Rodriguez",
    title: "Research Scientist",
    institution: "Harvard University",
    field: "Biology",
    specialties: ["Genetics", "Molecular Biology", "Biotechnology"],
    hourlyRate: 135,
    rating: 4.7,
    reviews: 19,
    imageUrl: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80"
  },
  {
    id: "4",
    name: "Dr. James Wilson",
    title: "Distinguished Professor",
    institution: "UC Berkeley",
    field: "Economics",
    specialties: ["Macroeconomics", "Economic Policy", "International Trade"],
    hourlyRate: 160,
    rating: 4.9,
    reviews: 28,
    imageUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80"
  },
  {
    id: "5",
    name: "Dr. Amira Khan",
    title: "Associate Professor",
    institution: "University of Chicago",
    field: "Psychology",
    specialties: ["Cognitive Psychology", "Neuropsychology", "Research Methods"],
    hourlyRate: 125,
    rating: 4.6,
    reviews: 22,
    imageUrl: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80"
  },
  {
    id: "6",
    name: "Dr. Robert Nguyen",
    title: "Professor",
    institution: "Johns Hopkins University",
    field: "Medicine",
    specialties: ["Immunology", "Medical Research", "Clinical Trials"],
    hourlyRate: 175,
    rating: 4.8,
    reviews: 36,
    imageUrl: "https://images.unsplash.com/photo-1622902046580-2b47f47f5471?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80"
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
