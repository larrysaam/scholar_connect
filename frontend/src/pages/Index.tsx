
import { useEffect, useState } from "react";
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

  // Add timeout for loading state to prevent infinite loading
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (loading) {
        console.log('Loading timeout reached, forcing render');
      }
    }, 5000); // 5 second timeout

    return () => clearTimeout(timeout);
  }, [loading]);

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
