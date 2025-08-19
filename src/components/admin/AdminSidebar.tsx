
import { Button } from "@/components/ui/button";
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
  Settings
} from "lucide-react";

interface AdminSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const AdminSidebar = ({ activeTab, setActiveTab }: AdminSidebarProps) => {
  const menuItems = [
    { id: "dashboard", label: "Dashboard Overview", icon: Home },
    { id: "users", label: "User Management", icon: Users },
    { id: "consultations", label: "Consultation Management", icon: Calendar },
    { id: "tasks", label: "Task Orders", icon: ClipboardList },
    { id: "payments", label: "Payments & Transactions", icon: CreditCard },
    { id: "content", label: "Content Management", icon: FileText },
    { id: "reports", label: "Reports & Analytics", icon: TrendingUp },
    { id: "membership", label: "Membership & VIP", icon: Crown },
    { id: "support", label: "Support & Feedback", icon: MessageSquare },
    { id: "security", label: "Security & Compliance", icon: Shield },
    { id: "verification", label: "Verification Management", icon: CheckCircle }
  ];

  return (
    <div className="bg-white p-5 rounded-lg shadow-sm">
      <div className="flex items-center space-x-4 mb-6">
        <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
          <Shield className="text-red-600" />
        </div>
        <div>
          <p className="font-medium">Admin Panel</p>
          <p className="text-sm text-gray-500">Super Admin</p>
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
          <Button variant="ghost" className="w-full justify-start">
            <Settings className="mr-2 h-4 w-4" />
            Platform Settings
          </Button>
        </div>
      </nav>
    </div>
  );
};

export default AdminSidebar;
