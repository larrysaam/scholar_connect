import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from "@/components/ui/badge";
import { useAuth } from '@/hooks/useAuth';
import { useNotifications } from '@/hooks/useNotifications'; // Import useNotifications
import { useLanguage } from '@/contexts/LanguageContext';
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

const Navbar = ({setActiveTab, activeTab}: {setActiveTab?: any; activeTab?: any}) => {
  const { user, profile, signOut } = useAuth();
  const { unreadCount } = useNotifications(); // Use the hook to get unreadCount
  const { t } = useLanguage();
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
      case 'admin':
        return '/admin';
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
      { id: "overview", label: t("overview"), icon: LayoutDashboard },
      { id: "ai-assistant", label: t("aiAssistant"), icon: MessageSquare },
      { id: "find-researcher", label: t("findResearcher"), icon: Search },
      { id: "find-research-aid", label: t("findResearchAid"), icon: Users },
      { id: "post-job", label: t("postJob"), icon: Briefcase },
      { id: "my-bookings", label: t("myBookings"), icon: Calendar },
      { id: "upcoming", label: t("upcomingSessions"), icon: Calendar },
      { id: "past", label: t("pastSessions"), icon: Clock },
      { id: "discussion", label: "Discussion Forum", icon: MessageSquare },
      { id: "full-thesis-support", label: t("fullThesisSupport"), icon: GraduationCap },
      { id: "payments", label: t("payments"), icon: DollarSign },
      { id: "messages", label: t("messages"), icon: MessageSquare },
      { id: "notifications", label: t("notifications"), icon: Bell, badge: unreadCount },
      { id: "thesis-information", label: t("thesisInformation"), icon: BookOpen },
      { id: "documents", label: t("documents"), icon: FileText },
      { id: "settings", label: t("accountSettings"), icon: Settings },
    ];

    const researcherMenuItems = [
      { id: "overview", label: t("overview"), icon: LayoutDashboard },
      { id: "consultation-services", label: t("consultationServices"), icon: MessageSquare },
      { id: "upcoming", label: t("upcomingSessions"), icon: Calendar },
      { id: "past", label: t("pastSessions"), icon: Clock },
      { id: "full-thesis-support", label: t("thesisSupport"), icon: GraduationCap },
      { id: "payments", label: t("paymentsEarnings"), icon: DollarSign },
      { id: "quality", label: t("qualityFeedback"), icon: Star },
      { id: "messaging", label: t("messaging"), icon: MessageSquare },
      { id: "verification", label: t("verification"), icon: Shield },
      { id: "notifications", label: t("notifications"), icon: Bell, badge: unreadCount },
      { id: "documents", label: t("documents"), icon: FileText },
      { id: "settings", label: t("accountSettings"), icon: Settings },
    ];

    const researchAideMenuItems = [
      { id: "overview", label: t("dashboardOverview"), icon: LayoutDashboard },
      { id: "job-requests", label: t("jobRequests"), icon: Briefcase },
      { id: "discussion", label: "Discussion Forum", icon: MessageSquare },
      { id: "messages", label: t("messages"), icon: MessageSquare },
      { id: "appointments", label: t("appointments"), icon: Calendar },
      { id: "files-deliverables", label: t("filesDeliverables"), icon: FileText },
      { id: "payments-earnings", label: t("paymentsEarnings"), icon: DollarSign },
      { id: "previous-works", label: t("previousWorks"), icon: FileText },
      { id: "notifications", label: t("notifications"), icon: Bell, badge: unreadCount },
      { id: "quality-feedback", label: t("qualityFeedback"), icon: Star },
      { id: "verification", label: t("verification"), icon: Shield },
      { id: "profile-ratings", label: t("profileRatings"), icon: User },
      { id: "settings", label: t("settings"), icon: Settings },
    ];

    const adminMenuItems = [
      { id: "dashboard", label: "Dashboard Overview", icon: LayoutDashboard },
      { id: "users", label: "User Management", icon: Users },
      { id: "consultations", label: "Consultation Management", icon: Calendar },
      { id: "tasks", label: "Task Orders", icon: Briefcase },
      { id: "payments", label: "Payments & Transactions", icon: DollarSign },
      { id: "content", label: "Content Management", icon: FileText },
      { id: "reports", label: "Reports & Analytics", icon: TrendingUp },
      { id: "membership", label: "Membership & VIP", icon: Star },
      { id: "support", label: "Support & Feedback", icon: MessageSquare },
      { id: "security", label: "Security & Compliance", icon: Shield },
      { id: "verification", label: "Verification Management", icon: Shield }
    ];

    switch (profile.role) {
      case "student":
        return studentMenuItems;
      case "expert":
        return researcherMenuItems;
      case "aid":
        return researchAideMenuItems;
      case "admin":
        return adminMenuItems;
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
              {t("navigation.researchers")}
            </Link>
            <Link to="/research-aids" className="text-gray-600 hover:text-gray-900 transition-colors">
              {t("navigation.researchAids")}
            </Link>
            <Link to="/dashboard" className="text-gray-600 hover:text-gray-900 transition-colors">
              {t("navigation.dashboard")}
            </Link>
            <Link to="/dashboard?tab=notifications" className="text-gray-600 hover:text-gray-900 transition-colors relative">
              {t("navigation.notifications")} {unreadCount > 0 && <span className="absolute -top-2 -right-4 bg-red-500 text-white text-xs px-2 py-1 rounded-full">{unreadCount}</span>}
            </Link>
          </div>
        );
      
      case 'expert':
        return (
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/researchers" className="text-gray-600 hover:text-gray-900 transition-colors">
              {t("navigation.researchers")}
            </Link>
            <Link to="/research-aids" className="text-gray-600 hover:text-gray-900 transition-colors">
              {t("navigation.researchAids")}
            </Link>
            <Link to="/researcher-dashboard" className="text-gray-600 hover:text-gray-900 transition-colors">
              {t("navigation.dashboard")}
            </Link>
            <Link to="/researcher-dashboard?tab=notifications" className="text-gray-600 hover:text-gray-900 transition-colors relative">
              {t("navigation.notifications")} {unreadCount > 0 && <span className="absolute -top-2 -right-4 bg-red-500 text-white text-xs px-2 py-1 rounded-full">{unreadCount}</span>}
            </Link>
          </div>
        );
      
      case 'aid':
        return (
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/job-board" className="text-gray-600 hover:text-gray-900 transition-colors">
              {t("navigation.browseJobBoard")}
            </Link>
            <Link to="/job-board" className="text-gray-600 hover:text-gray-900 transition-colors">
              {t("navigation.viewAllJobs")}
            </Link>
            <Link to="/research-aids-dashboard" className="text-gray-600 hover:text-gray-900 transition-colors">
              {t("navigation.dashboard")}
            </Link>
            <Link to="/research-aids-dashboard?tab=notifications" className="text-gray-600 hover:text-gray-900 transition-colors relative">
              {t("navigation.notifications")} {unreadCount > 0 && <span className="absolute -top-2 -right-4 bg-red-500 text-white text-xs px-2 py-1 rounded-full">{unreadCount}</span>}
            </Link>
          </div>
        );
      
      case 'admin':
        return (
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/admin" className="text-gray-600 hover:text-gray-900 transition-colors">
              Admin Dashboard
            </Link>
            <Link to="/admin?tab=users" className="text-gray-600 hover:text-gray-900 transition-colors">
              Users
            </Link>
            <Link to="/admin?tab=consultations" className="text-gray-600 hover:text-gray-900 transition-colors">
              Consultations
            </Link>
            <Link to="/admin?tab=reports" className="text-gray-600 hover:text-gray-900 transition-colors">
              Reports
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
            <ResearchWhoaLogo size="lg" showText={true} color='black'/>
          </Link>

          

          <div className="flex items-center space-x-4">
            <LanguageToggle />
            {/* Desktop Sign Out button for authenticated users */}
            {user && (
              <Button
                onClick={handleSignOut}
                variant="outline"
                className="hidden md:inline-flex bg-red-400 text-white hover:bg-red-500 hover:text-white transition-colors"
              >
                {t("Sign Out")}
              </Button>
            )}
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
                          {t("title")}
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
                          {t("SignIn")}
                        </Button>
                      </Link>
                      <GetStartedModal>
                        <Button className="w-full" onClick={() => setIsMobileMenuOpen(false)}>
                          {t("GetStarted")}
                        </Button>
                      </GetStartedModal>
                    </div>
                  ) : (
                    <div className="space-y-3 mb-6 pb-4 border-b">
                      <Link to={getDashboardLink()} onClick={() => setIsMobileMenuOpen(false)}>
                        <Button variant="outline" className="w-full">
                          {t("navigation.goToDashboard")}
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
                        {t("signOut")}
                      </Button>
                    </div>
                  )}

              </SheetContent>
            </Sheet>
            
            {/* Desktop Sign In/Get Started buttons - show only on larger screens for unauthenticated users */}
            {!user && (
              <div className="hidden md:flex items-center space-x-4">
                <Link to="/login">
                  <Button variant="outline">{t("Sign In")}</Button>
                </Link>
                <GetStartedModal>
                  <Button>{t("Get Started")}</Button>
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
