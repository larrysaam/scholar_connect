import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import LoadingSpinner from '@/components/LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'student' | 'researcher' | 'aid' | 'admin';
}

const dashboardRoleMap: Record<string, string> = {
  '/admin': 'admin',
  '/research-aids-dashboard': 'aid',
  '/researcher-dashboard': 'researcher',
  '/dashboard': 'student',
};

function getDashboardPath(role: string) {
  switch (role) {
    case 'admin': return '/admin';
    case 'aid': return '/research-aids-dashboard';
    case 'researcher': return '/researcher-dashboard';
    case 'student': return '/dashboard';
    default: return '/login';
  }
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        const loginPath = requiredRole === 'admin' ? '/admin/login' : '/login';
        navigate(loginPath);
        return;
      }
      
      if (profile) {
        // Find which dashboard this route is for
        const matched = Object.entries(dashboardRoleMap).find(([path]) => location.pathname.startsWith(path));
        if (matched) {
          const required = matched[1];
          if (profile.role !== required) {
            // Redirect to correct dashboard
            navigate(getDashboardPath(profile.role), { replace: true });
            return;
          }
        }
        
        // If requiredRole is set, enforce it
        if (requiredRole && profile.role !== requiredRole) {
          navigate(getDashboardPath(profile.role), { replace: true });
          return;
        }
      }
    }
  }, [user, profile, loading, navigate, requiredRole, location]);

  if (loading || (user && !profile)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (user && (!requiredRole || profile?.role === requiredRole)) {
    return <>{children}</>;
  }

  return null;
};

export default ProtectedRoute;
