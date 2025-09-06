
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  BarChart3,
  Briefcase,
  MessageSquare,
  Calendar,
  Upload,
  DollarSign,
  Star,
  Settings,
  LogOut,
  FolderOpen,
  Bell,
  MessageCircle,
  Shield,
  Award
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface ResearchAidsSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const ResearchAidsSidebar = ({ activeTab, setActiveTab }: ResearchAidsSidebarProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const menuItems = [
    { id: "overview", label: "Dashboard Overview", icon: BarChart3 },
    { id: "job-management", label: "Job Management", icon: Briefcase }, // New item
    { id: "job-requests", label: "Job Requests", icon: Briefcase },
    { id: "messages", label: "Messages", icon: MessageSquare },
    { id: "appointments", label: "Appointments", icon: Calendar },
    { id: "files-deliverables", label: "Files & Deliverables", icon: Upload },
    { id: "payments-earnings", label: "Payments & Earnings", icon: DollarSign },
    { id: "previous-works", label: "Previous Works", icon: FolderOpen },
    { id: "notifications", label: "Notifications", icon: Bell },
    // { id: "discussion", label: "Discussion", icon: MessageCircle },
    { id: "quality-feedback", label: "Quality Feedback", icon: Award },
    { id: "verification", label: "Verification", icon: Shield },
    { id: "profile-ratings", label: "My Profile & Ratings", icon: Star },
    { id: "settings", label: "Settings", icon: Settings }
  ];

  const handleLogout = () => {
    // Clear local storage
    localStorage.removeItem('research_aids_onboarding_complete');
    localStorage.removeItem('research_aids_nda_signed');
    localStorage.removeItem('research_aids_nda_date');
    
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out"
    });
    
    // Navigate to home page
    navigate('/');
  };

  return (
    <div className="bg-white p-5 rounded-lg shadow-sm">
      <div className="flex items-center space-x-4 mb-6">
        <Avatar className="h-12 w-12">
          <AvatarImage src="/placeholder-avatar.jpg" alt="Dr. Neba" />
          <AvatarFallback>DN</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium">Dr. Neba Emmanuel</p>
          <p className="text-sm text-gray-500">Academic Editor</p>
        </div>
      </div>
      
      <nav className="space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Button 
              key={item.id}
              variant={activeTab === item.id ? "default" : "ghost"} 
              className="w-full justify-start" 
              onClick={() => setActiveTab(item.id)}
            >
              <Icon className="mr-2 h-4 w-4" />
              {item.label}
            </Button>
          );
        })}
        
        <div className="pt-4 border-t">
          <Button 
            variant="ghost" 
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </nav>
    </div>
  );
};

export default ResearchAidsSidebar;
