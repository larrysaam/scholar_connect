
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import NotificationsBanner from "@/components/dashboard/NotificationsBanner";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import StudentUpcomingTab from "@/components/dashboard/tabs/StudentUpcomingTab";
import StudentPastTab from "@/components/dashboard/tabs/StudentPastTab";
import StudentWelcomeOverviewTab from "@/components/dashboard/tabs/StudentWelcomeOverviewTab";
import StudentPerformanceTab from "@/components/dashboard/tabs/StudentPerformanceTab";
import FindResearcherTab from "@/components/dashboard/tabs/FindResearcherTab";
import FindResearchAidTab from "@/components/dashboard/tabs/FindResearchAidTab";
import PostJobTab from "@/components/dashboard/tabs/PostJobTab";
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
import MyBookingsTab from "@/components/dashboard/tabs/MyBookingsTab";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNotifications } from "@/hooks/useNotifications";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [userName, setUserName] = useState("");

  const { toast } = useToast();
  const { user, profile } = useAuth();
  const { unreadCount } = useNotifications();
  
  useEffect(() => {
    fetchUserProfile();
  }, [user]);

  const fetchUserProfile = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single();
  
        if (error) {
          console.error('Error fetching user profile:', error);
          toast({
            title: "Error",
            description: "Failed to load user name",
            variant: "destructive"
          });
          return;
        }

        setUserName(data.name);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      } finally {
        setProfileLoading(false);
      }
    };


  // Check if user needs onboarding (simulate with localStorage)
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
    console.log("Rendering tab content for:", activeTab);
    
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
      case "my-bookings":
        return <MyBookingsTab />;
      case "session-booking":
        return <SessionBookingTab />;
      case "performance":
        return <StudentPerformanceTab />;
      case "upcoming":
        return <StudentUpcomingTab />;
      case "past":
        return <StudentPastTab />;
      case "full-thesis-support":
        return <FullThesisSupportTab userRole={profile?.role} />;
      case "payments":
        return <PaymentsTab />;
      case "messages":
        return <StudentMessagesTab />;
      case "quality":
        return <QualityFeedbackTab />;
      case "discussion":
        return <DiscussionTab />;
      case "notifications":
        return <NotificationsTab setActiveTab={setActiveTab} />;
      case "research-summary":
        return <ResearchSummaryTab />;
      case "thesis-information":
        return <ThesisInformationTab />;
      case "documents":
        return <DocumentsTab />;
      case "settings":
        return <SettingsTab />;
      default:
        console.log("Unknown tab, defaulting to overview:", activeTab);
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
              <h1 className="text-2xl font-bold text-gray-800">Welcome back, {userName}</h1>
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
                setActiveTab={handleTabChange} 
                userRole={profile?.role}
                notificationCount={unreadCount}
              />
            </div>
            
            {/* Main content */}
            <div className="md:col-span-3">
              {/* Notifications Banner */}
              <NotificationsBanner />
              
              <div className="mt-4">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  {renderTabContent()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
function setProfileLoading(arg0: boolean) {
  throw new Error("Function not implemented.");
}

