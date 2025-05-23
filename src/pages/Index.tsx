
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import SearchBar from "@/components/SearchBar";
import ResearcherCard from "@/components/ResearcherCard";
import Footer from "@/components/Footer";
import Testimonials from "@/components/Testimonials";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

// Mock data for featured researchers
const featuredResearchers = [
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
  }
];

// Mock data for field categories
const fields = [
  { name: "Computer Science", count: 48, icon: "💻" },
  { name: "Biology", count: 36, icon: "🧬" },
  { name: "Physics", count: 29, icon: "⚛️" },
  { name: "Psychology", count: 42, icon: "🧠" },
  { name: "Economics", count: 31, icon: "📊" },
  { name: "Medicine", count: 53, icon: "🩺" }
];

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <Hero />
        
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-semibold text-center mb-6">Find Your Expert</h2>
              <SearchBar />
            </div>
            
            <div className="mt-16">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl md:text-3xl font-semibold">Featured Researchers</h2>
                <Button asChild variant="outline">
                  <Link to="/researchers">View All</Link>
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredResearchers.map((researcher) => (
                  <ResearcherCard key={researcher.id} {...researcher} />
                ))}
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-16">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-semibold mb-4">Explore by Field</h2>
              <p className="text-gray-600">Browse experts across various academic disciplines</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {fields.map((field, index) => (
                <Link 
                  key={index} 
                  to={`/researchers?field=${field.name}`} 
                  className="bg-white border rounded-lg p-6 text-center hover:shadow-md transition-shadow"
                >
                  <div className="text-3xl mb-3">{field.icon}</div>
                  <h3 className="font-medium mb-1">{field.name}</h3>
                  <p className="text-sm text-gray-500">{field.count} experts</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
        
        <section className="py-16 bg-blue-50">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl md:text-3xl font-semibold mb-4">How It Works</h2>
              <p className="text-gray-600 mb-12">Connect with top researchers in just a few steps</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-4 text-xl font-semibold">1</div>
                  <h3 className="font-semibold mb-2">Search</h3>
                  <p className="text-gray-600 text-sm">Find researchers by field, expertise, or institution</p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-4 text-xl font-semibold">2</div>
                  <h3 className="font-semibold mb-2">Book</h3>
                  <p className="text-gray-600 text-sm">Schedule a consultation at your preferred time</p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-4 text-xl font-semibold">3</div>
                  <h3 className="font-semibold mb-2">Connect</h3>
                  <p className="text-gray-600 text-sm">Meet virtually and get expert guidance for your research</p>
                </div>
              </div>
              
              <Button asChild className="mt-12">
                <Link to="/how-it-works">Learn More</Link>
              </Button>
            </div>
          </div>
        </section>
        
        {/* Testimonials section - added as requested */}
        <Testimonials />
        
        <section className="py-16">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-4xl mx-auto bg-blue-600 rounded-xl text-white p-8 md:p-12 text-center">
              <h2 className="text-2xl md:text-3xl font-semibold mb-4">Are You a Researcher?</h2>
              <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
                Join our platform to share your expertise, connect with students, and earn additional income through consultations.
              </p>
              <Button asChild size="lg" className="bg-white text-blue-700 hover:bg-blue-50">
                <Link to="/register">Join as a Researcher</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
