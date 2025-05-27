
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  BarChart3,
  Calendar,
  CreditCard,
  Search,
  MessageSquare,
  Settings,
  LogOut,
  User,
  FileText,
  Bell,
  TrendingUp,
  Briefcase,
  BookOpen,
  ClipboardCheck,
  Award,
  Brain
} from "lucide-react";

interface DashboardSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userType: "student" | "researcher" | "research-aide";
}

const DashboardSidebar = ({ activeTab, setActiveTab, userType }: DashboardSidebarProps) => {
  const getMenuItems = () => {
    switch (userType) {
      case "student":
        return [
          { id: "overview", label: "Dashboard Overview", icon: BarChart3 },
          { id: "ai-assistant", label: "AI Assistant", icon: Brain },
          { id: "find-researcher", label: "Find Researcher", icon: Search },
          { id: "session-booking", label: "Session Booking", icon: Calendar },
          { id: "upcoming", label: "Upcoming Sessions", icon: Calendar },
          { id: "past", label: "Past Sessions", icon: BarChart3 },
          { id: "payments", label: "Payments", icon: CreditCard },
          { id: "messages", label: "Messages", icon: MessageSquare },
          { id: "performance", label: "My Performance", icon: TrendingUp },
          { id: "notifications", label: "Notifications", icon: Bell },
          { id: "profile", label: "My Profile", icon: User },
          { id: "documents", label: "Documents", icon: FileText },
          { id: "settings", label: "Settings", icon: Settings }
        ];
      case "researcher":
        return [
          { id: "overview", label: "Dashboard Overview", icon: BarChart3 },
          { id: "upcoming", label: "Upcoming Sessions", icon: Calendar },
          { id: "past", label: "Past Sessions", icon: BarChart3 },
          { id: "payments", label: "Payments", icon: CreditCard },
          { id: "consultation-services", label: "Consultation Services", icon: Briefcase },
          { id: "performance", label: "Performance & Reputation", icon: TrendingUp },
          { id: "quality", label: "Quality Assurance", icon: ClipboardCheck },
          { id: "discussion", label: "Discussion", icon: MessageSquare },
          { id: "verification", label: "Verification", icon: Award },
          { id: "notifications", label: "Notifications", icon: Bell },
          { id: "co-author-invitations", label: "Co-author Invitations", icon: BookOpen },
          { id: "profile", label: "My Profile", icon: User },
          { id: "documents", label: "Documents", icon: FileText },
          { id: "settings", label: "Settings", icon: Settings }
        ];
      case "research-aide":
        return [
          { id: "overview", label: "Dashboard Overview", icon: BarChart3 },
          { id: "job-requests", label: "Job Requests", icon: Briefcase },
          { id: "messages", label: "Messages", icon: MessageSquare },
          { id: "appointments", label: "Appointments", icon: Calendar },
          { id: "files-deliverables", label: "Files & Deliverables", icon: FileText },
          { id: "payments-earnings", label: "Payments & Earnings", icon: CreditCard },
          { id: "previous-works", label: "Previous Works", icon: Award },
          { id: "notifications", label: "Notifications", icon: Bell },
          { id: "discussion", label: "Discussion", icon: MessageSquare },
          { id: "quality-feedback", label: "Quality Feedback", icon: ClipboardCheck },
          { id: "verification", label: "Verification", icon: Award },
          { id: "profile-ratings", label: "My Profile & Ratings", icon: User },
          { id: "settings", label: "Settings", icon: Settings }
        ];
      default:
        return [];
    }
  };

  const menuItems = getMenuItems();

  return (
    <div className="bg-white p-5 rounded-lg shadow-sm">
      <div className="flex items-center space-x-4 mb-6">
        <Avatar className="h-12 w-12">
          <AvatarImage src="/placeholder-avatar.jpg" alt="User" />
          <AvatarFallback>
            {userType === "student" ? "ST" : userType === "researcher" ? "RS" : "RA"}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium">
            {userType === "student" ? "Student User" : 
             userType === "researcher" ? "Dr. Jane Smith" : 
             "Research Assistant"}
          </p>
          <p className="text-sm text-gray-500">
            {userType === "student" ? "Computer Science" : 
             userType === "researcher" ? "Professor" : 
             "Academic Editor"}
          </p>
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
          <Button variant="ghost" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </nav>
    </div>
  );
};

export default DashboardSidebar;
