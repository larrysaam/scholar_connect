
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardContent from "@/components/dashboard/DashboardContent";
import UserOnboarding from "@/components/onboarding/UserOnboarding";
import { Card, CardContent } from "@/components/ui/card";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Check if user needs onboarding (simulate with localStorage)
  useEffect(() => {
    const hasCompletedOnboarding = localStorage.getItem('onboarding_complete');
    if (!hasCompletedOnboarding) {
      setShowOnboarding(true);
    }
  }, []);

  const handleOnboardingComplete = () => {
    localStorage.setItem('onboarding_complete', 'true');
    setShowOnboarding(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-gray-50 py-12">
        <div className="container mx-auto px-4 md:px-6">
          <h1 className="text-3xl font-bold mb-2">Student Dashboard</h1>
          <p className="text-gray-600 mb-8">Manage your consultations and account</p>
          
          {/* Show onboarding for new users */}
          {showOnboarding && (
            <div className="mb-8">
              <UserOnboarding />
              <div className="text-center mt-4">
                <button 
                  onClick={handleOnboardingComplete}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Skip onboarding
                </button>
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="md:col-span-1">
              <DashboardSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
            </div>
            
            {/* Main content */}
            <div className="md:col-span-3">
              <DashboardContent activeTab={activeTab} setActiveTab={setActiveTab} />
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
