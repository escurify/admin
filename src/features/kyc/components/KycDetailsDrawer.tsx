import { useState } from 'react';
import { CheckCircle, XCircle, User, Phone, Mail, Building, MapPin, Calendar, Pencil } from 'lucide-react';
import { Drawer } from '@/components/ui/Drawer';
import { Button } from '@/components/ui/Button';
import { Badge, getStatusBadgeVariant } from '@/components/ui/Badge';
import { useApproveKyc, useRejectKyc } from '../hooks/useKyc';
import { Can } from '@/auth';
import { RejectKycModal } from './RejectKycModal';
import { EditKycModal } from './EditKycModal';
import type { PendingKycSellerItem } from '@/types';
import { format } from 'date-fns';

interface KycDetailsDrawerProps {
  seller: PendingKycSellerItem | null;
  onClose: () => void;
}

function DetailRow({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="py-2">
      <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider">{label}</dt>
      <dd className="mt-1 text-sm text-gray-900">{value || '-'}</dd>
    </div>
  );
}

function StatusBadge({ verified, label }: { verified: boolean; label: string }) {
  return (
    <div className="flex items-center gap-2">
      {verified ? (
        <CheckCircle className="w-4 h-4 text-green-600" />
      ) : (
        <XCircle className="w-4 h-4 text-gray-400" />
      )}
      <span className={`text-sm ${verified ? 'text-green-600' : 'text-gray-500'}`}>
        {label}: {verified ? 'Verified' : 'Pending'}
      </span>
    </div>
  );
}

export function KycDetailsDrawer({ seller, onClose }: KycDetailsDrawerProps) {
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const approveKyc = useApproveKyc();
  const rejectKyc = useRejectKyc();

  if (!seller) return null;

  const { user, kyc, basicDetails, sellerId, totalTransactions, averageRating, totalReviews, createdAt } = seller;

  const handleApprove = () => {
    approveKyc.mutate(sellerId, {
      onSuccess: onClose,
    });
  };

  const handleReject = (reason: string) => {
    rejectKyc.mutate(
      { sellerId, data: { reason } },
      {
        onSuccess: () => {
          setShowRejectModal(false);
          onClose();
        },
      }
    );
  };

  // Allow approval if basic details are submitted (bank verification not required)
  const canApprove = kyc.kycStatus !== 'APPROVED' && kyc.kycStatus !== 'REJECTED' && kyc.basicDetailsSubmitted;

  return (
    <>
      <Drawer isOpen={!!seller} onClose={onClose} title="Seller KYC Details" width="lg">
        <div className="space-y-6">
          {/* User Info Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-primary-100 flex items-center justify-center">
                <User className="w-7 h-7 text-primary-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Phone className="w-4 h-4" />
                  {user.phone}
                </div>
                {user.email && (
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Mail className="w-4 h-4" />
                    {user.email}
                  </div>
                )}
              </div>
            </div>
            <Badge variant={getStatusBadgeVariant(kyc.kycStatus)}>{kyc.kycStatus}</Badge>
          </div>

          {/* Verification Status */}
          <div className="p-4 bg-gray-50 rounded-lg space-y-3">
            <h4 className="text-sm font-semibold text-gray-900">Verification Status</h4>
            <div className="grid grid-cols-3 gap-4">
              <StatusBadge verified={kyc.basicDetailsSubmitted} label="Basic Details" />
              <StatusBadge verified={kyc.panVerified} label="PAN" />
              <StatusBadge verified={kyc.bankVerified} label="Bank" />
            </div>
          </div>

          {/* Seller Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg text-center">
              <p className="text-2xl font-bold text-blue-700">{totalTransactions}</p>
              <p className="text-xs text-blue-600 mt-1">Transactions</p>
            </div>
            <div className="p-4 bg-amber-50 rounded-lg text-center">
              <p className="text-2xl font-bold text-amber-700">
                {averageRating > 0 ? averageRating.toFixed(1) : '-'}
              </p>
              <p className="text-xs text-amber-600 mt-1">Avg Rating</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg text-center">
              <p className="text-2xl font-bold text-green-700">{totalReviews}</p>
              <p className="text-xs text-green-600 mt-1">Reviews</p>
            </div>
          </div>

          {/* Business Details */}
          {basicDetails && (
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <Building className="w-4 h-4" />
                Business Information
              </h4>
              <div className="bg-gray-50 rounded-lg px-4 divide-y divide-gray-200">
                <DetailRow label="Business Name" value={basicDetails.businessName} />
                <DetailRow label="Business Type" value={basicDetails.businessType} />
                <DetailRow label="PAN Number" value={basicDetails.panNumber} />
                <DetailRow label="GSTIN" value={basicDetails.gstin} />
              </div>
            </div>
          )}

          {/* Address */}
          {basicDetails && (basicDetails.city || basicDetails.state) && (
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Location
              </h4>
              <div className="bg-gray-50 rounded-lg px-4 divide-y divide-gray-200">
                <DetailRow label="City" value={basicDetails.city} />
                <DetailRow label="State" value={basicDetails.state} />
              </div>
            </div>
          )}

          {/* Contact Person */}
          {basicDetails && basicDetails.contactPersonName && (
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <User className="w-4 h-4" />
                Contact Person
              </h4>
              <div className="bg-gray-50 rounded-lg px-4 divide-y divide-gray-200">
                <DetailRow label="Name" value={basicDetails.contactPersonName} />
                <DetailRow label="Email" value={basicDetails.contactPersonEmail} />
                <DetailRow label="Phone" value={basicDetails.contactPersonPhone} />
              </div>
            </div>
          )}

          {/* Rejection Reason */}
          {kyc.rejectionReason && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <h4 className="text-sm font-semibold text-red-700 mb-1">Rejection Reason</h4>
              <p className="text-sm text-red-600">{kyc.rejectionReason}</p>
            </div>
          )}

          {/* Dates */}
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Calendar className="w-4 h-4" />
            Joined: {format(new Date(createdAt), 'MMM dd, yyyy')}
            {kyc.submittedAt && (
              <span className="ml-4">
                Submitted: {format(new Date(kyc.submittedAt), 'MMM dd, yyyy')}
              </span>
            )}
          </div>

          {/* Actions */}
          <Can permission="kyc:update">
            <div className="pt-4 border-t border-gray-200">
              <Button
                variant="secondary"
                onClick={() => setShowEditModal(true)}
                className="w-full mb-3"
              >
                <Pencil className="w-4 h-4" />
                Edit KYC Details
              </Button>
            </div>
          </Can>

          <Can permission="kyc:approve">
            <div className="flex gap-3">
              <Button
                variant="danger"
                onClick={() => setShowRejectModal(true)}
                disabled={kyc.kycStatus === 'APPROVED' || kyc.kycStatus === 'REJECTED'}
                className="flex-1"
              >
                Reject KYC
              </Button>
              <Button
                onClick={handleApprove}
                disabled={!canApprove}
                loading={approveKyc.isPending}
                className="flex-1"
              >
                Approve KYC
              </Button>
            </div>
          </Can>

          {/* Help text for approval */}
          {!canApprove && kyc.kycStatus !== 'APPROVED' && kyc.kycStatus !== 'REJECTED' && (
            <p className="text-xs text-amber-600 text-center mt-3">
              ⚠️ Basic details must be submitted before approval
            </p>
          )}
        </div>
      </Drawer>

      <RejectKycModal
        isOpen={showRejectModal}
        onClose={() => setShowRejectModal(false)}
        onConfirm={handleReject}
        isLoading={rejectKyc.isPending}
      />

      {seller && (
        <EditKycModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          seller={seller}
        />
      )}
    </>
  );
}
