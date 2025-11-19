import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, LayoutDashboard } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const BackToDashboard = ({ className = "" }: { className?: string }) => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  // If user is not authenticated, don't show the button
  if (!user || !profile) {
    return null;
  }

  // Determine the correct dashboard URL based on user role
  const getDashboardUrl = () => {
    switch (profile.role) {
      case 'student':
        return '/dashboard';
      case 'expert':
        return '/researcher-dashboard';
      case 'aid':
        return '/research-aids-dashboard';
      case 'admin':
        return '/admin';
      default:
        return '/dashboard';
    }
  };

  const handleBackClick = () => {
    navigate(getDashboardUrl());
  };

  return (
    <div className={`mb-6 ${className}`}>
      <Button
        onClick={handleBackClick}
        variant="outline"
        className="flex items-center gap-2 hover:bg-blue-50 hover:border-blue-300 transition-colors text-blue-600 hover:text-blue-700"
      >
        <ArrowLeft className="h-4 w-4" />
        <LayoutDashboard className="h-4 w-4" />
        Back to Dashboard
      </Button>
    </div>
  );
};

export default BackToDashboard;
