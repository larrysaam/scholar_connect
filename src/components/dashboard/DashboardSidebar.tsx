import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  userType: "student" | "researcher" | "research-aide";
  notificationCount: number;
}

const DashboardSidebar = ({ activeTab, setActiveTab, userType, notificationCount }: DashboardSidebarProps) => {
  const studentMenuItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "ai-assistant", label: "AI Assistant", icon: MessageSquare },
    { id: "find-researcher", label: "Find Researcher", icon: Search },
    { id: "find-research-aid", label: "Find Research Aid", icon: Users },
    { id: "post-job", label: "Post a Job", icon: Briefcase },
    { id: "my-bookings", label: "My Bookings", icon: Calendar },
    { id: "upcoming", label: "Upcoming Sessions", icon: Calendar },
    { id: "past", label: "Past Sessions", icon: Clock },
    { id: "full-thesis-support", label: "Full Thesis Support", icon: GraduationCap },
    { id: "payments", label: "Payments", icon: DollarSign },
    { id: "messages", label: "Messages", icon: MessageSquare },
    { id: "performance", label: "My Progress", icon: TrendingUp },
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
    { id: "performance", label: "Performance & Reputation", icon: TrendingUp },
    { id: "quality", label: "Quality & Feedback", icon: Star },
    { id: "messaging", label: "Messaging", icon: MessageSquare }, // <-- Added Messaging tab
    { id: "discussion", label: "Discussion Board", icon: MessageSquare },
    { id: "verification", label: "Verification", icon: Shield },
    { id: "notifications", label: "Notifications", icon: Bell, badge: notificationCount },
    { id: "co-author-invitations", label: "Co-author Invitations", icon: UserPlus, badge: 2 },
    { id: "documents", label: "Documents", icon: FileText },
    { id: "profile", label: "Profile Information", icon: User },
    { id: "settings", label: "Account Settings", icon: Settings },
  ];

  const researchAideMenuItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "job-requests", label: "Job Requests", icon: Briefcase },
    { id: "active-tasks", label: "Active Tasks", icon: Clock },
    { id: "appointments", label: "Appointments", icon: Calendar },
    { id: "files-deliverables", label: "Files & Deliverables", icon: FileText },
    { id: "payments-earnings", label: "Payments & Earnings", icon: DollarSign },
    { id: "messages", label: "Messages", icon: MessageSquare },
    { id: "previous-works", label: "Previous Works", icon: Star },
    { id: "profile-ratings", label: "Profile & Ratings", icon: User },
    { id: "notifications", label: "Notifications", icon: Bell, badge: notificationCount },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const getMenuItems = () => {
    switch (userType) {
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
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="space-y-2">
        {menuItems.map((item) => (
          <Button
            key={item.id}
            variant={activeTab === item.id ? "default" : "ghost"}
            className="w-full justify-start"
            onClick={() => handleMenuClick(item.id)}
          >
            <item.icon className="mr-2 h-4 w-4" />
            <span className="flex-1 text-left">{item.label}</span>
            {item.badge && (
              <Badge variant="secondary" className="ml-auto">
                {item.badge}
              </Badge>
            )}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default DashboardSidebar;
