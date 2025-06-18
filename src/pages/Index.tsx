
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
