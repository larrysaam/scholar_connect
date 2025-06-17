
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import SearchBar from "@/components/SearchBar";
import ResearcherCard from "@/components/ResearcherCard";
import Footer from "@/components/Footer";
import Testimonials from "@/components/Testimonials";
import LanguageToggle from "@/components/LanguageToggle";
import SEOHead from "@/components/SEOHead";
import AccessibilityFeatures from "@/components/AccessibilityFeatures";
import ErrorBoundary from "@/components/ErrorBoundary";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

const featuredResearchers = [
  {
    id: "1",
    name: "Dr. Sarah Johnson",
    title: "Associate Professor",
    institution: "Stanford University",
    field: "Computer Science",
    specialties: ["Machine Learning", "AI Ethics", "Data Mining"],
    hourlyRate: 72000, // 120 USD * 600 XAF/USD
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
    name: "Dr. Michael Chen",
    title: "Professor",
    institution: "MIT",
    field: "Physics",
    specialties: ["Quantum Computing", "Theoretical Physics", "Astrophysics"],
    hourlyRate: 90000, // 150 USD * 600 XAF/USD
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
    name: "Dr. Emily Rodriguez",
    title: "Research Scientist",
    institution: "Harvard University",
    field: "Biology",
    specialties: ["Genetics", "Molecular Biology", "Biotechnology"],
    hourlyRate: 81000, // 135 USD * 600 XAF/USD
    rating: 4.7,
    reviews: 19,
    imageUrl: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
    verifications: {
      academic: "verified" as const,
      publication: "verified" as const,
      institutional: "pending" as const
    }
  }
];

const fields = [
  { name: "Computer Science", count: 48, icon: "💻" },
  { name: "Biology", count: 36, icon: "🧬" },
  { name: "Physics", count: 29, icon: "⚛️" },
  { name: "Psychology", count: 42, icon: "🧠" },
  { name: "Economics", count: 31, icon: "📊" },
  { name: "Medicine", count: 53, icon: "🩺" }
];

const Index = () => {
  const { t } = useLanguage();
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // If user is not authenticated, show sign-in/sign-up focused homepage
  if (!user) {
    return (
      <ErrorBoundary>
        <div className="min-h-screen flex flex-col">
          <SEOHead />
          <AccessibilityFeatures />
          
          <div className="absolute top-4 right-4 z-50">
            <LanguageToggle />
          </div>
          
          <Navbar />
          
          <main id="main-content" className="flex-grow">
            {/* Hero Section with Image Restored */}
            <section className="hero-gradient text-white py-20 lg:py-32 relative overflow-hidden">
              <div className="absolute right-0 top-0 h-full w-1/2 z-10">
                <div className="relative h-full w-full">
                  <img 
                    src="/lovable-uploads/327ccde5-c0c9-443a-acd7-4570799bb7f8.png" 
                    alt="Student consulting with researcher" 
                    className="h-full w-full object-cover object-center"
                    loading="eager"
                    style={{
                      filter: 'brightness(0.85) contrast(1.15) saturate(1.1)',
                      objectPosition: '25% center'
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-l from-blue-600/10 via-blue-600/30 to-blue-600/70"></div>
                </div>
              </div>
              
              <div className="container mx-auto px-4 md:px-6 relative z-20">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <div className="text-left">
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                      Connect with Research Experts Worldwide
                    </h1>
                    <p className="text-lg mb-8 text-blue-100 leading-relaxed">
                      Get personalized guidance for your research projects and accelerate your academic success.
                    </p>
                  </div>
                </div>
              </div>
            </section>
            
            {/* Call to action section for unauthenticated users */}
            <section className="py-16 bg-blue-50">
              <div className="container mx-auto px-4 md:px-6">
                <div className="max-w-4xl mx-auto text-center">
                  <h2 className="text-3xl md:text-4xl font-bold mb-6">
                    Join ResearchWhao Today
                  </h2>
                  <p className="text-xl text-gray-600 mb-8">
                    Connect with top researchers, get expert guidance, and accelerate your research journey.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                      <h3 className="font-semibold mb-2">For Students</h3>
                      <p className="text-gray-600 text-sm mb-4">Get expert help and guidance for your research projects</p>
                      <Button asChild className="w-full">
                        <Link to="/student-signup">Join as Student</Link>
                      </Button>
                    </div>
                    
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                      <h3 className="font-semibold mb-2">For Researchers</h3>
                      <p className="text-gray-600 text-sm mb-4">Share your expertise and earn additional income</p>
                      <Button asChild className="w-full">
                        <Link to="/researcher-signup">Join as Researcher</Link>
                      </Button>
                    </div>
                    
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                      <h3 className="font-semibold mb-2">For Research Aids</h3>
                      <p className="text-gray-600 text-sm mb-4">Provide professional research assistance</p>
                      <Button asChild className="w-full">
                        <Link to="/research-aid-signup">Join as Research Aid</Link>
                      </Button>
                    </div>
                  </div>
                  
                  <p className="text-gray-600">
                    Already have an account?{' '}
                    <Link to="/login" className="text-blue-600 hover:underline font-medium">
                      Sign In
                    </Link>
                  </p>
                </div>
              </div>
            </section>

            {/* New Why Should You Join ResearchWhao Section */}
            <section className="py-16 bg-white">
              <div className="container mx-auto px-4 md:px-6">
                <div className="max-w-6xl mx-auto">
                  <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                      Why Should You Join ResearchWhao?
                    </h2>
                    <p className="text-xl text-gray-600">
                      Discover the benefits of being part of our global research community
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <div className="text-center">
                      <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl">🎓</span>
                      </div>
                      <h3 className="text-xl font-semibold mb-3">Expert Guidance</h3>
                      <p className="text-gray-600">
                        Access world-class researchers and get personalized guidance for your academic journey
                      </p>
                    </div>
                    
                    <div className="text-center">
                      <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl">🌍</span>
                      </div>
                      <h3 className="text-xl font-semibold mb-3">Global Network</h3>
                      <p className="text-gray-600">
                        Connect with researchers and students from top universities worldwide
                      </p>
                    </div>
                    
                    <div className="text-center">
                      <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl">⚡</span>
                      </div>
                      <h3 className="text-xl font-semibold mb-3">Fast Results</h3>
                      <p className="text-gray-600">
                        Get quick responses and accelerate your research progress with expert insights
                      </p>
                    </div>
                    
                    <div className="text-center">
                      <div className="bg-yellow-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl">🛡️</span>
                      </div>
                      <h3 className="text-xl font-semibold mb-3">Verified Experts</h3>
                      <p className="text-gray-600">
                        All researchers are verified with academic credentials and proven track records
                      </p>
                    </div>
                    
                    <div className="text-center">
                      <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl">💡</span>
                      </div>
                      <h3 className="text-xl font-semibold mb-3">Innovative Tools</h3>
                      <p className="text-gray-600">
                        Access cutting-edge research tools and collaborative workspaces
                      </p>
                    </div>
                    
                    <div className="text-center">
                      <div className="bg-indigo-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl">🤝</span>
                      </div>
                      <h3 className="text-xl font-semibold mb-3">Collaborative Environment</h3>
                      <p className="text-gray-600">
                        Work together on research projects and build lasting academic relationships
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </main>
          
          {/* Footer with limited content for unauthenticated users */}
          <footer className="bg-gray-900 text-white py-12">
            <div className="container mx-auto px-4 md:px-6">
              <div className="max-w-4xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  <div>
                    <h3 className="font-semibold mb-4">About ResearchWhao</h3>
                    <p className="text-gray-400 text-sm">
                      Connecting researchers with students and research aids worldwide.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-4">Get Started</h3>
                    <ul className="space-y-2 text-sm">
                      <li><Link to="/login" className="text-gray-400 hover:text-white">Sign In</Link></li>
                      <li><Link to="/student-signup" className="text-gray-400 hover:text-white">Join as Student</Link></li>
                      <li><Link to="/researcher-signup" className="text-gray-400 hover:text-white">Join as Researcher</Link></li>
                      <li><Link to="/research-aid-signup" className="text-gray-400 hover:text-white">Join as Research Aid</Link></li>
                    </ul>
                  </div>
                </div>
                
                <div className="border-t border-gray-800 pt-8 text-center">
                  <p className="text-gray-400 text-sm">
                    © 2024 ResearchWhao. All rights reserved.
                  </p>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </ErrorBoundary>
    );
  }

  // If user is authenticated, show the full platform
  return (
    <ErrorBoundary>
      <div className="min-h-screen flex flex-col">
        <SEOHead />
        <AccessibilityFeatures />
        
        <div className="absolute top-4 right-4 z-50">
          <LanguageToggle />
        </div>
        
        <Navbar />
        
        <main id="main-content" className="flex-grow">
          <Hero />
          
          <section className="py-16 bg-gray-50" aria-label="Find experts">
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
          
          <section className="py-16" aria-label="Browse by field">
            <div className="container mx-auto px-4 md:px-6">
              <div className="max-w-3xl mx-auto text-center mb-12">
                <h2 className="text-2xl md:text-3xl font-semibold mb-4">Explore by Field</h2>
                <p className="text-gray-600">Browse experts across various academic disciplines</p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                {fields.map((field, index) => (
                  <Link 
                    key={index} 
                    to={`/researchers?field=${encodeURIComponent(field.name)}`} 
                    className="bg-white border rounded-lg p-6 text-center hover:shadow-md transition-shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label={`Browse ${field.name} experts - ${field.count} available`}
                  >
                    <div className="text-3xl mb-3" role="img" aria-label={field.name}>{field.icon}</div>
                    <h3 className="font-medium mb-1">{field.name}</h3>
                    <p className="text-sm text-gray-500">{field.count} experts</p>
                  </Link>
                ))}
              </div>
            </div>
          </section>
          
          <Testimonials />
        </main>
        
        <Footer />
      </div>
    </ErrorBoundary>
  );
};

export default Index;
