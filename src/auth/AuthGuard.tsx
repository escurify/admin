import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { canAccessRoute } from './permissions';

export function AuthGuard() {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check route-level permissions
  if (!canAccessRoute(user?.role, location.pathname)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
