
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AdminSidebar from "@/components/admin/AdminSidebar";
import DashboardOverview from "@/components/admin/tabs/DashboardOverview";
import UserManagement from "@/components/admin/tabs/UserManagement";
import ConsultationManagement from "@/components/admin/tabs/ConsultationManagement";
import TaskOrdersManagement from "@/components/admin/tabs/TaskOrdersManagement";
import PaymentTransactions from "@/components/admin/tabs/PaymentTransactions";
import EmailNotificationDashboard from "@/components/admin/EmailNotificationDashboard";
import ContentManagement from "@/components/admin/tabs/ContentManagement";
import ReportsAnalytics from "@/components/admin/tabs/ReportsAnalytics";
import MembershipSettings from "@/components/admin/tabs/MembershipSettings";
import SupportFeedback from "@/components/admin/tabs/SupportFeedback";
import SecurityCompliance from "@/components/admin/tabs/SecurityCompliance";
import VerificationManagement from "@/components/admin/tabs/VerificationManagement";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const renderTabContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardOverview setActiveTab={setActiveTab} />;
      case "users":
        return <UserManagement />;
      case "consultations":
        return <ConsultationManagement />;
      case "tasks":
        return <TaskOrdersManagement />;
      case "payments":
        return <PaymentTransactions />;
      case "email-notifications":
        return <EmailNotificationDashboard />;
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
      case "verification":
        return <VerificationManagement />;
      case "platform-settings":
        return <SecurityCompliance />; // Reuse SecurityCompliance for platform settings
      default:
        return <DashboardOverview setActiveTab={setActiveTab}/>;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar setActiveTab={setActiveTab} activeTab={activeTab} />
      
      <main className="flex-grow py-2 sm:py-4 lg:py-8">
        <div className="container mx-auto px-2 sm:px-4 lg:px-6 max-w-7xl">
          {/* Header - Mobile Responsive */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 lg:mb-8 space-y-2 sm:space-y-0">
            <div className="min-w-0">
              <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 truncate">
                Admin Dashboard
              </h1>
              <p className="text-sm sm:text-base text-gray-600 mt-1">
                Comprehensive platform management and oversight
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-6">
            {/* Sidebar - hidden on mobile and tablet, visible on large screens */}
            <div className="hidden lg:block lg:col-span-1">
              <div className="sticky top-4">
                <AdminSidebar 
                  activeTab={activeTab} 
                  setActiveTab={setActiveTab} 
                />
              </div>
            </div>
            
            {/* Main content - full width on mobile and tablet, 3/4 width on large screens */}
            <div className="col-span-1 lg:col-span-3">
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

export default AdminDashboard;
