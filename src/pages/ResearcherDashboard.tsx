import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ResponsiveDashboardSidebar from "@/components/dashboard/ResponsiveDashboardSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import IntelligentChatAssistant from "@/components/ai/IntelligentChatAssistant";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import WelcomeOverviewTab from "@/components/dashboard/tabs/WelcomeOverviewTab";
import UpcomingTab from "@/components/dashboard/tabs/UpcomingTab";
import PastTab from "@/components/dashboard/tabs/PastTab";
import PaymentsEarningsTab from "@/components/dashboard/tabs/PaymentsEarningsTab";
import ProfileTab from "@/components/dashboard/tabs/ProfileTab";
import DocumentsTab from "@/components/dashboard/tabs/DocumentsTab";
import SettingsTab from "@/components/dashboard/tabs/SettingsTab";
import QualityAssuranceAndFeedbackTab from "@/components/dashboard/tabs/QualityAssuranceAndFeedbackTab";
import CoAuthorInvitationsTab from "@/components/dashboard/tabs/CoAuthorInvitationsTab";
import VerificationTab from "@/components/dashboard/tabs/VerificationTab";
import NotificationsTab from "@/components/dashboard/tabs/NotificationsTab";
import DiscussionTab from "@/components/dashboard/tabs/DiscussionTab";
import ConsultationServicesTab from "@/components/dashboard/tabs/ConsultationServicesTab";
import PerformanceReputationTab from "@/components/dashboard/tabs/PerformanceReputationTab";
import FullThesisSupportTab from "@/components/dashboard/tabs/FullThesisSupportTab";
import MessagingTab from "@/components/dashboard/tabs/MessagingTab";
import MisconductReportModal from "@/components/dashboard/MisconductReportModal";

const ResearcherDashboard = () => {  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(() => searchParams.get("tab") || "overview");
  const [showOnboarding, setShowOnboarding] = useState(false);

  const handleTabChange = (tab: string) => {
    console.log("Researcher Dashboard tab change requested:", tab);
    setActiveTab(tab);
    // Update URL parameters to reflect the current tab
    setSearchParams({ tab });
  };

  useEffect(() => {
    const hasCompletedOnboarding = localStorage.getItem('researcher_onboarding_complete');
    if (!hasCompletedOnboarding) {
      setShowOnboarding(true);
    }
  }, []);

  const handleOnboardingComplete = () => {
    localStorage.setItem('researcher_onboarding_complete', 'true');
    setShowOnboarding(false);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return <WelcomeOverviewTab />;
      case "consultation-services":
        return <ConsultationServicesTab userRole="researcher" />;
      case "upcoming":
        return <UpcomingTab userRole="researcher" />;
      case "past":
        return <PastTab userRole="researcher" />;
      case "full-thesis-support":
        return <FullThesisSupportTab />;
      case "payments":
        return <PaymentsEarningsTab />;
      case "performance":
        return <PerformanceReputationTab />;
      case "quality":
        return <QualityAssuranceAndFeedbackTab />;
      case "messaging":
        return <MessagingTab />;
      case "verification":
        return <VerificationTab />;
      case "notifications":
        return <NotificationsTab setActiveTab={handleTabChange} />;
      case "co-author-invitations":
        return <CoAuthorInvitationsTab />;
      case "documents":
        return <DocumentsTab />;
  
      case "settings":
        return <SettingsTab />;
      default:
        return <WelcomeOverviewTab />;
    }
    
  };
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar
          activeTab={activeTab} 
          setActiveTab={handleTabChange}
      />
      
      <main className="flex-grow bg-gray-50 py-4 sm:py-6 md:py-12">
        <div className="container mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
          <DashboardHeader userRole="researcher" />
          
          {showOnboarding && (
            <div className="mb-4 sm:mb-6 md:mb-8">
              <Card>
                <CardContent className="p-4 sm:p-6">
                  <h3 className="text-base sm:text-lg font-semibold mb-2">Welcome to ScholarConnect!</h3>
                  <p className="text-sm sm:text-base text-gray-600 mb-4">Complete your profile to start connecting with students.</p>
                  <button 
                    onClick={handleOnboardingComplete}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full sm:w-auto text-sm sm:text-base"
                  >
                    Get Started
                  </button>
                </CardContent>
              </Card>
            </div>
          )}            <div className="flex flex-col lg:grid lg:grid-cols-4 gap-4 md:gap-6">
            {/* Responsive Sidebar - hidden on mobile, visible on tablet/desktop */}
            <div className="hidden lg:block lg:col-span-1">              
              <ResponsiveDashboardSidebar 
                activeTab={activeTab} 
                setActiveTab={handleTabChange}
                userRole="researcher"
                notificationCount={0}
              />
            </div>
            
            {/* Main Content - full width on mobile, 3/4 width on tablet/desktop */}
            <div className="w-full lg:col-span-3">
              <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 md:p-6">
                <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                  <TabsContent value={activeTab} className="mt-0">
                    <div className="min-h-[400px]">
                      {renderTabContent()}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <IntelligentChatAssistant userType="researcher" currentTab={activeTab} />
      
      <Footer />
    </div>
  );
};

export default ResearcherDashboard;
