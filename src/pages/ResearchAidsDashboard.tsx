import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ResearchAidsSidebar from "@/components/dashboard/ResearchAidsSidebar";
import NDAModal from "@/components/dashboard/NDAModal";
import IntelligentChatAssistant from "@/components/ai/IntelligentChatAssistant";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import ResearchAidsOverview from "@/components/dashboard/tabs/ResearchAidsOverview";
import ResearchAidsJobRequests from "@/components/dashboard/tabs/ResearchAidsJobRequests";
import ResearchAidsMessages from "@/components/dashboard/tabs/ResearchAidsMessages";
import ResearchAidsAppointments from "@/components/dashboard/tabs/ResearchAidsAppointments";
import ResearchAidsFilesDeliverables from "@/components/dashboard/tabs/ResearchAidsFilesDeliverables";
import ResearchAidsPaymentsEarnings from "@/components/dashboard/tabs/ResearchAidsPaymentsEarnings";
import ResearchAidsProfileRatings from "@/components/dashboard/tabs/ResearchAidsProfileRatings";
import ResearchAidsSettings from "@/components/dashboard/tabs/ResearchAidsSettings";
import ResearchAidsPreviousWorks from "@/components/dashboard/tabs/ResearchAidsPreviousWorks";
import ResearchAidsNotifications from "@/components/dashboard/tabs/ResearchAidsNotifications";
import DiscussionTab from "@/components/dashboard/tabs/DiscussionTab";
import QualityAssuranceAndFeedbackTab from "@/components/dashboard/tabs/QualityAssuranceAndFeedbackTab";
import VerificationTab from "@/components/dashboard/tabs/VerificationTab";
import { notificationService } from "@/services/notificationService";
import { useToast } from "@/hooks/use-toast";

const ResearchAidsDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showNDA, setShowNDA] = useState(false);
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

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return <ResearchAidsOverview setActiveTab={setActiveTab} />;
      case "job-requests":
        return <ResearchAidsJobRequests />;
      case "messages":
        return <ResearchAidsMessages />;
      case "appointments":
        return <ResearchAidsAppointments />;
      case "files-deliverables":
        return <ResearchAidsFilesDeliverables />;
      case "payments-earnings":
        return <ResearchAidsPaymentsEarnings />;
      case "profile-ratings":
        return <ResearchAidsProfileRatings />;
      case "previous-works":
        return <ResearchAidsPreviousWorks />;
      case "notifications":
        return <ResearchAidsNotifications />;
      case "discussion":
        return <DiscussionTab />;
      case "quality-feedback":
        return <QualityAssuranceAndFeedbackTab />;
      case "verification":
        return <VerificationTab />;
      case "settings":
        return <ResearchAidsSettings />;
      default:
        return <ResearchAidsOverview setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-gray-50 py-12">
        <div className="container mx-auto px-4 md:px-6">
          <h1 className="text-3xl font-bold mb-2">Research Aids Dashboard</h1>
          <p className="text-gray-600 mb-8">Manage your jobs, clients, and earnings</p>
          
          {showOnboarding && (
            <div className="mb-8">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-2">Welcome to ScholarConnect!</h3>
                  <p className="text-gray-600 mb-4">Complete your profile to start receiving research assistance requests.</p>
                  <button 
                    onClick={handleOnboardingComplete}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    Get Started
                  </button>
                </CardContent>
              </Card>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-1">
              <ResearchAidsSidebar 
                activeTab={activeTab} 
                setActiveTab={setActiveTab}
              />
            </div>
            
            <div className="md:col-span-3">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsContent value={activeTab} className="mt-0">
                  {renderTabContent()}
                </TabsContent>
              </Tabs>
            </div>
          </div>
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
