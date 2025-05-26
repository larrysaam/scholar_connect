
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import NotificationsBanner from "@/components/dashboard/NotificationsBanner";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import UpcomingTab from "@/components/dashboard/tabs/UpcomingTab";
import PastTab from "@/components/dashboard/tabs/PastTab";
import PaymentsTab from "@/components/dashboard/tabs/PaymentsTab";
import ProfileTab from "@/components/dashboard/tabs/ProfileTab";
import DocumentsTab from "@/components/dashboard/tabs/DocumentsTab";
import SettingsTab from "@/components/dashboard/tabs/SettingsTab";
import QualityAssuranceAndFeedbackTab from "@/components/dashboard/tabs/QualityAssuranceAndFeedbackTab";
import CoAuthorInvitationsTab from "@/components/dashboard/tabs/CoAuthorInvitationsTab";
import VerificationTab from "@/components/dashboard/tabs/VerificationTab";
import NotificationsTab from "@/components/dashboard/tabs/NotificationsTab";
import DiscussionTab from "@/components/dashboard/tabs/DiscussionTab";
import MisconductReportModal from "@/components/dashboard/MisconductReportModal";

const ResearcherDashboard = () => {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Check if user needs onboarding (simulate with localStorage)
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
      case "upcoming":
        return <UpcomingTab />;
      case "past":
        return <PastTab />;
      case "payments":
        return <PaymentsTab />;
      case "quality":
        return <QualityAssuranceAndFeedbackTab />;
      case "discussion":
        return <DiscussionTab />;
      case "verification":
        return <VerificationTab />;
      case "notifications":
        return <NotificationsTab />;
      case "co-author-invitations":
        return <CoAuthorInvitationsTab />;
      case "profile":
        return <ProfileTab />;
      case "documents":
        return <DocumentsTab />;
      case "settings":
        return <SettingsTab />;
      default:
        return <UpcomingTab />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-gray-50 py-12">
        <div className="container mx-auto px-4 md:px-6">
          <h1 className="text-3xl font-bold mb-2">Researcher Dashboard</h1>
          <p className="text-gray-600 mb-8">Manage your consultations and account</p>
          
          {/* Show onboarding for new users */}
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
            {/* Sidebar */}
            <div className="md:col-span-1">
              <DashboardSidebar 
                activeTab={activeTab} 
                setActiveTab={setActiveTab} 
                userType="researcher"
              />
            </div>
            
            {/* Main content */}
            <div className="md:col-span-3">
              {/* Notifications Banner - appears on all tabs */}
              <NotificationsBanner />
              
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsContent value={activeTab} className="mt-0">
                  {renderTabContent()}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ResearcherDashboard;
