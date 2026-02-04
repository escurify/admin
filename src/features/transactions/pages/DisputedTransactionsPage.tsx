import { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Table } from '@/components/ui/Table';
import { Pagination } from '@/components/ui/Pagination';
import { Badge, getStatusBadgeVariant } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { useDisputedTransactions } from '../hooks/useTransactions';
import { TransactionDetailsDrawer } from '../components/TransactionDetailsDrawer';
import type { DisputedTransaction } from '@/types';
import { format } from 'date-fns';

// Helper to format dispute reason enum keys to display labels
const DISPUTE_REASON_LABELS: Record<string, string> = {
  ITEM_NOT_RECEIVED: 'Item Not Received',
  ITEM_NOT_AS_DESCRIBED: 'Item Not As Described',
  DAMAGED_ITEM: 'Damaged Item',
  WRONG_ITEM: 'Wrong Item',
  PAYMENT_ISSUE: 'Payment Issue',
  OTHER: 'Other',
};

function formatDisputeReason(reason: string | undefined): string {
  if (!reason) return '-';
  return DISPUTE_REASON_LABELS[reason] || reason.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
}

export default function DisputedTransactionsPage() {
  const [page, setPage] = useState(1);
  const [selectedTransaction, setSelectedTransaction] = useState<DisputedTransaction | null>(null);

  const { data, isLoading } = useDisputedTransactions(page);

  const columns = [
    {
      key: 'txnCode',
      header: 'Code',
      render: (item: DisputedTransaction) => (
        <span className="font-mono text-sm text-primary-600">{item.txnCode}</span>
      ),
    },
    {
      key: 'title',
      header: 'Title',
      render: (item: DisputedTransaction) => (
        <div className="max-w-xs">
          <p className="font-medium text-gray-900 truncate">{item.title}</p>
        </div>
      ),
    },
    {
      key: 'amount',
      header: 'Amount',
      render: (item: DisputedTransaction) => (
        <span className="font-medium text-gray-900">₹{item.amount.toLocaleString()}</span>
      ),
    },
    {
      key: 'buyer',
      header: 'Buyer',
      render: (item: DisputedTransaction) => (
        <div>
          <p className="text-gray-900">{item.buyer?.name || '-'}</p>
          <p className="text-xs text-gray-500">{item.buyer?.phone}</p>
        </div>
      ),
    },
    {
      key: 'seller',
      header: 'Seller',
      render: (item: DisputedTransaction) => (
        <div>
          <p className="text-gray-900">{item.seller?.name || '-'}</p>
          <p className="text-xs text-gray-500">{item.seller?.phone}</p>
        </div>
      ),
    },
    {
      key: 'disputeReason',
      header: 'Reason',
      render: (item: DisputedTransaction) => (
        <span className="text-gray-600 text-sm max-w-xs truncate block">
          {formatDisputeReason(item.disputeReason)}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (item: DisputedTransaction) => (
        <Badge variant={getStatusBadgeVariant(item.status)}>{item.status}</Badge>
      ),
    },
    {
      key: 'disputedAt',
      header: 'Disputed',
      render: (item: DisputedTransaction) => (
        <span className="text-gray-500 text-xs">
          {item.disputedAt ? format(new Date(item.disputedAt), 'MMM dd, yyyy') : '-'}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Disputed Transactions</h1>
        <p className="text-gray-500 mt-1">Review and resolve transaction disputes</p>
      </div>

      {/* Table */}
      <div className="card">
        {!isLoading && data?.transactions.length === 0 ? (
          <EmptyState
            icon={AlertTriangle}
            title="No disputed transactions"
            message="There are no disputed transactions at the moment. Great job keeping things smooth!"
          />
        ) : (
          <>
            <Table
              columns={columns}
              data={data?.transactions || []}
              keyExtractor={(item) => item.id}
              onRowClick={(item) => setSelectedTransaction(item)}
              isLoading={isLoading}
              emptyMessage="No disputed transactions found"
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
      <TransactionDetailsDrawer
        transaction={selectedTransaction}
        onClose={() => setSelectedTransaction(null)}
      />
    </div>
  );
}
