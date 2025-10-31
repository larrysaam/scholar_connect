import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import WelcomeOverviewTab from "@/components/dashboard/tabs/WelcomeOverviewTab";
import NotificationsTab from "@/components/dashboard/tabs/NotificationsTab";
import ProfileTab from "@/components/dashboard/tabs/ProfileTab";
import SettingsTab from "@/components/dashboard/tabs/SettingsTab";
import DocumentsTab from "@/components/dashboard/tabs/DocumentsTab";
import MessagingTab from "@/components/dashboard/tabs/MessagingTab";
import AidJobApplicationsTab from "@/components/dashboard/tabs/AidJobApplicationsTab";
import AidCurrentJobsTab from "@/components/dashboard/tabs/AidCurrentJobsTab";
import AidCompletedJobsTab from "@/components/dashboard/tabs/AidCompletedJobsTab";

interface AidJobManagementContentProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const AidJobManagementContent = ({ activeTab, setActiveTab }: AidJobManagementContentProps) => {
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    const hasCompletedOnboarding = localStorage.getItem('aid_onboarding_complete');
    if (!hasCompletedOnboarding) {
      setShowOnboarding(true);
    }
  }, []);

  const handleOnboardingComplete = () => {
    localStorage.setItem('aid_onboarding_complete', 'true');
    setShowOnboarding(false);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return <WelcomeOverviewTab setActiveTab={setActiveTab} />;
      case "job-applications":
        return <AidJobApplicationsTab />;
      case "current-jobs":
        return <AidCurrentJobsTab />;
      case "completed-jobs":
        return <AidCompletedJobsTab />;
      case "messaging":
        return <MessagingTab />;
      case "notifications":
        return <NotificationsTab setActiveTab={setActiveTab} />;
      case "documents":
        return <DocumentsTab />;
      case "profile":
        return <ProfileTab />;
      case "settings":
        return <SettingsTab />;
      default:
        return <WelcomeOverviewTab setActiveTab={setActiveTab} />;
    }
  };

  return (
    <>
      {/* {showOnboarding && (
        <div className="mb-8">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-2">Welcome to ResearchTandem!</h3>
              <p className="text-gray-600 mb-4">Complete your profile to start managing your jobs.</p>
              <button 
                onClick={handleOnboardingComplete}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Get Started
              </button>
            </CardContent>
          </Card>
        </div>
      )} */}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsContent value={activeTab} className="mt-0">
          {renderTabContent()}
        </TabsContent>
      </Tabs>
    </>
  );
};

export default AidJobManagementContent;
