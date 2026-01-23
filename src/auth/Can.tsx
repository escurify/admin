import { ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { hasPermission, Permission } from './permissions';

interface CanProps {
  permission: Permission;
  children: ReactNode;
  fallback?: ReactNode;
}

export function Can({ permission, children, fallback = null }: CanProps) {
  const { user } = useAuth();

  if (!hasPermission(user?.role, permission)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
