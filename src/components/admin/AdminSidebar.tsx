
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { 
  BarChart3,
  Users,
  Calendar,
  ClipboardList,
  CreditCard,
  FileText,
  TrendingUp,
  Crown,
  MessageSquare,
  Shield,
  Home,
  Settings,
  CheckCircle,
  LogOut,
  Mail
} from "lucide-react";

interface AdminSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const AdminSidebar = ({ activeTab, setActiveTab }: AdminSidebarProps) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };  const menuItems = [
    { id: "dashboard", label: "Dashboard Overview", icon: Home },
    { id: "users", label: "User Management", icon: Users },
    { id: "consultations", label: "Consultation Management", icon: Calendar },
    { id: "tasks", label: "Task Orders", icon: ClipboardList },
    { id: "payments", label: "Payments & Transactions", icon: CreditCard },
    // { id: "email-notifications", label: "Email Notifications", icon: Mail },
    { id: "content", label: "Content Management", icon: FileText },
    { id: "reports", label: "Reports & Analytics", icon: TrendingUp },
    // { id: "membership", label: "Membership & VIP", icon: Crown },
    { id: "support", label: "Support & Feedback", icon: MessageSquare },
    { id: "security", label: "Security & Compliance", icon: Shield },
    { id: "verification", label: "Verification Management", icon: CheckCircle }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm p-3 lg:p-4 h-fit">
      {/* Admin Header - Hidden on mobile for space optimization */}
      <div className="hidden lg:flex items-center space-x-3 lg:space-x-4 mb-4 lg:mb-6">
        <div className="h-10 w-10 lg:h-12 lg:w-12 rounded-full bg-red-100 flex items-center justify-center">
          <Shield className="text-red-600 h-5 w-5 lg:h-6 lg:w-6" />
        </div>
        <div>
          <p className="font-medium text-sm lg:text-base">Admin Panel</p>
          <p className="text-xs lg:text-sm text-gray-500">Super Admin</p>
        </div>
      </div>
      
      <div className="space-y-1 lg:space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Button 
              key={item.id}
              variant={activeTab === item.id ? "default" : "ghost"} 
              className="w-full justify-start text-xs lg:text-sm py-2 lg:py-2.5 px-2 lg:px-3 h-auto transition-all duration-200 hover:bg-gray-50 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
              onClick={() => setActiveTab(item.id)}
            >
              <Icon className="mr-2 h-3 w-3 lg:h-4 lg:w-4 flex-shrink-0" />
              <span className="flex-1 text-left truncate min-w-0">{item.label}</span>
            </Button>
          );
        })}
        
        {/* Admin Actions */}
        <div className="pt-2 lg:pt-4 border-t border-gray-200 mt-4">
          <Button 
            variant="ghost" 
            className="w-full justify-start text-xs lg:text-sm py-2 lg:py-2.5 px-2 lg:px-3 h-auto mb-2"
            onClick={() => setActiveTab("platform-settings")}
          >
            <Settings className="mr-2 h-3 w-3 lg:h-4 lg:w-4 flex-shrink-0" />
            <span className="flex-1 text-left">Platform Settings</span>
          </Button>
          
          {/* Sign Out Button */}
          <Button
            variant="outline"
            className="w-full justify-start text-xs lg:text-sm py-2 lg:py-2.5 px-2 lg:px-3 h-auto text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
            onClick={handleSignOut}
          >
            <LogOut className="mr-2 h-3 w-3 lg:h-4 lg:w-4 flex-shrink-0" />
            <span className="flex-1 text-left">Sign Out</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;
