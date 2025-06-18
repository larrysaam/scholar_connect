
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import LanguageToggle from './LanguageToggle';

const Navbar = () => {
  const { user, profile, signOut } = useAuth();
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
      // No navigation menu for unauthenticated users on home page
      return null;
    }

    // Navigation based on user role
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
          </div>
        );
      
      case 'aid':
        return (
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/research-aids-dashboard" className="text-gray-600 hover:text-gray-900 transition-colors">
              Dashboard
            </Link>
            <Link to="/job-board" className="text-gray-600 hover:text-gray-900 transition-colors">
              Job Board
            </Link>
          </div>
        );
      
      default:
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
          </div>
        );
    }
  };

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">R</span>
            </div>
            <span className="font-bold text-xl text-gray-900">ResearchWhoa</span>
          </Link>

          {getNavigationItems()}

          <div className="flex items-center space-x-4">
            <LanguageToggle />
            {user ? (
              <div className="flex items-center space-x-4">
                <Link to={getDashboardLink()}>
                  <Button variant="outline">Dashboard</Button>
                </Link>
                <Button onClick={handleSignOut} variant="ghost">
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login">
                  <Button variant="outline">Sign In</Button>
                </Link>
                <Link to="/student-signup">
                  <Button>Get Started</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
