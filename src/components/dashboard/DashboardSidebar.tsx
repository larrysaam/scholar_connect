
import { Button } from "@/components/ui/button";
import { 
  Calendar,
  Clock,
  User,
  FileText,
  Settings,
  Banknote,
  Shield
} from "lucide-react";

interface DashboardSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const DashboardSidebar = ({ activeTab, setActiveTab }: DashboardSidebarProps) => {
  return (
    <div className="bg-white p-5 rounded-lg shadow-sm">
      <div className="flex items-center space-x-4 mb-6">
        <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
          <User className="text-blue-600" />
        </div>
        <div>
          <p className="font-medium">Alex Smith</p>
          <p className="text-sm text-gray-500">Student</p>
        </div>
      </div>
      
      <nav className="space-y-1">
        <Button 
          variant={activeTab === "upcoming" ? "default" : "ghost"} 
          className="w-full justify-start" 
          onClick={() => setActiveTab("upcoming")}
        >
          <Calendar className="mr-2 h-4 w-4" />
          Upcoming
        </Button>
        <Button 
          variant={activeTab === "past" ? "default" : "ghost"} 
          className="w-full justify-start" 
          onClick={() => setActiveTab("past")}
        >
          <Clock className="mr-2 h-4 w-4" />
          Past Consultations
        </Button>
        <Button 
          variant={activeTab === "payments" ? "default" : "ghost"} 
          className="w-full justify-start" 
          onClick={() => setActiveTab("payments")}
        >
          <Banknote className="mr-2 h-4 w-4" />
          Payments
        </Button>
        <Button 
          variant={activeTab === "quality" ? "default" : "ghost"} 
          className="w-full justify-start" 
          onClick={() => setActiveTab("quality")}
        >
          <Shield className="mr-2 h-4 w-4" />
          Quality
        </Button>
        <Button 
          variant={activeTab === "profile" ? "default" : "ghost"} 
          className="w-full justify-start" 
          onClick={() => setActiveTab("profile")}
        >
          <User className="mr-2 h-4 w-4" />
          Profile
        </Button>
        <Button 
          variant={activeTab === "documents" ? "default" : "ghost"} 
          className="w-full justify-start" 
          onClick={() => setActiveTab("documents")}
        >
          <FileText className="mr-2 h-4 w-4" />
          Documents
        </Button>
        <Button 
          variant={activeTab === "settings" ? "default" : "ghost"} 
          className="w-full justify-start" 
          onClick={() => setActiveTab("settings")}
        >
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </Button>
      </nav>
    </div>
  );
};

export default DashboardSidebar;
