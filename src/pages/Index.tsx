
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/Navbar";
import LoadingSpinner from "@/components/LoadingSpinner";
import SEOHead from "@/components/SEOHead";
import AccessibilityFeatures from "@/components/AccessibilityFeatures";
import ErrorBoundary from "@/components/ErrorBoundary";
import HeroSection from "@/components/home/HeroSection";
import JoinSection from "@/components/home/JoinSection";
import BenefitsSection from "@/components/home/BenefitsSection";
import HomeFooter from "@/components/home/HomeFooter";

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Add timeout for loading state to prevent infinite loading
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (loading) {
        console.log('Loading timeout reached, forcing render');
      }
    }, 5000); // 5 second timeout

    return () => clearTimeout(timeout);
  }, [loading]);

  // Only redirect authenticated users to dashboard on initial app load (not navigation)
  useEffect(() => {
    if (user && !loading && !isRedirecting) {
      const isFromNavigation = location.state?.fromNavigation;
      const isRootPath = location.pathname === '/';
      
      console.log('Navigation check:', { isFromNavigation, isRootPath, pathname: location.pathname });
      
      // Only redirect if user directly accessed root path AND it's not from navigation
      if (isRootPath && !isFromNavigation) {
        console.log('Redirecting authenticated user to dashboard');
        setIsRedirecting(true);
        navigate("/dashboard");
      }
    }
  }, [user, loading, navigate, isRedirecting, location.state, location.pathname]);

  // Show loading spinner while checking authentication (with timeout)
  if (loading && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Loading application...</p>
        </div>
      </div>
    );
  }

  // Show loading while redirecting
  if (isRedirecting) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  // Show homepage for both authenticated and unauthenticated users
  return (
    <ErrorBoundary>
      <div className="min-h-screen flex flex-col">
        <SEOHead />
        <AccessibilityFeatures />
        
        <Navbar />
        
        <main id="main-content" className="flex-grow">
          <HeroSection />
          <JoinSection />
          <BenefitsSection />
        </main>
        
        <HomeFooter />
      </div>
    </ErrorBoundary>
  );
};

export default Index;
