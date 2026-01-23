import { useState } from 'react';
import { Ban, Check } from 'lucide-react';
import { Table } from '@/components/ui/Table';
import { Pagination } from '@/components/ui/Pagination';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { useBlockedUsers, useUnblockUser } from '../hooks/useUsers';
import { Can } from '@/auth';
import type { BlockedUserItem } from '@/types';
import { format } from 'date-fns';

export default function BlockedUsersPage() {
  const [page, setPage] = useState(1);
  const [unblockPhone, setUnblockPhone] = useState<string | null>(null);

  const { data, isLoading } = useBlockedUsers(page);
  const unblockUser = useUnblockUser();

  const handleUnblock = () => {
    if (!unblockPhone) return;
    unblockUser.mutate(unblockPhone, {
      onSuccess: () => setUnblockPhone(null),
    });
  };

  const columns = [
    {
      key: 'name',
      header: 'User',
      render: (item: BlockedUserItem) => (
        <div>
          <p className="font-medium text-gray-900">{item.name}</p>
          <p className="text-xs text-gray-500">{item.phone}</p>
        </div>
      ),
    },
    {
      key: 'email',
      header: 'Email',
      render: (item: BlockedUserItem) => (
        <span className="text-gray-600">{item.email || '-'}</span>
      ),
    },
    {
      key: 'reason',
      header: 'Reason',
      render: (item: BlockedUserItem) => (
        <span className="text-gray-600 max-w-xs truncate block">{item.reason}</span>
      ),
    },
    {
      key: 'blockedBy',
      header: 'Blocked By',
      render: (item: BlockedUserItem) => (
        <span className="text-gray-600">{item.blockedByUsername || 'System'}</span>
      ),
    },
    {
      key: 'blockedAt',
      header: 'Blocked Date',
      render: (item: BlockedUserItem) => (
        <span className="text-gray-500 text-xs">
          {format(new Date(item.blockedAt), 'MMM dd, yyyy hh:mm a')}
        </span>
      ),
    },
    {
      key: 'actions',
      header: '',
      render: (item: BlockedUserItem) => (
        <Can permission="user:block">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              setUnblockPhone(item.phone);
            }}
            className="text-green-600 hover:bg-green-50"
          >
            <Check className="w-4 h-4" />
            Unblock
          </Button>
        </Can>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Blocked Users</h1>
        <p className="text-gray-500 mt-1">View and manage blocked user accounts</p>
      </div>

      {/* Table */}
      <div className="card">
        {!isLoading && data?.users.length === 0 ? (
          <EmptyState
            icon={Ban}
            title="No blocked users"
            message="There are no blocked users at the moment."
          />
        ) : (
          <>
            <Table
              columns={columns}
              data={data?.users || []}
              keyExtractor={(item) => item.id}
              isLoading={isLoading}
              emptyMessage="No blocked users found"
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

      {/* Unblock Confirmation */}
      <ConfirmDialog
        isOpen={!!unblockPhone}
        onClose={() => setUnblockPhone(null)}
        onConfirm={handleUnblock}
        title="Unblock User"
        message="Are you sure you want to unblock this user? They will be able to access the platform again."
        confirmText="Unblock"
        variant="warning"
        isLoading={unblockUser.isPending}
      />
    </div>
  );
}
