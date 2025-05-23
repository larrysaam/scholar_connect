
import { Button } from "@/components/ui/button";
import { 
  Calendar,
  Clock,
  User,
  FileText,
  Settings,
  DollarSign
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
        <Button variant="ghost" className="w-full justify-start" onClick={() => setActiveTab("upcoming")}>
          <Calendar className="mr-2 h-4 w-4" />
          Upcoming
        </Button>
        <Button variant="ghost" className="w-full justify-start" onClick={() => setActiveTab("past")}>
          <Clock className="mr-2 h-4 w-4" />
          Past Consultations
        </Button>
        <Button variant="ghost" className="w-full justify-start" onClick={() => setActiveTab("payments")}>
          <DollarSign className="mr-2 h-4 w-4" />
          Payments
        </Button>
        <Button variant="ghost" className="w-full justify-start" onClick={() => setActiveTab("profile")}>
          <User className="mr-2 h-4 w-4" />
          Profile
        </Button>
        <Button variant="ghost" className="w-full justify-start" onClick={() => setActiveTab("documents")}>
          <FileText className="mr-2 h-4 w-4" />
          Documents
        </Button>
        <Button variant="ghost" className="w-full justify-start" onClick={() => setActiveTab("settings")}>
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </Button>
      </nav>
    </div>
  );
};

export default DashboardSidebar;
