import { useState } from 'react';
import { Loader2, Ban, UserX, Pencil, Shield, AlertTriangle, Check, X } from 'lucide-react';
import { Drawer } from '@/components/ui/Drawer';
import { Button } from '@/components/ui/Button';
import { Badge, getStatusBadgeVariant } from '@/components/ui/Badge';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { useUser, useBlockUser, useUnblockUser, useDeleteUser } from '../hooks/useUsers';
import { BlockUserModal } from './BlockUserModal';
import { EditUserModal } from './EditUserModal';
import { Can } from '@/auth';
import type { GetUserResponse } from '@/types';
import { format } from 'date-fns';

interface UserDetailsDrawerProps {
  phone: string | null;
  onClose: () => void;
}

function DetailRow({ label, value, badge }: { label: string; value?: string | null; badge?: React.ReactNode }) {
  return (
    <div className="py-2">
      <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider">{label}</dt>
      <dd className="mt-1 text-sm text-gray-900 flex items-center gap-2">
        {value || '-'}
        {badge}
      </dd>
    </div>
  );
}

function StatusIcon({ verified }: { verified: boolean }) {
  return verified ? (
    <span className="inline-flex items-center gap-1 text-green-600 text-xs">
      <Check className="w-3 h-3" /> Verified
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 text-gray-400 text-xs">
      <X className="w-3 h-3" /> Not Verified
    </span>
  );
}

export function UserDetailsDrawer({ phone, onClose }: UserDetailsDrawerProps) {
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showUnblockConfirm, setShowUnblockConfirm] = useState(false);

  const { data: user, isLoading, error } = useUser(phone);
  const blockUser = useBlockUser();
  const unblockUser = useUnblockUser();
  const deleteUser = useDeleteUser();

  const handleBlock = (reason: string) => {
    if (!phone) return;
    blockUser.mutate(
      { phone, data: { reason } },
      {
        onSuccess: () => setShowBlockModal(false),
      }
    );
  };

  const handleUnblock = () => {
    if (!phone) return;
    unblockUser.mutate(phone, {
      onSuccess: () => setShowUnblockConfirm(false),
    });
  };

  const handleDelete = () => {
    if (!phone) return;
    deleteUser.mutate(phone, {
      onSuccess: () => {
        setShowDeleteConfirm(false);
        onClose();
      },
    });
  };

  return (
    <>
      <Drawer isOpen={!!phone} onClose={onClose} title="User Details" width="lg">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-900">User Not Found</h3>
            <p className="text-sm text-gray-500 mt-1">No user found with this phone number</p>
          </div>
        ) : user ? (
          <UserContent
            user={user}
            onEdit={() => setShowEditModal(true)}
            onBlock={() => setShowBlockModal(true)}
            onUnblock={() => setShowUnblockConfirm(true)}
            onDelete={() => setShowDeleteConfirm(true)}
          />
        ) : null}
      </Drawer>

      {user && (
        <>
          <BlockUserModal
            isOpen={showBlockModal}
            onClose={() => setShowBlockModal(false)}
            onConfirm={handleBlock}
            isLoading={blockUser.isPending}
          />

          <EditUserModal
            isOpen={showEditModal}
            onClose={() => setShowEditModal(false)}
            user={user}
            phone={phone!}
          />

          <ConfirmDialog
            isOpen={showUnblockConfirm}
            onClose={() => setShowUnblockConfirm(false)}
            onConfirm={handleUnblock}
            title="Unblock User"
            message={`Are you sure you want to unblock ${user.name}? They will be able to access the platform again.`}
            confirmText="Unblock"
            variant="warning"
            isLoading={unblockUser.isPending}
          />

          <ConfirmDialog
            isOpen={showDeleteConfirm}
            onClose={() => setShowDeleteConfirm(false)}
            onConfirm={handleDelete}
            title="Delete User"
            message={`Are you sure you want to permanently delete ${user.name}? This action cannot be undone.`}
            confirmText="Delete"
            variant="danger"
            isLoading={deleteUser.isPending}
          />
        </>
      )}
    </>
  );
}

interface UserContentProps {
  user: GetUserResponse;
  onEdit: () => void;
  onBlock: () => void;
  onUnblock: () => void;
  onDelete: () => void;
}

function UserContent({ user, onEdit, onBlock, onUnblock, onDelete }: UserContentProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          {user.profilePicture ? (
            <img
              src={user.profilePicture}
              alt={user.name}
              className="w-16 h-16 rounded-full object-cover"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center">
              <span className="text-xl font-semibold text-primary-600">
                {user.name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>
            <p className="text-sm text-gray-500">{user.phone}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {user.isBlocked && <Badge variant="danger">Blocked</Badge>}
          {user.isSeller && (
            <Badge variant="purple">
              <Shield className="w-3 h-3 mr-1" />
              Seller
            </Badge>
          )}
        </div>
      </div>

      {/* Blocked Warning */}
      {user.isBlocked && user.blockedAt && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start gap-2">
            <Ban className="w-5 h-5 text-red-600 mt-0.5" />
            <div>
              <p className="font-medium text-red-700">This user is blocked</p>
              <p className="text-sm text-red-600 mt-1">
                Blocked on {format(new Date(user.blockedAt), 'MMM dd, yyyy')}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Basic Info */}
      <div>
        <h4 className="text-sm font-semibold text-gray-900 mb-2">Basic Information</h4>
        <div className="bg-gray-50 rounded-lg px-4 divide-y divide-gray-200">
          <DetailRow label="Full Name" value={user.name} />
          <DetailRow
            label="Phone"
            value={user.phone}
            badge={<StatusIcon verified={user.verified} />}
          />
          <DetailRow
            label="Email"
            value={user.email}
            badge={user.email ? <StatusIcon verified={user.emailVerified} /> : undefined}
          />
          <DetailRow label="Heard About Us" value={user.heardAboutUs} />
          <DetailRow
            label="Created"
            value={format(new Date(user.createdAt), 'MMM dd, yyyy hh:mm a')}
          />
        </div>
      </div>

      {/* Seller Details */}
      {user.isSeller && user.sellerDetails && (
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-2">Seller Details</h4>
          <div className="bg-gray-50 rounded-lg px-4 divide-y divide-gray-200">
            <DetailRow label="Business Name" value={user.sellerDetails.businessName} />
            <DetailRow label="GST Number" value={user.sellerDetails.gstNumber} />
            <DetailRow label="Total Transactions" value={String(user.sellerDetails.totalTransactions)} />
            <DetailRow
              label="Rating"
              value={
                user.sellerDetails.averageRating > 0
                  ? `${user.sellerDetails.averageRating.toFixed(1)} ⭐ (${user.sellerDetails.totalReviews} reviews)`
                  : 'No ratings yet'
              }
            />
            <DetailRow
              label="Payout Verified"
              badge={<StatusIcon verified={user.sellerDetails.payoutVerified} />}
            />
          </div>
        </div>
      )}

      {/* KYC Details */}
      {user.kycDetails && (
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-2">KYC Status</h4>
          <div className="bg-gray-50 rounded-lg px-4 divide-y divide-gray-200">
            <DetailRow
              label="Status"
              badge={<Badge variant={getStatusBadgeVariant(user.kycDetails.kycStatus)}>{user.kycDetails.kycStatus}</Badge>}
            />
            <DetailRow
              label="Basic Details"
              badge={<StatusIcon verified={user.kycDetails.basicDetailsSubmitted} />}
            />
            <DetailRow
              label="PAN Verified"
              badge={<StatusIcon verified={user.kycDetails.panVerified} />}
            />
            <DetailRow
              label="Bank Verified"
              badge={<StatusIcon verified={user.kycDetails.bankVerified} />}
            />
            {user.kycDetails.rejectionReason && (
              <DetailRow label="Rejection Reason" value={user.kycDetails.rejectionReason} />
            )}
          </div>
        </div>
      )}

      {/* Payout Summary */}
      {user.payoutSummary && (
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-2">Payout Summary</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-xs font-medium text-gray-500 uppercase">Pending</p>
              <p className="text-lg font-semibold text-gray-900 mt-1">
                ₹{user.payoutSummary.totalPending.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500">{user.payoutSummary.pendingCount} transactions</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-xs font-medium text-gray-500 uppercase">Completed</p>
              <p className="text-lg font-semibold text-gray-900 mt-1">
                ₹{user.payoutSummary.totalCompleted.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500">{user.payoutSummary.completedCount} transactions</p>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 pt-4 border-t border-gray-200">
        <Can permission="user:update">
          <Button variant="secondary" onClick={onEdit} className="flex-1">
            <Pencil className="w-4 h-4" />
            Edit
          </Button>
        </Can>

        <Can permission="user:block">
          {user.isBlocked ? (
            <Button variant="secondary" onClick={onUnblock} className="flex-1">
              <Check className="w-4 h-4" />
              Unblock
            </Button>
          ) : (
            <Button variant="danger" onClick={onBlock} className="flex-1">
              <Ban className="w-4 h-4" />
              Block
            </Button>
          )}
        </Can>

        <Can permission="user:delete">
          <Button variant="ghost" onClick={onDelete} className="text-red-600 hover:bg-red-50">
            <UserX className="w-4 h-4" />
            Delete
          </Button>
        </Can>
      </div>
    </div>
  );
}
