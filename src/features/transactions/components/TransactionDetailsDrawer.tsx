import { useState } from 'react';
import {
  ExternalLink,
  MessageSquare,
  Package,
  CreditCard,
  Clock,
  AlertTriangle,
  CheckCircle,
  Scale,
  Paperclip,
  FileText,
  Image as ImageIcon,
  Film,
} from 'lucide-react';
import { Drawer } from '@/components/ui/Drawer';
import { Button } from '@/components/ui/Button';
import { Badge, getStatusBadgeVariant } from '@/components/ui/Badge';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { ResolveDisputeModal } from './ResolveDisputeModal';
import { useCompleteTransaction, useResolveDisputeByAdmin } from '../hooks/useTransactions';
import { Can } from '@/auth';
import type { TransactionSearchResult, DisputedTransaction, AdminDisputeDecision } from '@/types';
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

interface TransactionDetailsDrawerProps {
  transaction: (TransactionSearchResult | DisputedTransaction) | null;
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

function PartyCard({ role, party }: { role: 'Buyer' | 'Seller'; party?: { name: string; phone: string; email?: string } | null }) {
  if (!party) {
    return (
      <div className="bg-gray-50 rounded-lg p-4">
        <p className="text-xs font-medium text-gray-500 uppercase mb-2">{role}</p>
        <p className="text-sm text-gray-400">Not assigned</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <p className="text-xs font-medium text-gray-500 uppercase mb-2">{role}</p>
      <p className="font-medium text-gray-900">{party.name}</p>
      <p className="text-sm text-gray-500">{party.phone}</p>
      {party.email && <p className="text-sm text-gray-500">{party.email}</p>}
    </div>
  );
}

export function TransactionDetailsDrawer({ transaction, onClose }: TransactionDetailsDrawerProps) {
  const [showCompleteConfirm, setShowCompleteConfirm] = useState(false);
  const [showResolveModal, setShowResolveModal] = useState(false);

  const completeTransaction = useCompleteTransaction();
  const resolveDispute = useResolveDisputeByAdmin();

  if (!transaction) return null;

  const handleComplete = () => {
    completeTransaction.mutate(transaction.id, {
      onSuccess: () => {
        setShowCompleteConfirm(false);
        onClose();
      },
    });
  };

  const handleResolve = (data: {
    decision: AdminDisputeDecision;
    buyerRefundAmount?: number;
    sellerPayoutAmount?: number;
    notes?: string;
  }) => {
    resolveDispute.mutate(
      { id: transaction.id, data },
      {
        onSuccess: () => {
          setShowResolveModal(false);
          onClose();
        },
      }
    );
  };

  const isDisputed = transaction.status === 'DISPUTED';
  const isSplitSettled = transaction.status === 'SPLIT_SETTLED';
  const disputeData = transaction as DisputedTransaction;

  return (
    <>
      <Drawer isOpen={!!transaction} onClose={onClose} title="Transaction Details" width="lg">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{transaction.title}</h3>
              <p className="text-sm text-gray-500 font-mono">{transaction.txnCode}</p>
            </div>
            <Badge variant={getStatusBadgeVariant(transaction.status)}>{transaction.status}</Badge>
          </div>

          {/* Amount */}
          <div className="bg-primary-50 rounded-lg p-4">
            <p className="text-xs font-medium text-primary-600 uppercase">Deal Amount</p>
            <p className="text-2xl font-bold text-primary-700 mt-1">
              ₹{transaction.amount.toLocaleString()}
            </p>
            {(transaction as any).buyerPaysAmount && (
              <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-primary-500">Buyer pays: </span>
                  <span className="font-semibold text-primary-700">₹{((transaction as any).buyerPaysAmount).toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-primary-500">Seller receives: </span>
                  <span className="font-semibold text-primary-700">₹{((transaction as any).sellerReceivesAmount).toLocaleString()}</span>
                </div>
              </div>
            )}
          </div>

          {/* Dispute Info */}
          {isDisputed && disputeData.disputeReason && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                <div>
                  <p className="font-medium text-red-700">Dispute Raised</p>
                  <p className="text-sm text-red-600 mt-1">
                    <span className="font-medium">Reason:</span> {formatDisputeReason(disputeData.disputeReason)}
                  </p>
                  {disputeData.disputeDescription && (
                    <p className="text-sm text-red-600 mt-1">
                      <span className="font-medium">Description:</span> {disputeData.disputeDescription}
                    </p>
                  )}
                  {disputeData.disputeAttachments && disputeData.disputeAttachments.length > 0 && (
                    <div className="mt-2">
                      <p className="text-sm font-medium text-red-700 mb-1">
                        <Paperclip className="w-3.5 h-3.5 inline mr-1" />
                        Evidence ({disputeData.disputeAttachments.length} file{disputeData.disputeAttachments.length > 1 ? 's' : ''})
                      </p>
                      <div className="space-y-1">
                        {disputeData.disputeAttachments.map((att, index) => (
                          <a
                            key={`${att.url}-${index}`}
                            href={att.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-sm text-red-600 hover:text-red-800 hover:underline"
                          >
                            {att.type === 'application/pdf' ? (
                              <FileText className="w-3.5 h-3.5 shrink-0" />
                            ) : att.type.startsWith('video/') ? (
                              <Film className="w-3.5 h-3.5 shrink-0" />
                            ) : (
                              <ImageIcon className="w-3.5 h-3.5 shrink-0" />
                            )}
                            <span className="truncate">{att.name}</span>
                            <ExternalLink className="w-3 h-3 shrink-0" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                  {disputeData.disputedAt && (
                    <p className="text-xs text-red-500 mt-2">
                      Disputed on {format(new Date(disputeData.disputedAt), 'MMM dd, yyyy hh:mm a')}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Split Settled Info */}
          {isSplitSettled && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <Scale className="w-5 h-5 text-orange-600 mt-0.5" />
                <div>
                  <p className="font-medium text-orange-700">Split Settlement</p>
                  <p className="text-sm text-orange-600 mt-1">
                    Partially Refunded to Buyer & Partially Paid to Seller
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Parties */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-2">Parties</h4>
            <div className="grid grid-cols-2 gap-4">
              <PartyCard role="Buyer" party={transaction.buyer} />
              <PartyCard role="Seller" party={transaction.seller} />
            </div>
          </div>

          {/* Transaction Info */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-2">Transaction Info</h4>
            <div className="bg-gray-50 rounded-lg px-4 divide-y divide-gray-200">
              <DetailRow label="Description" value={transaction.description} />
              <DetailRow label="Delivery Method" value={transaction.deliveryMethod} />
              <DetailRow label="Owner Type" value={transaction.ownerType} />
              <DetailRow
                label="Created"
                value={format(new Date(transaction.createdAt), 'MMM dd, yyyy hh:mm a')}
              />
              {transaction.paidAt && (
                <DetailRow
                  label="Paid At"
                  value={format(new Date(transaction.paidAt), 'MMM dd, yyyy hh:mm a')}
                />
              )}
            </div>
          </div>

          {/* Links */}
          <div className="flex gap-3">
            {transaction.trackingLink && (
              <a
                href={transaction.trackingLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
              >
                <Package className="w-4 h-4" />
                Tracking
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
            {transaction.chatLink && (
              <a
                href={transaction.chatLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                Chat
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>

          {/* Timeline */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Status Timeline</h4>
            <div className="space-y-3">
              <TimelineItem
                icon={CreditCard}
                title="Created"
                date={transaction.createdAt}
                isCompleted
              />
              {transaction.paidAt && (
                <TimelineItem
                  icon={CreditCard}
                  title="Payment Received"
                  date={transaction.paidAt}
                  isCompleted
                />
              )}
              {transaction.status === 'COMPLETED' && (
                <TimelineItem
                  icon={CheckCircle}
                  title="Completed"
                  date={transaction.lastUpdatedAt}
                  isCompleted
                />
              )}
              {(transaction.status === 'DISPUTED' || isSplitSettled) && disputeData.disputedAt && (
                <TimelineItem
                  icon={AlertTriangle}
                  title="Dispute Raised"
                  date={disputeData.disputedAt}
                  isCompleted
                  isWarning
                />
              )}
              {isSplitSettled && (
                <TimelineItem
                  icon={Scale}
                  title="Split Settled by Admin"
                  date={transaction.lastUpdatedAt}
                  isCompleted
                />
              )}
            </div>
          </div>

          {/* Actions */}
          <Can permission="transaction:action">
            <div className="flex gap-3 pt-4 border-t border-gray-200">
              {isDisputed && (
                <Button onClick={() => setShowResolveModal(true)} className="flex-1">
                  <Scale className="w-4 h-4" />
                  Resolve Dispute
                </Button>
              )}
              {transaction.status === 'DISPATCHED' && (
                <Button onClick={() => setShowCompleteConfirm(true)} className="flex-1">
                  <CheckCircle className="w-4 h-4" />
                  Mark Complete
                </Button>
              )}
            </div>
          </Can>
        </div>
      </Drawer>

      {/* Modals */}
      <ConfirmDialog
        isOpen={showCompleteConfirm}
        onClose={() => setShowCompleteConfirm(false)}
        onConfirm={handleComplete}
        title="Complete Transaction"
        message="Are you sure you want to mark this transaction as completed? This will release the payment to the seller."
        confirmText="Complete"
        isLoading={completeTransaction.isPending}
      />

      <ResolveDisputeModal
        isOpen={showResolveModal}
        onClose={() => setShowResolveModal(false)}
        onConfirm={handleResolve}
        isLoading={resolveDispute.isPending}
        transactionAmount={transaction.amount}
      />
    </>
  );
}

interface TimelineItemProps {
  icon: React.ElementType;
  title: string;
  date: string;
  isCompleted?: boolean;
  isWarning?: boolean;
}

function TimelineItem({ icon: Icon, title, date, isCompleted, isWarning }: TimelineItemProps) {
  return (
    <div className="flex items-start gap-3">
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center ${
          isWarning
            ? 'bg-amber-100 text-amber-600'
            : isCompleted
            ? 'bg-green-100 text-green-600'
            : 'bg-gray-100 text-gray-400'
        }`}
      >
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1">
        <p className="font-medium text-gray-900">{title}</p>
        <p className="text-xs text-gray-500">
          {format(new Date(date), 'MMM dd, yyyy hh:mm a')}
        </p>
      </div>
      {isCompleted && <Clock className="w-4 h-4 text-gray-300" />}
    </div>
  );
}
