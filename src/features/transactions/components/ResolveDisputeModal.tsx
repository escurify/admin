import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';

interface ResolveDisputeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (notes?: string) => void;
  isLoading?: boolean;
}

export function ResolveDisputeModal({ isOpen, onClose, onConfirm, isLoading }: ResolveDisputeModalProps) {
  const [notes, setNotes] = useState('');

  const handleSubmit = () => {
    onConfirm(notes || undefined);
  };

  const handleClose = () => {
    setNotes('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Resolve Dispute" size="md">
      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          Mark this dispute as resolved. You can optionally add resolution notes for record keeping.
        </p>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Resolution Notes (Optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add any notes about how the dispute was resolved..."
            rows={4}
            className="input resize-none"
            maxLength={500}
          />
          <div className="flex justify-end mt-1">
            <span className="text-xs text-gray-400">{notes.length}/500</span>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <Button variant="secondary" onClick={handleClose} className="flex-1">
            Cancel
          </Button>
          <Button onClick={handleSubmit} loading={isLoading} className="flex-1">
            Resolve Dispute
          </Button>
        </div>
      </div>
    </Modal>
  );
}
