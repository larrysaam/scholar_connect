
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useNotifications } from '@/hooks/useNotifications'; // Import useNotifications
import LanguageToggle from './LanguageToggle';
import GetStartedModal from './GetStartedModal';
import ResearchWhoaLogo from './ResearchWhoaLogo';

const Navbar = () => {
  const { user, profile, signOut } = useAuth();
  const { unreadCount } = useNotifications(); // Use the hook to get unreadCount
  const navigate = useNavigate();

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

          {getNavigationItems()}

          <div className="flex items-center space-x-4">
            <LanguageToggle />
            {user ? (
              <div className="flex items-center space-x-4">
                <Link to={getDashboardLink()}>
                  <Button variant="outline">Get Started</Button>
                </Link>
                <Button onClick={handleSignOut} variant="ghost">
                  Sign In
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
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
