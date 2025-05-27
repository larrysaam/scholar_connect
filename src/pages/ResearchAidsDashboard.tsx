
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NDAModal from "@/components/dashboard/NDAModal";
import IntelligentChatAssistant from "@/components/ai/IntelligentChatAssistant";
import DashboardHeader from "@/components/dashboard/research-aids/DashboardHeader";
import OnboardingCard from "@/components/dashboard/research-aids/OnboardingCard";
import QuickActionsCard from "@/components/dashboard/research-aids/QuickActionsCard";
import DashboardLayout from "@/components/dashboard/research-aids/DashboardLayout";
import DashboardTabRenderer from "@/components/dashboard/research-aids/DashboardTabRenderer";
import { notificationService } from "@/services/notificationService";
import { useToast } from "@/hooks/use-toast";

const ResearchAidsDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showNDA, setShowNDA] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const hasCompletedOnboarding = localStorage.getItem('research_aids_onboarding_complete');
    const hasSignedNDA = localStorage.getItem('research_aids_nda_signed');
    
    if (!hasCompletedOnboarding) {
      setShowOnboarding(true);
    }
    
    if (!hasSignedNDA) {
      setShowNDA(true);
    }

    // Generate and show summary notification
    const summaryNotification = notificationService.generateSummaryNotification();
    if (summaryNotification.message !== "No new notifications at this time.") {
      toast({
        title: summaryNotification.title,
        description: summaryNotification.message,
      });
    }

    // Schedule weekly email summary
    const userEmail = "neba.emmanuel@example.com"; // This would come from user context
    notificationService.scheduleWeeklyEmail(userEmail);
  }, [toast]);

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
    navigate('/job-board');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-gray-50 py-12">
        <div className="container mx-auto px-4 md:px-6">
          <DashboardHeader onViewJobBoard={handleViewJobBoard} />
          
          {showOnboarding && (
            <OnboardingCard onComplete={handleOnboardingComplete} />
          )}

          <QuickActionsCard onViewJobBoard={handleViewJobBoard} />
          
          <DashboardLayout activeTab={activeTab} setActiveTab={setActiveTab}>
            <DashboardTabRenderer activeTab={activeTab} setActiveTab={setActiveTab} />
          </DashboardLayout>
        </div>
      </main>
      
      {/* AI Chat Assistant */}
      <IntelligentChatAssistant userType="research-aide" currentTab={activeTab} />
      
      <Footer />
      
      {/* NDA Modal */}
      <NDAModal 
        isOpen={showNDA}
        onClose={() => {}} // Don't allow closing without signing
        onAccept={handleNDAAccept}
      />
    </div>
  );
};

export default ResearchAidsDashboard;
