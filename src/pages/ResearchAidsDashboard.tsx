import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NDAModal from "@/components/dashboard/NDAModal";
import IntelligentChatAssistant from "@/components/ai/IntelligentChatAssistant";
import OnboardingCard from "@/components/dashboard/research-aids/OnboardingCard";
import QuickActionsCard from "@/components/dashboard/research-aids/QuickActionsCard";
import DashboardLayout from "@/components/dashboard/research-aids/DashboardLayout";
import DashboardTabRenderer from "@/components/dashboard/research-aids/DashboardTabRenderer";
import { NotificationService } from "@/services/notificationService";
import { useToast } from "@/hooks/use-toast";
import { useResearchAidDashboardData } from "@/hooks/useResearchAidDashboardData"; // New import
import { useAuth } from "@/hooks/useAuth"; // Keep useAuth for initial profile check

const ResearchAidsDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showNDA, setShowNDA] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { profile: authProfile } = useAuth(); // Use authProfile for initial checks

  // Use the new hook to fetch dashboard data
  const { userProfile, researchAidProfile, assignedConsultations, notifications, loading, error } = useResearchAidDashboardData();

  const getWelcomeMessage = () => {
    if (loading) return "Loading...";
    if (error) return "Welcome!"; // Fallback if data fetching fails
    if (!userProfile?.name) return "Welcome!";
    
    const nameParts = userProfile.name.split(' ');
    const lastName = nameParts[nameParts.length - 1];
    
    // Check for academic rank from researchAidProfile or userProfile if available
    const academicRank = researchAidProfile?.academic_rank || authProfile?.academic_rank; // Assuming academic_rank might be in researchAidProfile or authProfile
    const highestEducation = researchAidProfile?.highest_education || authProfile?.highest_education; // Assuming highest_education might be in researchAidProfile or authProfile

    if (academicRank && 
        (academicRank.includes('Professor') || 
         academicRank.includes('Prof'))) {
      return `Welcome, Prof. ${lastName}!`;
    }
    
    const hasPhD = highestEducation?.toLowerCase().includes('phd') ||
                   highestEducation?.toLowerCase().includes('postdoc');
    
    if (hasPhD) {
      return `Welcome, Dr. ${lastName}!`;
    }
    
    return `Welcome, ${lastName}!`;
  };

  useEffect(() => {
    // Only run onboarding/NDA checks if data is not loading and no error
    if (!loading && !error) {
      const hasCompletedOnboarding = localStorage.getItem('research_aids_onboarding_complete');
      const hasSignedNDA = localStorage.getItem('research_aids_nda_signed');
      
      if (!hasCompletedOnboarding) {
        setShowOnboarding(true);
      }
      
      if (!hasSignedNDA) {
        setShowNDA(true);
      }

      // Example: Create a welcome notification for new users
      if (userProfile?.id && !hasCompletedOnboarding) {
        NotificationService.notifyProfileIncomplete(userProfile.id);
      }
    }
  }, [loading, error, userProfile?.id, toast]); // Add dependencies

  const handleOnboardingComplete = () => {
    localStorage.setItem('research_aids_onboarding_complete', 'true');
    setShowOnboarding(false);
  };

  const handleNDAAccept = () => {
    localStorage.setItem('research_aids_nda_signed', 'true');
    localStorage.setItem('research_aids_nda_date', new Date().toISOString());
    setShowNDA(false);
  };

  const handleViewJobBoard = () => {
    setActiveTab("job-requests");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading dashboard data...</p> {/* Replace with a proper spinner */}
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        <p>Error loading dashboard: {error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-gray-50 py-12">
        <div className="container mx-auto px-4 md:px-6">
          <h1 className="text-3xl font-bold mb-2">{getWelcomeMessage()}</h1>
          <p className="text-gray-600 mb-8">Manage your jobs, clients, and earnings</p>
          
          {showOnboarding && (
            <OnboardingCard onComplete={handleOnboardingComplete} />
          )}

          <QuickActionsCard onViewJobBoard={handleViewJobBoard} />
          
          <DashboardLayout activeTab={activeTab} setActiveTab={setActiveTab}>
            <DashboardTabRenderer activeTab={activeTab} setActiveTab={setActiveTab} />
          </DashboardLayout>

         
        </div>
      </main>
      
      <IntelligentChatAssistant userType="research-aide" currentTab={activeTab} />
      
      <Footer />
      
      <NDAModal 
        isOpen={showNDA}
        onClose={() => {}}
        onAccept={handleNDAAccept}
      />
    </div>
  );
};

export default ResearchAidsDashboard;
