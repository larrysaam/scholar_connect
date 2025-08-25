import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
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

const ResearcherDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [showOnboarding, setShowOnboarding] = useState(false);

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
      case "discussion":
        return <DiscussionTab />;
      case "verification":
        return <VerificationTab />;
      case "notifications":
        return <NotificationsTab setActiveTab={setActiveTab} />;
      case "co-author-invitations":
        return <CoAuthorInvitationsTab />;
      case "documents":
        return <DocumentsTab />;
      case "profile":
        return <ProfileTab />;
      case "settings":
        return <SettingsTab />;
      default:
        return <WelcomeOverviewTab />;
    }
    
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-gray-50 py-12">
        <div className="container mx-auto px-4 md:px-6">
          <DashboardHeader userRole="researcher" />
          
          {showOnboarding && (
            <div className="mb-8">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-2">Welcome to ScholarConnect!</h3>
                  <p className="text-gray-600 mb-4">Complete your profile to start connecting with students.</p>
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
              <DashboardSidebar 
                activeTab={activeTab} 
                setActiveTab={setActiveTab} 
                userRole="researcher"
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
      
      <IntelligentChatAssistant userRole="researcher" currentTab={activeTab} />
      
      <Footer />
    </div>
  );
};

export default ResearcherDashboard;
