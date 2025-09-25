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

interface ResponsiveDashboardSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userRole: "student" | "researcher" | "research-aide";
  notificationCount: number;
}

const ResponsiveDashboardSidebar = ({ 
  activeTab, 
  setActiveTab, 
  userRole, 
  notificationCount 
}: ResponsiveDashboardSidebarProps) => {
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
    { id: "my-bookings", label: "My Bookings", icon: Calendar },
    { id: "upcoming", label: "Upcoming Sessions", icon: Calendar },
    { id: "past", label: "Past Sessions", icon: Clock },
    { id: "full-thesis-support", label: "Full Thesis Support", icon: GraduationCap },
    { id: "payments", label: "Payments", icon: DollarSign },
    { id: "messages", label: "Messages", icon: MessageSquare },
    { id: "notifications", label: "Notifications", icon: Bell, badge: notificationCount },
    { id: "thesis-information", label: "Thesis Information", icon: BookOpen },
    { id: "documents", label: "Documents", icon: FileText },
    { id: "settings", label: "Account Settings", icon: Settings },
    { id: "co-author-workspace", label: "Co-Author Workspace", icon: Users },
  ];

  const researcherMenuItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "consultation-services", label: "Consultation Services", icon: MessageSquare },
    { id: "upcoming", label: "Upcoming Sessions", icon: Calendar },
    { id: "past", label: "Past Sessions", icon: Clock },
    { id: "full-thesis-support", label: "Thesis Support", icon: GraduationCap },
    { id: "payments", label: "Payments & Earnings", icon: DollarSign },
    { id: "quality", label: "Quality & Feedback", icon: Star },
    { id: "messaging", label: "Messaging", icon: MessageSquare },
    { id: "verification", label: "Verification", icon: Shield },
    { id: "discussion", label: "Discussion Board", icon: MessageSquare },
    { id: "notifications", label: "Notifications", icon: Bell, badge: notificationCount },
    { id: "co-author-invitations", label: "Co-author Invitations", icon: UserPlus, badge: 2 },
    { id: "documents", label: "Documents", icon: FileText },
    { id: "settings", label: "Account Settings", icon: Settings },
    { id: "co-author-workspace", label: "Co-Author Workspace", icon: Users },
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
    if (itemId === "co-author-workspace") {
      navigate("/co-author-workspace");
    } else {
      setActiveTab(itemId);
    }
  };

  const SidebarContent = ({ className = "" }: { className?: string }) => (
    <div className={`bg-white rounded-lg shadow-sm p-3 sm:p-4 ${className}`}>
      <div className="space-y-1 sm:space-y-2">
        {menuItems.map((item) => (
          <Button
            key={item.id}
            variant={
              activeTab === item.id ||
              (item.id === "co-author-workspace" && window.location.pathname === "/co-author-workspace")
                ? "default"
                : "ghost"
            }
            className="w-full justify-start text-sm sm:text-base py-2 sm:py-2.5"
            onClick={() => handleMenuClick(item.id)}
          >
            <item.icon className="mr-2 h-4 w-4 flex-shrink-0" />
            <span className="flex-1 text-left truncate">{item.label}</span>
            {item.badge && (
              <Badge variant="secondary" className="ml-auto text-xs">
                {item.badge}
              </Badge>
            )}
          </Button>
        ))}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar - hamburger menu now handled in navbar */}
      <div className="block">
        <SidebarContent />
      </div>
    </>
  );
};

export default ResponsiveDashboardSidebar;
