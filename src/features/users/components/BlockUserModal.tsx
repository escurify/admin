import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';

interface BlockUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  isLoading?: boolean;
}

export function BlockUserModal({ isOpen, onClose, onConfirm, isLoading }: BlockUserModalProps) {
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (reason.length < 10) {
      setError('Reason must be at least 10 characters');
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
    <Modal isOpen={isOpen} onClose={handleClose} title="Block User" size="md">
      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          Blocking this user will prevent them from accessing the platform. Please provide a reason
          for this action.
        </p>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Block Reason</label>
          <textarea
            value={reason}
            onChange={(e) => {
              setReason(e.target.value);
              setError('');
            }}
            placeholder="Enter the reason for blocking..."
            rows={4}
            className={`input resize-none ${error ? 'input-error' : ''}`}
          />
          <div className="flex justify-between mt-1">
            {error ? <p className="text-sm text-red-500">{error}</p> : <span />}
            <span className="text-xs text-gray-400">{reason.length}/500</span>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <Button variant="secondary" onClick={handleClose} className="flex-1">
            Cancel
          </Button>
          <Button variant="danger" onClick={handleSubmit} loading={isLoading} className="flex-1">
            Block User
          </Button>
        </div>
      </div>
    </Modal>
  );
}
