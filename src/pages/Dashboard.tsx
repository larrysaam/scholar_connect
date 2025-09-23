
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
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
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(() => searchParams.get("tab") || "overview");
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

        setUserName(data?.name || 'Student');
      } catch (error) {
        console.error('Error fetching user profile:', error);
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
    // Update URL parameters to reflect the current tab
    setSearchParams({ tab });
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
        return <FullThesisSupportTab userRole={profile?.role} setActiveTab={handleTabChange} />;
      case "payments":
        return <PaymentsTab />;
      case "messages":
        return <StudentMessagesTab />;
      case "quality":
        return <QualityFeedbackTab />;
      case "discussion":
        return <DiscussionTab />;
      case "notifications":
        return <NotificationsTab setActiveTab={handleTabChange} />;
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
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar setActiveTab={handleTabChange} activeTab={activeTab}/>
      
      <main className="flex-grow py-2 sm:py-4 lg:py-8">
        <div className="container mx-auto px-2 sm:px-4 lg:px-6 max-w-7xl">
          {/* Header - Mobile Responsive */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 lg:mb-8 space-y-2 sm:space-y-0">
            <div className="min-w-0">
              <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 truncate">
                Welcome, {userName || 'Student'}
              </h1>
              <p className="text-sm sm:text-base text-gray-600 mt-1">
                Ready to advance your research journey?
              </p>
            </div>
          </div>
          
          {/* Show onboarding for new users */}
          {/* {showOnboarding && (
            <div className="mb-4 sm:mb-6 lg:mb-8">
              <Card className="border-0 shadow-md">
                <CardContent className="p-4 sm:p-6">
                  <h3 className="text-base sm:text-lg font-semibold mb-2">Welcome to ResearchWhao!</h3>
                  <p className="text-sm sm:text-base text-gray-600 mb-4">
                    Complete your profile to start connecting with researchers.
                  </p>
                  <button 
                    onClick={handleOnboardingComplete}
                    className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors duration-200 text-sm sm:text-base"
                  >
                    Get Started
                  </button>
                </CardContent>
              </Card>
            </div>
          )} */}
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-6">
            {/* Sidebar - hidden on mobile and tablet, visible on large screens */}
            <div className="hidden lg:block lg:col-span-1">
              <div className="sticky top-4">
                <DashboardSidebar 
                  activeTab={activeTab} 
                  setActiveTab={handleTabChange} 
                  userRole={profile?.role || 'student'}
                  notificationCount={unreadCount}
                />
              </div>
            </div>
            
            {/* Main content - full width on mobile and tablet, 3/4 width on large screens */}
            <div className="col-span-1 lg:col-span-3">
              {/* Notifications Banner */}
              <div className="mb-4">
                <NotificationsBanner />
              </div>
              
              {/* Main Content Area */}
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="p-3 sm:p-4 lg:p-6">
                  <div className="min-h-[50vh] max-w-full overflow-hidden">
                    {renderTabContent()}
                  </div>
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

