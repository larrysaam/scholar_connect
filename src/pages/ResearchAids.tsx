
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSection from "@/components/research-aids/HeroSection";
import ValuePropositions from "@/components/research-aids/ValuePropositions";
import HowItWorks from "@/components/research-aids/HowItWorks";
import ServiceTypes from "@/components/research-aids/ServiceTypes";
import SearchAndFilters from "@/components/research-aids/SearchAndFilters";
import QuickStats from "@/components/research-aids/QuickStats";
import ResearchAidsListing from "@/components/research-aids/ResearchAidsListing";
import Testimonials from "@/components/research-aids/Testimonials";
import FAQ from "@/components/research-aids/FAQ";
import CallToAction from "@/components/research-aids/CallToAction";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

const ResearchAids = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedField, setSelectedField] = useState("all");
  const [selectedLanguage, setSelectedLanguage] = useState("all");
  const [priceRange, setPriceRange] = useState("all");
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const researchAids = [
    {
      id: "1",
      name: "Sarah Johnson",
      title: "Statistical Analyst & Data Scientist",
      expertise: ["Data Analysis", "SPSS", "R Programming", "Statistical Modeling"],
      rating: 4.9,
      reviews: 45,
      hourlyRate: 12000,
      location: "South Africa",
      imageUrl: "/lovable-uploads/35d6300d-047f-404d-913c-ec65831f7973.png",
      featured: true,
      description: "Expert in statistical analysis with 8+ years of experience helping researchers with data interpretation and visualization."
    },
    {
      id: "2", 
      name: "Ahmed Hassan",
      title: "Academic Editor & Publisher",
      expertise: ["Academic Editing", "Publication Support", "Journal Submission", "Grant Writing"],
      rating: 4.8,
      reviews: 62,
      hourlyRate: 15000,
      location: "Egypt",
      imageUrl: "/lovable-uploads/35d6300d-047f-404d-913c-ec65831f7973.png",
      featured: true,
      description: "Professional academic editor with extensive experience in peer review and publication processes."
    },
    {
      id: "3",
      name: "Grace Okonkwo",
      title: "GIS Specialist & Field Data Collector",
      expertise: ["GIS Mapping", "Remote Sensing", "Field Data Collection", "Spatial Analysis"],
      rating: 4.7,
      reviews: 33,
      hourlyRate: 10000,
      location: "Nigeria",
      imageUrl: "/lovable-uploads/35d6300d-047f-404d-913c-ec65831f7973.png",
      featured: false,
      description: "Specialized in geographic information systems and environmental data collection across West Africa."
    },
    {
      id: "4",
      name: "Jean-Pierre Mukendi",
      title: "Research Assistant & Transcriber",
      expertise: ["Research Assistance", "Data Transcription", "Survey Design", "Qualitative Analysis"],
      rating: 4.6,
      reviews: 28,
      hourlyRate: 8000,
      location: "DR Congo",
      imageUrl: "/lovable-uploads/35d6300d-047f-404d-913c-ec65831f7973.png",
      featured: false,
      description: "Experienced research assistant fluent in French, English, and local languages."
    }
  ];

  const filteredAids = researchAids.filter(aid => {
    const matchesSearch = searchQuery === "" || 
      aid.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      aid.expertise.some(exp => exp.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesField = selectedField === "all" || aid.expertise.some(exp => exp.includes(selectedField));
    
    return matchesSearch && matchesField;
  });

  const handleBrowseAids = () => {
    const aidsSection = document.getElementById('research-aids-listing');
    if (aidsSection) {
      aidsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handlePostTask = () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to post a task.",
        variant: "destructive"
      });
      navigate('/auth');
      return;
    }
    navigate('/dashboard');
  };

  const handleBecomeResearchAid = () => {
    navigate('/research-aid-signup');
  };

  const handleViewProfile = (aidId: string) => {
    navigate(`/research-aid/${aidId}`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <HeroSection 
          onBrowseAids={handleBrowseAids}
          onPostTask={handlePostTask}
        />
        
        <ValuePropositions />
        
        <HowItWorks />
        
        <ServiceTypes />
        
        <SearchAndFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedField={selectedField}
          setSelectedField={setSelectedField}
          selectedLanguage={selectedLanguage}
          setSelectedLanguage={setSelectedLanguage}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
        />
        
        <QuickStats />
        
        <ResearchAidsListing
          filteredAids={filteredAids}
          onViewProfile={handleViewProfile}
        />
        
        <Testimonials />
        
        <FAQ />
        
        <CallToAction
          onBrowseAids={handleBrowseAids}
          onBecomeResearchAid={handleBecomeResearchAid}
        />
      </main>
      
      <Footer />
    </div>
  );
};

export default ResearchAids;
