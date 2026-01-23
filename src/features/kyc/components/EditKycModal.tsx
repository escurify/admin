import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useUpdateKyc } from '../hooks/useKyc';
import type { PendingKycSellerItem } from '@/types';

const editKycSchema = z.object({
  businessName: z.string().max(200).optional(),
  panNumber: z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Invalid PAN format').optional().or(z.literal('')),
  gstin: z.string().optional(),
  registeredAddress: z.string().max(500).optional(),
  city: z.string().max(100).optional(),
  state: z.string().max(100).optional(),
  pincode: z.string().regex(/^[0-9]{6}$/, 'Invalid pincode').optional().or(z.literal('')),
  contactPersonName: z.string().max(100).optional(),
  contactPersonEmail: z.string().email('Invalid email').optional().or(z.literal('')),
  contactPersonPhone: z.string().regex(/^[0-9]{10}$/, 'Invalid phone').optional().or(z.literal('')),
  accountHolderName: z.string().max(100).optional(),
  accountNumber: z.string().optional(),
  ifscCode: z.string().regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, 'Invalid IFSC').optional().or(z.literal('')),
});

type EditKycFormData = z.infer<typeof editKycSchema>;

interface EditKycModalProps {
  isOpen: boolean;
  onClose: () => void;
  seller: PendingKycSellerItem;
}

export function EditKycModal({ isOpen, onClose, seller }: EditKycModalProps) {
  const updateKyc = useUpdateKyc();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<EditKycFormData>({
    resolver: zodResolver(editKycSchema),
    defaultValues: {
      businessName: seller.basicDetails?.businessName || '',
      panNumber: seller.basicDetails?.panNumber || '',
      gstin: seller.basicDetails?.gstin || '',
      registeredAddress: '',
      city: seller.basicDetails?.city || '',
      state: seller.basicDetails?.state || '',
      pincode: '',
      contactPersonName: seller.basicDetails?.contactPersonName || '',
      contactPersonEmail: seller.basicDetails?.contactPersonEmail || '',
      contactPersonPhone: seller.basicDetails?.contactPersonPhone || '',
      accountHolderName: '',
      accountNumber: '',
      ifscCode: '',
    },
  });

  const onSubmit = (data: EditKycFormData) => {
    // Filter out empty strings and undefined values
    const filteredData = Object.fromEntries(
      Object.entries(data).filter(([, value]) => value !== '' && value !== undefined)
    );

    if (Object.keys(filteredData).length === 0) {
      onClose();
      return;
    }

    updateKyc.mutate(
      { sellerId: seller.sellerId, data: filteredData },
      {
        onSuccess: () => {
          onClose();
          reset();
        },
      }
    );
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Edit KYC Details" size="lg">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
        {/* Business Information */}
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-3">Business Information</h4>
          <div className="grid grid-cols-2 gap-4">
            <Input
              id="businessName"
              label="Business Name"
              placeholder="Enter business name"
              error={errors.businessName?.message}
              {...register('businessName')}
            />
            <Input
              id="panNumber"
              label="PAN Number"
              placeholder="ABCDE1234F"
              error={errors.panNumber?.message}
              {...register('panNumber')}
            />
            <Input
              id="gstin"
              label="GSTIN"
              placeholder="29ABCDE1234F1Z5"
              error={errors.gstin?.message}
              {...register('gstin')}
              className="col-span-2"
            />
          </div>
        </div>

        {/* Address */}
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-3">Address</h4>
          <div className="grid grid-cols-2 gap-4">
            <Input
              id="registeredAddress"
              label="Registered Address"
              placeholder="Full address"
              error={errors.registeredAddress?.message}
              {...register('registeredAddress')}
              className="col-span-2"
            />
            <Input
              id="city"
              label="City"
              placeholder="City"
              error={errors.city?.message}
              {...register('city')}
            />
            <Input
              id="state"
              label="State"
              placeholder="State"
              error={errors.state?.message}
              {...register('state')}
            />
            <Input
              id="pincode"
              label="Pincode"
              placeholder="560001"
              error={errors.pincode?.message}
              {...register('pincode')}
            />
          </div>
        </div>

        {/* Contact Person */}
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-3">Contact Person</h4>
          <div className="grid grid-cols-2 gap-4">
            <Input
              id="contactPersonName"
              label="Name"
              placeholder="Contact person name"
              error={errors.contactPersonName?.message}
              {...register('contactPersonName')}
            />
            <Input
              id="contactPersonPhone"
              label="Phone"
              placeholder="9876543210"
              error={errors.contactPersonPhone?.message}
              {...register('contactPersonPhone')}
            />
            <Input
              id="contactPersonEmail"
              label="Email"
              type="email"
              placeholder="contact@example.com"
              error={errors.contactPersonEmail?.message}
              {...register('contactPersonEmail')}
              className="col-span-2"
            />
          </div>
        </div>

        {/* Bank Details */}
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-3">Bank Account Details</h4>
          <div className="grid grid-cols-2 gap-4">
            <Input
              id="accountHolderName"
              label="Account Holder Name"
              placeholder="Name as per bank"
              error={errors.accountHolderName?.message}
              {...register('accountHolderName')}
            />
            <Input
              id="ifscCode"
              label="IFSC Code"
              placeholder="HDFC0001234"
              error={errors.ifscCode?.message}
              {...register('ifscCode')}
            />
            <Input
              id="accountNumber"
              label="Account Number"
              placeholder="123456789012"
              error={errors.accountNumber?.message}
              {...register('accountNumber')}
              className="col-span-2"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t border-gray-200 sticky bottom-0 bg-white">
          <Button type="button" variant="secondary" onClick={handleClose} className="flex-1">
            Cancel
          </Button>
          <Button type="submit" loading={updateKyc.isPending} disabled={!isDirty} className="flex-1">
            Save Changes
          </Button>
        </div>
      </form>
    </Modal>
  );
}
