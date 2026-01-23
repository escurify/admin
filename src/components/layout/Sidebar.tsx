import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FileCheck,
  Users,
  Ban,
  AlertTriangle,
  Search,
  Shield,
} from 'lucide-react';
import { useAuth } from '@/auth';
import { hasPermission, Permission } from '@/auth/permissions';
import { clsx } from 'clsx';

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  permission?: Permission;
}

const navItems: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/',
    icon: LayoutDashboard,
  },
  {
    label: 'Pending KYC',
    href: '/kyc/pending',
    icon: FileCheck,
    permission: 'kyc:view',
  },
  {
    label: 'Search Users',
    href: '/users/search',
    icon: Search,
    permission: 'user:view',
  },
  {
    label: 'Blocked Users',
    href: '/users/blocked',
    icon: Ban,
    permission: 'user:view',
  },
  {
    label: 'Disputed Transactions',
    href: '/transactions/disputed',
    icon: AlertTriangle,
    permission: 'transaction:view',
  },
  {
    label: 'Search Transactions',
    href: '/transactions/search',
    icon: Users,
    permission: 'transaction:view',
  },
];

export function Sidebar() {
  const { user } = useAuth();

  const visibleItems = navItems.filter(
    (item) => !item.permission || hasPermission(user?.role, item.permission)
  );

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 z-40">
      {/* Logo */}
      <div className="h-16 flex items-center gap-3 px-6 border-b border-gray-200">
        <div className="w-9 h-9 bg-primary-600 rounded-lg flex items-center justify-center">
          <Shield className="w-5 h-5 text-white" />
        </div>
        <div>
          <span className="font-bold text-gray-900">Escurify</span>
          <span className="text-xs text-gray-500 block -mt-0.5">Admin</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-1">
        {visibleItems.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            end={item.href === '/'}
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              )
            }
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
