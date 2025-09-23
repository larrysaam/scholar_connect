import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { 
  LayoutDashboard,
  Calendar,
  Clock,
  DollarSign,
  Users,
  MessageSquare,
  TrendingUp,
  Star,
  Bell,
  UserPlus,
  User,
  FileText,
  Settings,
  BookOpen,
  GraduationCap,
  Search,
  Shield,
  Briefcase
} from "lucide-react";

interface DashboardSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userRole: "student" | "researcher" | "research-aide";
  notificationCount: number;
}

const DashboardSidebar = ({ activeTab, setActiveTab, userRole, notificationCount }: DashboardSidebarProps) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const getDashboardLink = () => {
    switch (userRole) {
      case 'researcher':
        return '/researcher-dashboard';
      case 'research-aide':
        return '/research-aids-dashboard';
      case 'student':
        return '/dashboard';
      default:
        return '/dashboard';
    }
  };
  const studentMenuItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "ai-assistant", label: "AI Assistant", icon: MessageSquare },
    { id: "find-researcher", label: "Find Researcher", icon: Search },
    { id: "find-research-aid", label: "Find Research Aid", icon: Users },
    { id: "post-job", label: "Post a Job", icon: Briefcase },
    // { id: "my-applications", label: "My Applications", icon: Briefcase }, // New item
    { id: "my-bookings", label: "My Bookings", icon: Calendar },
    { id: "upcoming", label: "Upcoming Sessions", icon: Calendar },
    { id: "past", label: "Past Sessions", icon: Clock },
    { id: "discussion", label: "Discussion Forum", icon: MessageSquare },
    { id: "full-thesis-support", label: "Full Thesis Support", icon: GraduationCap },
    { id: "payments", label: "Payments", icon: DollarSign },
    { id: "messages", label: "Messages", icon: MessageSquare },
    // { id: "performance", label: "My Progress", icon: TrendingUp },
    { id: "notifications", label: "Notifications", icon: Bell, badge: notificationCount },
    { id: "thesis-information", label: "Thesis Information", icon: BookOpen },
    { id: "documents", label: "Documents", icon: FileText },
    { id: "settings", label: "Account Settings", icon: Settings },
  ];

  const researcherMenuItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "consultation-services", label: "Consultation Service Setup", icon: MessageSquare },
    { id: "upcoming", label: "Upcoming Consultations", icon: Calendar },
    { id: "past", label: "Past Consultations", icon: Clock },
    { id: "full-thesis-support", label: "Full Thesis Support", icon: GraduationCap },
    { id: "payments", label: "Payments & Earnings", icon: DollarSign },
    // sudo disabledd for now
    // { id: "performance", label: "Performance & Reputation", icon: TrendingUp },
    { id: "quality", label: "Quality & Feedback", icon: Star },
    { id: "messaging", label: "Messaging", icon: MessageSquare }, // <-- Added Messaging tab
    { id: "discussion", label: "Discussion Board", icon: MessageSquare },
    { id: "verification", label: "Verification", icon: Shield },
    { id: "notifications", label: "Notifications", icon: Bell, badge: notificationCount },
    // sudo disabled for now
    // { id: "co-author-invitations", label: "Co-author Invitations", icon: UserPlus, badge: 2 },
    { id: "documents", label: "Documents", icon: FileText },
    // { id: "profile", label: "Profile Information", icon: User },
    { id: "settings", label: "Account Settings", icon: Settings },
  ];

  const researchAideMenuItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "job-applications", label: "Job Applications", icon: Briefcase },
    { id: "current-jobs", label: "Current Jobs", icon: Clock },
    { id: "completed-jobs", label: "Completed Jobs", icon: Calendar },
    { id: "messages", label: "Messages", icon: MessageSquare },
    { id: "notifications", label: "Notifications", icon: Bell, badge: notificationCount },
    { id: "documents", label: "Documents", icon: FileText },
    { id: "profile", label: "Profile Information", icon: User },
    { id: "settings", label: "Account Settings", icon: Settings },
  ];

  const getMenuItems = () => {
    switch (userRole) {
      case "student":
        return studentMenuItems;
      case "researcher":
        return researcherMenuItems;
      case "research-aide":
        return researchAideMenuItems;
      default:
        return studentMenuItems;
    }
  };

  const menuItems = getMenuItems();

  const handleMenuClick = (itemId: string) => {
    console.log("Sidebar menu item clicked:", itemId);
    setActiveTab(itemId);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-3 lg:p-4 h-fit">
      <div className="space-y-1 lg:space-y-2">
        {menuItems.map((item) => (
          <Button
            key={item.id}
            variant={activeTab === item.id ? "default" : "ghost"}
            className="w-full justify-start text-xs lg:text-sm py-2 lg:py-2.5 px-2 lg:px-3 h-auto transition-all duration-200 hover:bg-gray-50 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            onClick={() => handleMenuClick(item.id)}
          >
            <item.icon className="mr-2 h-3 w-3 lg:h-4 lg:w-4 flex-shrink-0" />
            <span className="flex-1 text-left truncate min-w-0">{item.label}</span>
            {item.badge && (
              <Badge variant="secondary" className="ml-auto text-xs h-5 px-1.5 flex-shrink-0">
                {item.badge > 99 ? '99+' : item.badge}
              </Badge>
            )}
          </Button>
        ))}
        
        {/* Sign Out Button */}
        <div className="pt-2 lg:pt-4 border-t border-gray-200 mt-4">
          <Button
            variant="outline"
            className="w-full justify-start text-xs lg:text-sm py-2 lg:py-2.5 px-2 lg:px-3 h-auto text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
            onClick={handleSignOut}
          >
            <Settings className="mr-2 h-3 w-3 lg:h-4 lg:w-4 flex-shrink-0" />
            <span className="flex-1 text-left">Sign Out</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DashboardSidebar;
