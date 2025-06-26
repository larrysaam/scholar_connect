
import React, { useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardContent from "@/components/dashboard/DashboardContent";

const ResearcherDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const handleTabChange = (tab: string) => {
    console.log("Dashboard tab change requested:", tab);
    setActiveTab(tab);
  };

  return (
    <ProtectedRoute requiredRole="expert">
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <DashboardHeader userType="researcher" />
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <DashboardSidebar
                activeTab={activeTab}
                setActiveTab={handleTabChange}
                userType="researcher"
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

export default ResearcherDashboard;
