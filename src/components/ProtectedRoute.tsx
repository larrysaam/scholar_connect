
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import LoadingSpinner from '@/components/LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'student' | 'expert' | 'aid' | 'admin';
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // If trying to access a protected route, redirect to the appropriate login
        const loginPath = requiredRole === 'admin' ? '/admin/login' : '/login';
        navigate(loginPath);
        return;
      }

      // Only check for role and redirect if the profile is fully loaded
      if (profile && requiredRole && !profile.roles.includes(requiredRole)) {
        // Redirect to appropriate dashboard based on the user's actual role
        if (profile.roles.includes('admin')) {
          navigate('/admin');
        } else if (profile.roles.includes('expert')) {
          navigate('/researcher-dashboard');
        } else if (profile.roles.includes('aid')) {
          navigate('/research-aids-dashboard');
        } else {
          navigate('/dashboard');
        }
      }
    }
  }, [user, profile, loading, navigate, requiredRole]);

  // Show loading spinner while auth state or profile is loading
  if (loading || (user && !profile)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // If all checks pass, render the children
  if (user && (!requiredRole || profile?.roles.includes(requiredRole))) {
    return <>{children}</>;
  }

  // Fallback, should not be reached if logic is correct
  return null;
};

export default ProtectedRoute;
