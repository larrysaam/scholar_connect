
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSecureAuth } from '@/hooks/useSecureAuth';
import LoadingSpinner from '@/components/LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'student' | 'expert' | 'aid' | 'admin';
  requireAuth?: boolean; // New prop to make auth optional
}

const ProtectedRoute = ({ children, requiredRole, requireAuth = true }: ProtectedRouteProps) => {
  const { user, profile, loading } = useSecureAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && requireAuth) {
      if (!user) {
        navigate('/auth');
        return;
      }

      if (requiredRole && profile?.role !== requiredRole) {
        // Redirect to appropriate dashboard based on role
        if (profile?.role === 'expert') {
          navigate('/researcher-dashboard');
        } else if (profile?.role === 'aid') {
          navigate('/research-aids-dashboard');
        } else {
          navigate('/dashboard');
        }
      }
    }
  }, [user, profile, loading, navigate, requiredRole, requireAuth]);

  if (loading && requireAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user && requireAuth) {
    return null;
  }

  if (requiredRole && profile?.role !== requiredRole && requireAuth) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
