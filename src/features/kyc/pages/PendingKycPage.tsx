import { useState } from 'react';
import { Check, X, FileCheck } from 'lucide-react';
import { Table } from '@/components/ui/Table';
import { Pagination } from '@/components/ui/Pagination';
import { Badge, getStatusBadgeVariant } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { usePendingKycList } from '../hooks/useKyc';
import { KycDetailsDrawer } from '../components/KycDetailsDrawer';
import type { PendingKycSellerItem, KycStatus } from '@/types';
import { format } from 'date-fns';

const STATUS_FILTERS: { label: string; value: KycStatus | undefined }[] = [
  { label: 'All', value: undefined },
  { label: 'Not Started', value: 'NOT_STARTED' },
  { label: 'Pending', value: 'PENDING' },
  { label: 'Under Review', value: 'UNDER_REVIEW' },
  { label: 'Rejected', value: 'REJECTED' },
];

function StatusIcon({ verified }: { verified: boolean }) {
  return verified ? (
    <Check className="w-4 h-4 text-green-600" />
  ) : (
    <X className="w-4 h-4 text-gray-400" />
  );
}

export default function PendingKycPage() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<KycStatus | undefined>();
  const [selectedSeller, setSelectedSeller] = useState<PendingKycSellerItem | null>(null);

  const { data, isLoading } = usePendingKycList(page, statusFilter);

  const columns = [
    {
      key: 'name',
      header: 'Seller',
      render: (item: PendingKycSellerItem) => (
        <div>
          <p className="font-medium text-gray-900">{item.user.name}</p>
          <p className="text-xs text-gray-500">{item.user.phone}</p>
        </div>
      ),
    },
    {
      key: 'email',
      header: 'Email',
      render: (item: PendingKycSellerItem) => (
        <span className="text-gray-600">{item.user.email || '-'}</span>
      ),
    },
    {
      key: 'kycStatus',
      header: 'KYC Status',
      render: (item: PendingKycSellerItem) => (
        <Badge variant={getStatusBadgeVariant(item.kyc.kycStatus)}>
          {item.kyc.kycStatus}
        </Badge>
      ),
    },
    {
      key: 'basicDetails',
      header: 'Basic',
      render: (item: PendingKycSellerItem) => (
        <StatusIcon verified={item.kyc.basicDetailsSubmitted} />
      ),
    },
    {
      key: 'panVerified',
      header: 'PAN',
      render: (item: PendingKycSellerItem) => (
        <StatusIcon verified={item.kyc.panVerified} />
      ),
    },
    {
      key: 'bankVerified',
      header: 'Bank',
      render: (item: PendingKycSellerItem) => (
        <StatusIcon verified={item.kyc.bankVerified} />
      ),
    },
    {
      key: 'transactions',
      header: 'Txns',
      render: (item: PendingKycSellerItem) => (
        <span className="text-gray-600">{item.totalTransactions}</span>
      ),
    },
    {
      key: 'rating',
      header: 'Rating',
      render: (item: PendingKycSellerItem) => (
        <span className="text-gray-600">
          {item.averageRating > 0 ? `${item.averageRating.toFixed(1)} ⭐` : '-'}
        </span>
      ),
    },
    {
      key: 'createdAt',
      header: 'Created',
      render: (item: PendingKycSellerItem) => (
        <span className="text-gray-500 text-xs">
          {format(new Date(item.createdAt), 'MMM dd, yyyy')}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Pending KYC</h1>
        <p className="text-gray-500 mt-1">Review and manage seller KYC applications</p>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {STATUS_FILTERS.map((filter) => (
          <button
            key={filter.label}
            onClick={() => {
              setStatusFilter(filter.value);
              setPage(1);
            }}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
              statusFilter === filter.value
                ? 'bg-primary-100 text-primary-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="card">
        {!isLoading && data?.sellers.length === 0 ? (
          <EmptyState
            icon={FileCheck}
            title="No pending KYC applications"
            message="All KYC applications have been processed or there are none matching your filters."
          />
        ) : (
          <>
            <Table
              columns={columns}
              data={data?.sellers || []}
              keyExtractor={(item) => item.sellerId}
              onRowClick={(item) => setSelectedSeller(item)}
              isLoading={isLoading}
              emptyMessage="No sellers found"
            />
            {data?.pagination && (
              <Pagination
                currentPage={data.pagination.currentPage}
                totalPages={data.pagination.totalPages}
                totalCount={data.pagination.totalCount}
                onPageChange={setPage}
              />
            )}
          </>
        )}
      </div>

      {/* Details Drawer */}
      <KycDetailsDrawer
        seller={selectedSeller}
        onClose={() => setSelectedSeller(null)}
      />
    </div>
  );
}
