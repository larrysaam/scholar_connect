
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
  CheckSquare,
  BarChart3,
  Briefcase,
  Mail,
  Upload,
  Star
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
        {/* Research Aid specific navigation */}
        {userType === "research-aide" && (
          <>
            <Button 
              variant={activeTab === "overview" ? "default" : "ghost"} 
              className="w-full justify-start" 
              onClick={() => setActiveTab("overview")}
            >
              <BarChart3 className="mr-2 h-4 w-4" />
              Dashboard Overview
            </Button>
            <Button 
              variant={activeTab === "job-requests" ? "default" : "ghost"} 
              className="w-full justify-start" 
              onClick={() => setActiveTab("job-requests")}
            >
              <Briefcase className="mr-2 h-4 w-4" />
              Job Requests
            </Button>
            <Button 
              variant={activeTab === "messages" ? "default" : "ghost"} 
              className="w-full justify-start" 
              onClick={() => setActiveTab("messages")}
            >
              <Mail className="mr-2 h-4 w-4" />
              Messages
            </Button>
            <Button 
              variant={activeTab === "appointments" ? "default" : "ghost"} 
              className="w-full justify-start" 
              onClick={() => setActiveTab("appointments")}
            >
              <Calendar className="mr-2 h-4 w-4" />
              Appointments
            </Button>
            <Button 
              variant={activeTab === "files-deliverables" ? "default" : "ghost"} 
              className="w-full justify-start" 
              onClick={() => setActiveTab("files-deliverables")}
            >
              <Upload className="mr-2 h-4 w-4" />
              Files & Deliverables
            </Button>
            <Button 
              variant={activeTab === "payments-earnings" ? "default" : "ghost"} 
              className="w-full justify-start" 
              onClick={() => setActiveTab("payments-earnings")}
            >
              <Banknote className="mr-2 h-4 w-4" />
              Payments & Earnings
            </Button>
            <Button 
              variant={activeTab === "profile-ratings" ? "default" : "ghost"} 
              className="w-full justify-start" 
              onClick={() => setActiveTab("profile-ratings")}
            >
              <Star className="mr-2 h-4 w-4" />
              My Profile & Ratings
            </Button>
          </>
        )}
        
        {/* Show tasks tab for research aids (legacy support) */}
        {userType === "research-aide" && (
          <Button 
            variant={activeTab === "tasks" ? "default" : "ghost"} 
            className="w-full justify-start" 
            onClick={() => setActiveTab("tasks")}
          >
            <CheckSquare className="mr-2 h-4 w-4" />
            Tasks (Legacy)
          </Button>
        )}
        
        {/* Standard navigation for other user types */}
        {userType !== "research-aide" && (
          <>
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
          </>
        )}
        
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
        
        {/* Standard navigation for all users */}
        {userType !== "research-aide" && (
          <>
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
          </>
        )}
        
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
