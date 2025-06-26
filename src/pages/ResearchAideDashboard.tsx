import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import UpcomingTab from "@/components/dashboard/tabs/UpcomingTab";
import PastTab from "@/components/dashboard/tabs/PastTab";
import PaymentsTab from "@/components/dashboard/tabs/PaymentsTab";
import ProfileTab from "@/components/dashboard/tabs/ProfileTab";
import DocumentsTab from "@/components/dashboard/tabs/DocumentsTab";
import SettingsTab from "@/components/dashboard/tabs/SettingsTab";
import ResearchAidQualityTab from "@/components/dashboard/tabs/ResearchAidQualityTab";
import ResearchAidsTasksTab from "@/components/dashboard/tabs/ResearchAidsTasksTab";
import DiscussionTab from "@/components/dashboard/tabs/DiscussionTab";
import NotificationsTab from "@/components/dashboard/tabs/NotificationsTab";
import ResearchAidOverviewTab from "@/components/dashboard/tabs/ResearchAidOverviewTab";
import ResearchAidJobRequestsTab from "@/components/dashboard/tabs/ResearchAidJobRequestsTab";
import ResearchAidPaymentsTab from "@/components/dashboard/tabs/ResearchAidPaymentsTab";

const ResearchAideDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [showOnboarding, setShowOnboarding] = useState(false);
  const { profile } = useAuth();

  const getWelcomeMessage = () => {
    if (!profile?.name) return "Research Aid Dashboard";
    
    const nameParts = profile.name.split(' ');
    const lastName = nameParts[nameParts.length - 1];
    
    // Check for academic rank first (Professor takes precedence)
    if (profile.academic_rank && 
        (profile.academic_rank.includes('Professor') || 
         profile.academic_rank.includes('Prof'))) {
      return `Welcome, Prof. ${lastName}!`;
    }
    
    // Check for PhD/Postdoc in level_of_study or highest_education
    const hasPhD = profile.level_of_study?.toLowerCase().includes('phd') ||
                   profile.level_of_study?.toLowerCase().includes('postdoc') ||
                   profile.highest_education?.toLowerCase().includes('phd') ||
                   profile.highest_education?.toLowerCase().includes('postdoc');
    
    if (hasPhD) {
      return `Welcome, Dr. ${lastName}!`;
    }
    
    return `Welcome, ${lastName}!`;
  };

  useEffect(() => {
    const hasCompletedOnboarding = localStorage.getItem('research_aide_onboarding_complete');
    if (!hasCompletedOnboarding) {
      setShowOnboarding(true);
    }
  }, []);

  const handleOnboardingComplete = () => {
    localStorage.setItem('research_aide_onboarding_complete', 'true');
    setShowOnboarding(false);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return <ResearchAidOverviewTab />;
      case "job-requests":
        return <ResearchAidJobRequestsTab />;
      case "messages":
        return <DiscussionTab />;
      case "appointments":
        return <UpcomingTab />;
      case "files-deliverables":
        return <DocumentsTab />;
      case "payments-earnings":
        return <ResearchAidPaymentsTab />;
      case "profile-ratings":
        return <ProfileTab />;
      case "tasks":
        return <ResearchAidsTasksTab />;
      case "upcoming":
        return <UpcomingTab />;
      case "past":
        return <PastTab />;
      case "payments":
        return <PaymentsTab />;
      case "quality":
        return <ResearchAidQualityTab />;
      case "discussion":
        return <DiscussionTab />;
      case "notifications":
        return <NotificationsTab />;
      case "profile":
        return <ProfileTab />;
      case "documents":
        return <DocumentsTab />;
      case "settings":
        return <SettingsTab />;
      default:
        return <ResearchAidOverviewTab />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-gray-50 py-12">
        <div className="container mx-auto px-4 md:px-6">
          <h1 className="text-3xl font-bold mb-2">{getWelcomeMessage()}</h1>
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
              <DashboardSidebar 
                activeTab={activeTab} 
                setActiveTab={setActiveTab} 
                userType="research-aide"
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
      
      <Footer />
    </div>
  );
};

export default ResearchAideDashboard;
