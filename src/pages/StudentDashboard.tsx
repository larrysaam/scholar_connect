
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import NotificationsBanner from "@/components/dashboard/NotificationsBanner";
import IntelligentChatAssistant from "@/components/ai/IntelligentChatAssistant";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import StudentWelcomeOverviewTab from "@/components/dashboard/tabs/StudentWelcomeOverviewTab";
import FindResearcherTab from "@/components/dashboard/tabs/FindResearcherTab";
import FindResearchAidTab from "@/components/dashboard/tabs/FindResearchAidTab";
import SessionBookingTab from "@/components/dashboard/tabs/SessionBookingTab";
import StudentUpcomingTab from "@/components/dashboard/tabs/StudentUpcomingTab";
import StudentPastTab from "@/components/dashboard/tabs/StudentPastTab";
import PaymentsTab from "@/components/dashboard/tabs/PaymentsTab";
import ProfileTab from "@/components/dashboard/tabs/ProfileTab";
import DocumentsTab from "@/components/dashboard/tabs/DocumentsTab";
import SettingsTab from "@/components/dashboard/tabs/SettingsTab";
import NotificationsTab from "@/components/dashboard/tabs/NotificationsTab";
import StudentPerformanceTab from "@/components/dashboard/tabs/StudentPerformanceTab";
import StudentMessagesTab from "@/components/dashboard/tabs/StudentMessagesTab";
import StudentAIAssistantTab from "@/components/dashboard/tabs/StudentAIAssistantTab";
import PostJobTab from "@/components/dashboard/tabs/PostJobTab";

const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [showOnboarding, setShowOnboarding] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const hasCompletedOnboarding = localStorage.getItem('student_onboarding_complete');
    if (!hasCompletedOnboarding) {
      setShowOnboarding(true);
    }
  }, []);

  const handleOnboardingComplete = () => {
    localStorage.setItem('student_onboarding_complete', 'true');
    setShowOnboarding(false);
  };

  const handleTabChange = (tab: string) => {
    console.log("Dashboard tab change requested:", tab);
    setActiveTab(tab);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return <StudentWelcomeOverviewTab />;
      case "ai-assistant":
        return <StudentAIAssistantTab />;
      case "find-researcher":
        return <FindResearcherTab />;
      case "find-research-aid":
        return <FindResearchAidTab />;
      case "post-job":
        return <PostJobTab />;
      case "session-booking":
        return <SessionBookingTab />;
      case "upcoming":
        return <StudentUpcomingTab />;
      case "past":
        return <StudentPastTab />;
      case "payments":
        return <PaymentsTab />;
      case "messages":
        return <StudentMessagesTab />;
      case "performance":
        return <StudentPerformanceTab />;
      case "notifications":
        return <NotificationsTab />;
      case "profile":
        return <ProfileTab />;
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
          <h1 className="text-3xl font-bold mb-2">Student Dashboard</h1>
          <p className="text-gray-600 mb-8">Manage your research consultations and learning journey</p>
          
          {showOnboarding && (
            <div className="mb-8">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-2">Welcome to ResearchWhoa!</h3>
                  <p className="text-gray-600 mb-4">Complete your profile to start connecting with expert researchers.</p>
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
                setActiveTab={handleTabChange} 
                userType="student"
              />
            </div>
            
            <div className="md:col-span-3">
              <NotificationsBanner />
              
              <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                <TabsContent value={activeTab} className="mt-0">
                  {renderTabContent()}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
      
      <IntelligentChatAssistant userType="student" currentTab={activeTab} />
      
      <Footer />
    </div>
  );
};

export default StudentDashboard;
