import { useState } from 'react';
import { Search, ArrowRightLeft } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Table } from '@/components/ui/Table';
import { Pagination } from '@/components/ui/Pagination';
import { Badge, getStatusBadgeVariant } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { useSearchTransactions } from '../hooks/useTransactions';
import { TransactionDetailsDrawer } from '../components/TransactionDetailsDrawer';
import type { TransactionSearchResult } from '@/types';
import { format } from 'date-fns';

type SearchType = 'code' | 'buyerPhone' | 'sellerPhone';

export default function SearchTransactionsPage() {
  const [searchType, setSearchType] = useState<SearchType>('code');
  const [searchValue, setSearchValue] = useState('');
  const [activeSearch, setActiveSearch] = useState<{ type: SearchType; value: string } | null>(null);
  const [page, setPage] = useState(1);
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionSearchResult | null>(null);

  const searchParams = activeSearch
    ? {
        [activeSearch.type]: activeSearch.value,
        page,
      }
    : {};

  const { data, isLoading, isFetching } = useSearchTransactions(searchParams);

  const handleSearch = () => {
    if (!searchValue.trim()) return;
    setActiveSearch({ type: searchType, value: searchValue.trim() });
    setPage(1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const columns = [
    {
      key: 'txnCode',
      header: 'Code',
      render: (item: TransactionSearchResult) => (
        <span className="font-mono text-sm text-primary-600">{item.txnCode}</span>
      ),
    },
    {
      key: 'title',
      header: 'Title',
      render: (item: TransactionSearchResult) => (
        <div className="max-w-xs">
          <p className="font-medium text-gray-900 truncate">{item.title}</p>
        </div>
      ),
    },
    {
      key: 'amount',
      header: 'Amount',
      render: (item: TransactionSearchResult) => (
        <span className="font-medium text-gray-900">₹{item.amount.toLocaleString()}</span>
      ),
    },
    {
      key: 'buyer',
      header: 'Buyer',
      render: (item: TransactionSearchResult) => (
        <div>
          <p className="text-gray-900">{item.buyer?.name || '-'}</p>
          <p className="text-xs text-gray-500">{item.buyer?.phone}</p>
        </div>
      ),
    },
    {
      key: 'seller',
      header: 'Seller',
      render: (item: TransactionSearchResult) => (
        <div>
          <p className="text-gray-900">{item.seller?.name || '-'}</p>
          <p className="text-xs text-gray-500">{item.seller?.phone}</p>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (item: TransactionSearchResult) => (
        <Badge variant={getStatusBadgeVariant(item.status)}>{item.status}</Badge>
      ),
    },
    {
      key: 'createdAt',
      header: 'Created',
      render: (item: TransactionSearchResult) => (
        <span className="text-gray-500 text-xs">
          {format(new Date(item.createdAt), 'MMM dd, yyyy')}
        </span>
      ),
    },
  ];

  const searchTypes: { value: SearchType; label: string; placeholder: string }[] = [
    { value: 'code', label: 'Transaction Code', placeholder: 'Enter transaction code' },
    { value: 'buyerPhone', label: 'Buyer Phone', placeholder: 'Enter buyer phone number' },
    { value: 'sellerPhone', label: 'Seller Phone', placeholder: 'Enter seller phone number' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Search Transactions</h1>
        <p className="text-gray-500 mt-1">Find transactions by code or phone number</p>
      </div>

      {/* Search */}
      <div className="card p-6 space-y-4">
        {/* Search Type Tabs */}
        <div className="flex gap-2">
          {searchTypes.map((type) => (
            <button
              key={type.value}
              onClick={() => setSearchType(type.value)}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                searchType === type.value
                  ? 'bg-primary-100 text-primary-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="flex gap-4">
          <div className="flex-1">
            <Input
              placeholder={searchTypes.find((t) => t.value === searchType)?.placeholder}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={handleKeyDown}
              leftIcon={<Search className="w-5 h-5" />}
            />
          </div>
          <Button onClick={handleSearch} loading={isFetching}>
            Search
          </Button>
        </div>
      </div>

      {/* Results */}
      <div className="card">
        {!activeSearch ? (
          <EmptyState
            icon={ArrowRightLeft}
            title="Search for transactions"
            message="Enter a transaction code or phone number above to search"
          />
        ) : !isLoading && data?.transactions.length === 0 ? (
          <EmptyState
            icon={ArrowRightLeft}
            title="No transactions found"
            message="Try a different search term"
          />
        ) : (
          <>
            <Table
              columns={columns}
              data={data?.transactions || []}
              keyExtractor={(item) => item.id}
              onRowClick={(item) => setSelectedTransaction(item)}
              isLoading={isLoading}
              emptyMessage="No transactions found"
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
