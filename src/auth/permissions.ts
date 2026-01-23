import type { AdminRole } from '@/types';

export type Permission =
  | 'kyc:view'
  | 'kyc:update'
  | 'kyc:approve'
  | 'user:view'
  | 'user:update'
  | 'user:block'
  | 'user:delete'
  | 'transaction:view'
  | 'transaction:action';

const ROLE_PERMISSIONS: Record<AdminRole, Permission[]> = {
  superadmin: [
    'kyc:view',
    'kyc:update',
    'kyc:approve',
    'user:view',
    'user:update',
    'user:block',
    'user:delete',
    'transaction:view',
    'transaction:action',
  ],
  admin: [
    'kyc:view',
    'kyc:update',
    'kyc:approve',
    'user:view',
    'user:update',
    'user:block',
    'transaction:view',
    'transaction:action',
  ],
  support: ['kyc:view', 'user:view', 'transaction:view'],
  viewer: ['kyc:view', 'user:view', 'transaction:view'],
};

export const hasPermission = (role: AdminRole | undefined, permission: Permission): boolean => {
  if (!role) return false;
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
};

export const canAccessRoute = (role: AdminRole | undefined, route: string): boolean => {
  if (!role) return false;

  const routePermissions: Record<string, Permission[]> = {
    '/kyc/pending': ['kyc:view'],
    '/users/search': ['user:view'],
    '/users/blocked': ['user:view'],
    '/transactions/search': ['transaction:view'],
    '/transactions/disputed': ['transaction:view'],
  };

  const requiredPermissions = routePermissions[route];
  if (!requiredPermissions) return true; // No specific permission needed

  return requiredPermissions.some((p) => hasPermission(role, p));
};
