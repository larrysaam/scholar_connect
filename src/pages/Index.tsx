
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/Navbar";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageToggle from "@/components/LanguageToggle";
import SEOHead from "@/components/SEOHead";
import AccessibilityFeatures from "@/components/AccessibilityFeatures";
import ErrorBoundary from "@/components/ErrorBoundary";

const Index = () => {
  const { t } = useLanguage();
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (user && !loading) {
      navigate("/dashboard");
    }
  }, [user, loading, navigate]);

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Show homepage for unauthenticated users
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
          {/* Hero Section */}
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
          
          {/* Join ResearchWhao Today Section */}
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

          {/* Why Should You Join ResearchWhao Section */}
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
        
        {/* Footer */}
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
};

export default Index;
