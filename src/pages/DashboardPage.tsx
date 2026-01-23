import { useAuth } from '@/auth';
import { Users, FileCheck, AlertTriangle, Ban } from 'lucide-react';
import { Link } from 'react-router-dom';

interface QuickLinkCardProps {
  title: string;
  description: string;
  icon: React.ElementType;
  href: string;
  color: string;
}

function QuickLinkCard({ title, description, icon: Icon, href, color }: QuickLinkCardProps) {
  return (
    <Link
      to={href}
      className="card p-6 hover:shadow-md transition-shadow group"
    >
      <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center mb-4`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
        {title}
      </h3>
      <p className="text-sm text-gray-500 mt-1">{description}</p>
    </Link>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();

  const quickLinks = [
    {
      title: 'Pending KYC',
      description: 'Review and approve seller KYC applications',
      icon: FileCheck,
      href: '/kyc/pending',
      color: 'bg-blue-500',
    },
    {
      title: 'Search Users',
      description: 'Find users by phone number and manage accounts',
      icon: Users,
      href: '/users/search',
      color: 'bg-green-500',
    },
    {
      title: 'Blocked Users',
      description: 'View and manage blocked user accounts',
      icon: Ban,
      href: '/users/blocked',
      color: 'bg-red-500',
    },
    {
      title: 'Disputed Transactions',
      description: 'Handle transaction disputes and resolutions',
      icon: AlertTriangle,
      href: '/transactions/disputed',
      color: 'bg-amber-500',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.username}
        </h1>
        <p className="text-gray-500 mt-1">
          Here's an overview of what needs your attention today.
        </p>
      </div>

      {/* Role Badge */}
      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary-50 text-primary-700 rounded-full text-sm font-medium">
        <span className="w-2 h-2 rounded-full bg-primary-500" />
        {user?.role?.toUpperCase()}
      </div>

      {/* Quick Links */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickLinks.map((link) => (
            <QuickLinkCard key={link.href} {...link} />
          ))}
        </div>
      </div>
    </div>
  );
}
