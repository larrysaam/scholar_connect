
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
  Shield,
  Bell,
  UserPlus,
  User,
  FileText,
  Settings
} from "lucide-react";

interface DashboardSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userType: "student" | "researcher" | "research-aide";
}

const DashboardSidebar = ({ activeTab, setActiveTab, userType }: DashboardSidebarProps) => {
  const menuItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "upcoming", label: "Upcoming", icon: Calendar },
    { id: "past", label: "Past", icon: Clock },
    { id: "payments", label: "Payments & Earnings", icon: DollarSign },
    { id: "consultation-services", label: "Consultation Services", icon: MessageSquare },
    { id: "performance", label: "Performance & Reputation", icon: TrendingUp },
    { id: "quality", label: "Quality & Feedback", icon: Star },
    { id: "discussion", label: "Discussion Board", icon: MessageSquare },
    { id: "verification", label: "Verification", icon: Shield },
    { id: "notifications", label: "Notifications", icon: Bell, badge: 3 },
    { id: "co-author-invitations", label: "Co-author Invitations", icon: UserPlus, badge: 2 },
    { id: "documents", label: "Documents", icon: FileText },
    { id: "profile", label: "Profile Information", icon: User },
    { id: "settings", label: "Account Settings", icon: Settings },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="space-y-2">
        {menuItems.map((item) => (
          <Button
            key={item.id}
            variant={activeTab === item.id ? "default" : "ghost"}
            className="w-full justify-start"
            onClick={() => setActiveTab(item.id)}
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
