import { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import type { AdminDisputeDecision } from '@/types';

interface ResolveDisputeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: {
    decision: AdminDisputeDecision;
    buyerRefundAmount?: number;
    sellerPayoutAmount?: number;
    notes?: string;
  }) => void;
  isLoading?: boolean;
  transactionAmount: number;
}

const DECISION_OPTIONS: { value: AdminDisputeDecision; label: string; description: string }[] = [
  {
    value: 'REFUND',
    label: 'Refund Buyer 100%',
    description: 'Full refund to the buyer. Transaction marked as REFUNDED.',
  },
  {
    value: 'PAYOUT',
    label: 'Payout Seller 100%',
    description: 'Full payout to the seller. Transaction enters the payout flow.',
  },
  {
    value: 'SPLIT',
    label: 'Split Settlement',
    description: 'Partial refund to buyer + partial payout to seller.',
  },
];

export function ResolveDisputeModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
  transactionAmount,
}: ResolveDisputeModalProps) {
  const [decision, setDecision] = useState<AdminDisputeDecision>('REFUND');
  const [buyerRefundAmount, setBuyerRefundAmount] = useState('');
  const [sellerPayoutAmount, setSellerPayoutAmount] = useState('');
  const [notes, setNotes] = useState('');
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setDecision('REFUND');
      setBuyerRefundAmount('');
      setSellerPayoutAmount('');
      setNotes('');
      setValidationError('');
    }
  }, [isOpen]);

  const validate = (): boolean => {
    setValidationError('');

    if (decision === 'SPLIT') {
      const refund = parseFloat(buyerRefundAmount);
      const payout = parseFloat(sellerPayoutAmount);

      if (isNaN(refund) || refund < 0) {
        setValidationError('Buyer refund amount must be a valid number >= 0');
        return false;
      }
      if (isNaN(payout) || payout < 0) {
        setValidationError('Seller payout amount must be a valid number >= 0');
        return false;
      }
      if (refund + payout > transactionAmount) {
        setValidationError(
          `Total (₹${(refund + payout).toFixed(2)}) exceeds escrowed amount (₹${transactionAmount.toFixed(2)})`
        );
        return false;
      }
      if (refund === 0 && payout === 0) {
        setValidationError('At least one amount must be greater than 0');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    const data: {
      decision: AdminDisputeDecision;
      buyerRefundAmount?: number;
      sellerPayoutAmount?: number;
      notes?: string;
    } = {
      decision,
      notes: notes || undefined,
    };

    if (decision === 'SPLIT') {
      data.buyerRefundAmount = parseFloat(buyerRefundAmount);
      data.sellerPayoutAmount = parseFloat(sellerPayoutAmount);
    }

    onConfirm(data);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Resolve Dispute" size="md">
      <div className="space-y-5">
        {/* Transaction amount context */}
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-xs text-gray-500">Escrowed Amount</p>
          <p className="text-lg font-bold text-gray-900">₹{transactionAmount.toLocaleString()}</p>
        </div>

        {/* Decision selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Decision</label>
          <div className="space-y-2">
            {DECISION_OPTIONS.map((option) => (
              <label
                key={option.value}
                className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                  decision === option.value
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="decision"
                  value={option.value}
                  checked={decision === option.value}
                  onChange={() => {
                    setDecision(option.value);
                    setValidationError('');
                  }}
                  className="mt-0.5"
                />
                <div>
                  <p className="font-medium text-gray-900 text-sm">{option.label}</p>
                  <p className="text-xs text-gray-500">{option.description}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Split amounts - only shown for SPLIT decision */}
        {decision === 'SPLIT' && (
          <div className="space-y-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-sm font-medium text-amber-800">Split Amounts</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Buyer Refund (₹)</label>
                <input
                  type="number"
                  value={buyerRefundAmount}
                  onChange={(e) => {
                    setBuyerRefundAmount(e.target.value);
                    setValidationError('');
                  }}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  className="input"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Seller Payout (₹)</label>
                <input
                  type="number"
                  value={sellerPayoutAmount}
                  onChange={(e) => {
                    setSellerPayoutAmount(e.target.value);
                    setValidationError('');
                  }}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  className="input"
                />
              </div>
            </div>
            {buyerRefundAmount && sellerPayoutAmount && (
              <p className="text-xs text-amber-700">
                Total: ₹{(parseFloat(buyerRefundAmount || '0') + parseFloat(sellerPayoutAmount || '0')).toFixed(2)} / ₹{transactionAmount.toFixed(2)}
              </p>
            )}
          </div>
        )}

        {/* Validation error */}
        {validationError && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">{validationError}</p>
        )}

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Admin Notes (Optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add any notes about the resolution decision..."
            rows={3}
            className="input resize-none"
            maxLength={1000}
          />
          <div className="flex justify-end mt-1">
            <span className="text-xs text-gray-400">{notes.length}/1000</span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 pt-2">
          <Button variant="secondary" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            loading={isLoading}
            className="flex-1"
            variant={decision === 'REFUND' ? 'danger' : 'primary'}
          >
            {decision === 'REFUND' && 'Refund Buyer'}
            {decision === 'PAYOUT' && 'Payout Seller'}
            {decision === 'SPLIT' && 'Apply Split'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
