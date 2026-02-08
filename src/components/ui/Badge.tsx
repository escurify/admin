import { clsx } from 'clsx';

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'purple' | 'orange';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-gray-100 text-gray-700',
  success: 'bg-green-100 text-green-700',
  warning: 'bg-amber-100 text-amber-700',
  danger: 'bg-red-100 text-red-700',
  info: 'bg-blue-100 text-blue-700',
  purple: 'bg-purple-100 text-purple-700',
  orange: 'bg-orange-100 text-orange-700',
};

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span
      className={clsx(
        'badge',
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

// Helper function to get status badge variant
export function getStatusBadgeVariant(status: string): BadgeVariant {
  switch (status) {
    case 'APPROVED':
    case 'VERIFIED':
    case 'COMPLETED':
    case 'RESOLVED':
    case 'FULFILLED':
      return 'success';
    case 'PENDING':
    case 'UNDER_REVIEW':
    case 'PENDING_PAYMENT':
    case 'DISPATCHED':
      return 'warning';
    case 'REJECTED':
    case 'FAILED':
    case 'DISPUTED':
    case 'CANCELLED':
      return 'danger';
    case 'NOT_STARTED':
    case 'CREATED':
    case 'JOINED':
      return 'info';
    case 'PAID':
    case 'READY_FOR_PAYOUT':
      return 'success';
    case 'PAYOUT_INITIATED':
      return 'purple';
    case 'REFUNDED':
      return 'warning';
    case 'SPLIT_SETTLED':
      return 'orange';
    default:
      return 'default';
  }
}
