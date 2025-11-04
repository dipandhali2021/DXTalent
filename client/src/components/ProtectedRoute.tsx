import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  allowedRoles?: Array<'user' | 'recruiter' | 'admin'>;
}

const ProtectedRoute = ({
  children,
  requireAuth = true,
  allowedRoles,
}: ProtectedRouteProps) => {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 font-handwritten text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  // If route requires authentication and user is not authenticated
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  // If route is only for non-authenticated users (like login page)
  if (!requireAuth && isAuthenticated) {
    return <Navigate to="/profile" replace />;
  }

  // Check role-based access
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md text-center">
          <div className="text-6xl mb-4">🚫</div>
          <h1 className="text-3xl font-handwritten mb-2">Access Denied</h1>
          <p className="font-handwritten text-muted-foreground">
            You don't have permission to access this page.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
