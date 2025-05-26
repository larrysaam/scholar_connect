
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ResearchAidsSidebar from "@/components/dashboard/ResearchAidsSidebar";
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

const ResearchAidsDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    const hasCompletedOnboarding = localStorage.getItem('research_aids_onboarding_complete');
    if (!hasCompletedOnboarding) {
      setShowOnboarding(true);
    }
  }, []);

  const handleOnboardingComplete = () => {
    localStorage.setItem('research_aids_onboarding_complete', 'true');
    setShowOnboarding(false);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return <ResearchAidsOverview />;
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
      case "settings":
        return <ResearchAidsSettings />;
      default:
        return <ResearchAidsOverview />;
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
      
      <Footer />
    </div>
  );
};

export default ResearchAidsDashboard;
