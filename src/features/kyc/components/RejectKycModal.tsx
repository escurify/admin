import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';

interface RejectKycModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  isLoading?: boolean;
}

export function RejectKycModal({ isOpen, onClose, onConfirm, isLoading }: RejectKycModalProps) {
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (reason.length < 20) {
      setError('Reason must be at least 20 characters');
      return;
    }
    if (reason.length > 500) {
      setError('Reason must be less than 500 characters');
      return;
    }
    onConfirm(reason);
  };

  const handleClose = () => {
    setReason('');
    setError('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Reject KYC" size="md">
      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          Please provide a reason for rejecting this KYC application. The seller will be notified
          of the rejection with this reason.
        </p>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Rejection Reason
          </label>
          <textarea
            value={reason}
            onChange={(e) => {
              setReason(e.target.value);
              setError('');
            }}
            placeholder="Enter the reason for rejection..."
            rows={4}
            className={`input resize-none ${error ? 'input-error' : ''}`}
          />
          <div className="flex justify-between mt-1">
            {error ? (
              <p className="text-sm text-red-500">{error}</p>
            ) : (
              <span />
            )}
            <span className="text-xs text-gray-400">{reason.length}/500</span>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <Button variant="secondary" onClick={handleClose} className="flex-1">
            Cancel
          </Button>
          <Button variant="danger" onClick={handleSubmit} loading={isLoading} className="flex-1">
            Reject KYC
          </Button>
        </div>
      </div>
    </Modal>
  );
}
