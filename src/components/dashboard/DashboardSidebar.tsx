
import { Button } from "@/components/ui/button";
import { 
  Calendar,
  Clock,
  User,
  FileText,
  Settings,
  Banknote,
  MessageSquare,
  UserPlus,
  Shield,
  Bell,
  BookOpen,
  MessageCircle,
  CheckSquare
} from "lucide-react";
import InviteModal from "@/components/researcher/InviteModal";
import MisconductReportModal from "./MisconductReportModal";

interface DashboardSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userType?: string;
}

const DashboardSidebar = ({ activeTab, setActiveTab, userType }: DashboardSidebarProps) => {
  return (
    <div className="bg-white p-5 rounded-lg shadow-sm">
      <div className="flex items-center space-x-4 mb-6">
        <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
          <User className="text-blue-600" />
        </div>
        <div>
          <p className="font-medium">Alex Smith</p>
          <p className="text-sm text-gray-500">
            {userType === "researcher" ? "Researcher" : userType === "research-aide" ? "Research Aid" : "Student"}
          </p>
        </div>
      </div>
      
      <nav className="space-y-1">
        {/* Show tasks tab for research aids */}
        {userType === "research-aide" && (
          <Button 
            variant={activeTab === "tasks" ? "default" : "ghost"} 
            className="w-full justify-start" 
            onClick={() => setActiveTab("tasks")}
          >
            <CheckSquare className="mr-2 h-4 w-4" />
            Tasks
          </Button>
        )}
        
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
          <MessageSquare className="mr-2 h-4 w-4" />
          Quality Feedback
        </Button>
        
        {/* Discussion tab for all user types */}
        <Button 
          variant={activeTab === "discussion" ? "default" : "ghost"} 
          className="w-full justify-start" 
          onClick={() => setActiveTab("discussion")}
        >
          <MessageCircle className="mr-2 h-4 w-4" />
          Discussion
        </Button>
        
        {/* Show notifications for all user types */}
        <Button 
          variant={activeTab === "notifications" ? "default" : "ghost"} 
          className="w-full justify-start" 
          onClick={() => setActiveTab("notifications")}
        >
          <Bell className="mr-2 h-4 w-4" />
          Notifications
        </Button>
        
        {/* Show research summary only for students */}
        {userType !== "researcher" && userType !== "research-aide" && (
          <Button 
            variant={activeTab === "research-summary" ? "default" : "ghost"} 
            className="w-full justify-start" 
            onClick={() => setActiveTab("research-summary")}
          >
            <BookOpen className="mr-2 h-4 w-4" />
            Research Summary
          </Button>
        )}
        
        {userType === "researcher" && (
          <>
            <Button 
              variant={activeTab === "verification" ? "default" : "ghost"} 
              className="w-full justify-start" 
              onClick={() => setActiveTab("verification")}
            >
              <Shield className="mr-2 h-4 w-4" />
              Verification
            </Button>
            <Button 
              variant={activeTab === "co-author-invitations" ? "default" : "ghost"} 
              className="w-full justify-start" 
              onClick={() => setActiveTab("co-author-invitations")}
            >
              <UserPlus className="mr-2 h-4 w-4" />
              Co-author Invitations
            </Button>
          </>
        )}
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
        
        {/* Invite and Report options */}
        <div className="pt-4 border-t space-y-2">
          {/* Always show "Invite a Researcher" for all user types */}
          <InviteModal 
            userType="researcher"
            triggerText="Invite a Researcher"
          />
          
          {/* Always show "Invite a Student" for all user types */}
          <InviteModal 
            userType="student"
            triggerText="Invite a Student"
          />
          
          {/* Misconduct Reporting */}
          <MisconductReportModal />
        </div>
      </nav>
    </div>
  );
};

export default DashboardSidebar;
