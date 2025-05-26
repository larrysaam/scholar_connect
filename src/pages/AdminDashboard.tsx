
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AdminSidebar from "@/components/admin/AdminSidebar";
import DashboardOverview from "@/components/admin/tabs/DashboardOverview";
import UserManagement from "@/components/admin/tabs/UserManagement";
import ConsultationManagement from "@/components/admin/tabs/ConsultationManagement";
import TaskOrdersManagement from "@/components/admin/tabs/TaskOrdersManagement";
import PaymentTransactions from "@/components/admin/tabs/PaymentTransactions";
import ContentManagement from "@/components/admin/tabs/ContentManagement";
import ReportsAnalytics from "@/components/admin/tabs/ReportsAnalytics";
import MembershipSettings from "@/components/admin/tabs/MembershipSettings";
import SupportFeedback from "@/components/admin/tabs/SupportFeedback";
import SecurityCompliance from "@/components/admin/tabs/SecurityCompliance";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  const renderTabContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardOverview />;
      case "users":
        return <UserManagement />;
      case "consultations":
        return <ConsultationManagement />;
      case "tasks":
        return <TaskOrdersManagement />;
      case "payments":
        return <PaymentTransactions />;
      case "content":
        return <ContentManagement />;
      case "reports":
        return <ReportsAnalytics />;
      case "membership":
        return <MembershipSettings />;
      case "support":
        return <SupportFeedback />;
      case "security":
        return <SecurityCompliance />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-gray-50 py-12">
        <div className="container mx-auto px-4 md:px-6">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-gray-600 mb-8">Comprehensive platform management and oversight</p>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="md:col-span-1">
              <AdminSidebar 
                activeTab={activeTab} 
                setActiveTab={setActiveTab} 
              />
            </div>
            
            {/* Main content */}
            <div className="md:col-span-3">
              {renderTabContent()}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AdminDashboard;
