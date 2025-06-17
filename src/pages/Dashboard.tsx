
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardContent from "@/components/dashboard/DashboardContent";
import NotificationsBanner from "@/components/dashboard/NotificationsBanner";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import StudentUpcomingTab from "@/components/dashboard/tabs/StudentUpcomingTab";
import StudentPastTab from "@/components/dashboard/tabs/StudentPastTab";
import StudentWelcomeOverviewTab from "@/components/dashboard/tabs/StudentWelcomeOverviewTab";
import StudentPerformanceTab from "@/components/dashboard/tabs/StudentPerformanceTab";
import FindResearcherTab from "@/components/dashboard/tabs/FindResearcherTab";
import PaymentsTab from "@/components/dashboard/tabs/PaymentsTab";
import DocumentsTab from "@/components/dashboard/tabs/DocumentsTab";
import SettingsTab from "@/components/dashboard/tabs/SettingsTab";
import QualityFeedbackTab from "@/components/dashboard/tabs/QualityFeedbackTab";
import NotificationsTab from "@/components/dashboard/tabs/NotificationsTab";
import ResearchSummaryTab from "@/components/dashboard/tabs/ResearchSummaryTab";
import DiscussionTab from "@/components/dashboard/tabs/DiscussionTab";
import StudentMessagesTab from "@/components/dashboard/tabs/StudentMessagesTab";
import StudentAIAssistantTab from "@/components/dashboard/tabs/StudentAIAssistantTab";
import SessionBookingTab from "@/components/dashboard/tabs/SessionBookingTab";
import FullThesisSupportTab from "@/components/dashboard/tabs/FullThesisSupportTab";
import ThesisInformationTab from "@/components/dashboard/tabs/ThesisInformationTab";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Check if user needs onboarding (simulate with localStorage)
  useEffect(() => {
    const hasCompletedOnboarding = localStorage.getItem('student_onboarding_complete');
    if (!hasCompletedOnboarding) {
      setShowOnboarding(true);
    }
  }, []);

  // Listen for tab change events from child components
  useEffect(() => {
    const handleSetActiveTab = (event: CustomEvent) => {
      setActiveTab(event.detail);
    };

    window.addEventListener('setActiveTab', handleSetActiveTab as EventListener);
    return () => {
      window.removeEventListener('setActiveTab', handleSetActiveTab as EventListener);
    };
  }, []);

  const handleOnboardingComplete = () => {
    localStorage.setItem('student_onboarding_complete', 'true');
    setShowOnboarding(false);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return <StudentWelcomeOverviewTab />;
      case "ai-assistant":
        return <StudentAIAssistantTab />;
      case "find-researcher":
        return <FindResearcherTab />;
      case "session-booking":
        return <SessionBookingTab />;
      case "performance":
        return <StudentPerformanceTab />;
      case "upcoming":
        return <StudentUpcomingTab />;
      case "past":
        return <StudentPastTab />;
      case "full-thesis-support":
        return <FullThesisSupportTab />;
      case "payments":
        return <PaymentsTab />;
      case "messages":
        return <StudentMessagesTab />;
      case "quality":
        return <QualityFeedbackTab />;
      case "discussion":
        return <DiscussionTab />;
      case "notifications":
        return <NotificationsTab />;
      case "research-summary":
        return <ResearchSummaryTab />;
      case "thesis-information":
        return <ThesisInformationTab />;
      case "documents":
        return <DocumentsTab />;
      case "settings":
        return <SettingsTab />;
      default:
        return <StudentWelcomeOverviewTab />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-gray-50 py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Welcome back, Emmanuel!</h1>
              <p className="text-gray-600">Ready to advance your research journey?</p>
            </div>
          </div>
          
          {/* Show onboarding for new users */}
          {showOnboarding && (
            <div className="mb-8">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-2">Welcome to ResearchWhao!</h3>
                  <p className="text-gray-600 mb-4">Complete your profile to start connecting with researchers.</p>
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
                userType="student"
              />
            </div>
            
            {/* Main content */}
            <div className="md:col-span-3">
              {/* Notifications Banner */}
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

export default Dashboard;
