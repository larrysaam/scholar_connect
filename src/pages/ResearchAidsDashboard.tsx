
import React, { useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardContent from "@/components/dashboard/DashboardContent";

const ResearchAidsDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const handleTabChange = (tab: string) => {
    console.log("Dashboard tab change requested:", tab);
    setActiveTab(tab);
  };

  return (
    <ProtectedRoute requiredRole="aid">
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <DashboardHeader userType="aid" />
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <DashboardSidebar
                activeTab={activeTab}
                setActiveTab={handleTabChange}
                userType="research-aide"
              />
            </div>
            
            <div className="lg:col-span-3">
              <DashboardContent activeTab={activeTab} setActiveTab={handleTabChange} />
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default ResearchAidsDashboard;
