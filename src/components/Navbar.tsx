
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from "@/components/ui/badge";
import { useAuth } from '@/hooks/useAuth';
import { useNotifications } from '@/hooks/useNotifications'; // Import useNotifications
import LanguageToggle from './LanguageToggle';
import GetStartedModal from './GetStartedModal';
import ResearchWhoaLogo from './ResearchWhoaLogo';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { 
  Menu,
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

const Navbar = ({setActiveTab, activeTab}) => {
  const { user, profile, signOut } = useAuth();
  const { unreadCount } = useNotifications(); // Use the hook to get unreadCount
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const getDashboardLink = () => {
    if (!profile?.role) return '/dashboard';
    
    switch (profile.role) {
      case 'expert':
        return '/researcher-dashboard';
      case 'aid':
        return '/research-aids-dashboard';
      case 'student':
        return '/dashboard';
      default:
        return '/dashboard';
    }
  };

  // Sidebar menu items - same as ResponsiveDashboardSidebar
  const getSidebarMenuItems = () => {
    if (!profile?.role) return [];

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
      { id: "notifications", label: "Notifications", icon: Bell, badge: unreadCount },
      { id: "thesis-information", label: "Thesis Information", icon: BookOpen },
      { id: "documents", label: "Documents", icon: FileText },
      { id: "settings", label: "Account Settings", icon: Settings },
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
      { id: "notifications", label: "Notifications", icon: Bell, badge: unreadCount },
      { id: "documents", label: "Documents", icon: FileText },
      { id: "settings", label: "Account Settings", icon: Settings },
    ];

    const researchAideMenuItems = [
      { id: "overview", label: "Overview", icon: LayoutDashboard },
      { id: "job-applications", label: "Job Applications", icon: Briefcase },
      { id: "current-jobs", label: "Current Jobs", icon: Clock },
      { id: "completed-jobs", label: "Completed Jobs", icon: Calendar },
      { id: "messages", label: "Messages", icon: MessageSquare },
      { id: "notifications", label: "Notifications", icon: Bell, badge: unreadCount },
      { id: "documents", label: "Documents", icon: FileText },
      { id: "profile", label: "Profile Information", icon: User },
      { id: "settings", label: "Account Settings", icon: Settings },
    ];

    switch (profile.role) {
      case "student":
        return studentMenuItems;
      case "expert":
        return researcherMenuItems;
      case "aid":
        return researchAideMenuItems;
      default:
        return studentMenuItems;
    }
  };


  const handleMenuClick = (itemId: string) => {
    console.log("Sidebar menu item clicked:", itemId);
    setIsMobileMenuOpen(false);
    setActiveTab(itemId);
  };  // Sidebar content component

  const handleSidebarTabClick = (tabId: string) => {
    const dashboardUrl = getDashboardLink();
    setIsMobileMenuOpen(false);
    // Use React Router navigation instead of window.location
    navigate(`${dashboardUrl}?tab=${tabId}`);
  };

  const getNavigationItems = () => {
    if (!user || !profile) {
      return null;
    }

    switch (profile.role) {
      case 'student':
        return (
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/researchers" className="text-gray-600 hover:text-gray-900 transition-colors">
              Researchers
            </Link>
            <Link to="/research-aids" className="text-gray-600 hover:text-gray-900 transition-colors">
              Research Aids
            </Link>
            <Link to="/dashboard" className="text-gray-600 hover:text-gray-900 transition-colors">
              Dashboard
            </Link>
            <Link to="/dashboard?tab=notifications" className="text-gray-600 hover:text-gray-900 transition-colors relative">
              Notifications {unreadCount > 0 && <span className="absolute -top-2 -right-4 bg-red-500 text-white text-xs px-2 py-1 rounded-full">{unreadCount}</span>}
            </Link>
          </div>
        );
      
      case 'expert':
        return (
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/researchers" className="text-gray-600 hover:text-gray-900 transition-colors">
              Researchers
            </Link>
            <Link to="/research-aids" className="text-gray-600 hover:text-gray-900 transition-colors">
              Research Aids
            </Link>
            <Link to="/researcher-dashboard" className="text-gray-600 hover:text-gray-900 transition-colors">
              Dashboard
            </Link>
            <Link to="/researcher-dashboard?tab=notifications" className="text-gray-600 hover:text-gray-900 transition-colors relative">
              Notifications {unreadCount > 0 && <span className="absolute -top-2 -right-4 bg-red-500 text-white text-xs px-2 py-1 rounded-full">{unreadCount}</span>}
            </Link>
          </div>
        );
      
      case 'aid':
        return (
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/job-board" className="text-gray-600 hover:text-gray-900 transition-colors">
              Browse Job Board
            </Link>
            <Link to="/job-board" className="text-gray-600 hover:text-gray-900 transition-colors">
              View All Jobs
            </Link>
            <Link to="/research-aids-dashboard" className="text-gray-600 hover:text-gray-900 transition-colors">
              Dashboard
            </Link>
            <Link to="/research-aids-dashboard?tab=notifications" className="text-gray-600 hover:text-gray-900 transition-colors relative">
              Notifications {unreadCount > 0 && <span className="absolute -top-2 -right-4 bg-red-500 text-white text-xs px-2 py-1 rounded-full">{unreadCount}</span>}
            </Link>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16">
          <Link 
            to="/" 
            className="flex items-center"
            state={{ fromNavigation: true }}
          >
            <ResearchWhoaLogo size="md" showText={true} />
          </Link>

          

          <div className="flex items-center space-x-4">
            <LanguageToggle />
            
            {/* Mobile hamburger menu with comprehensive sidebar */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="md:hidden"
                >
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[320px] p-0 overflow-y-auto">
                <div className="p-6">
                  <div className="mb-6">
                    <ResearchWhoaLogo size="sm" showText={true} />
                  </div>
                  
                 
                  {/* Main Navigation Links */}
                  {user && profile && (
                    <>
                    

                      {/* Dashboard Sidebar Menu Items */}
                      <div className="space-y-1">
                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                          Dashboard
                        </h3>
                        
                        {getSidebarMenuItems().map((item) => (
                          <Button
                            key={item.id}
                            variant={activeTab === item.id ? "default" : "ghost"}
                            className="w-full justify-start text-sm py-2 px-3 h-auto"
                            onClick={() => handleMenuClick(item.id)}
                          >
                            <item.icon className="mr-3 h-4 w-4 flex-shrink-0" />
                            <span className="flex-1 text-left truncate">{item.label}</span>
                            {item.badge && item.badge > 0 && (
                              <Badge variant="secondary" className="ml-auto text-xs">
                                {item.badge}
                              </Badge>
                            )}
                          </Button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
                 {/* Sign In and Get Started buttons */}
                  {!user ? (
                    <div className="space-y-3 mb-6 pb-4 border-b">
                      <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                        <Button variant="outline" className="w-full">
                          Sign In
                        </Button>
                      </Link>
                      <GetStartedModal>
                        <Button className="w-full" onClick={() => setIsMobileMenuOpen(false)}>
                          Get Started
                        </Button>
                      </GetStartedModal>
                    </div>
                  ) : (
                    <div className="space-y-3 mb-6 pb-4 border-b">
                      <Link to={getDashboardLink()} onClick={() => setIsMobileMenuOpen(false)}>
                        <Button variant="outline" className="w-full">
                          Go to Dashboard
                        </Button>
                      </Link>
                      <Button 
                        onClick={() => {
                          handleSignOut();
                          setIsMobileMenuOpen(false);
                        }} 
                        variant="ghost" 
                        className="w-full"
                      >
                        Sign Out
                      </Button>
                    </div>
                  )}

              </SheetContent>
            </Sheet>
            
            {/* Desktop Sign In/Get Started buttons - show only on larger screens for unauthenticated users */}
            {!user && (
              <div className="hidden md:flex items-center space-x-4">
                <Link to="/login">
                  <Button variant="outline">Sign In</Button>
                </Link>
                <GetStartedModal>
                  <Button>Get Started</Button>
                </GetStartedModal>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
