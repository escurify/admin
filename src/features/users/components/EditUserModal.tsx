import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useUpdateUser } from '../hooks/useUsers';
import type { GetUserResponse } from '@/types';

const editUserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name is too long'),
  email: z.string().email('Invalid email address').or(z.literal('')).optional(),
});

type EditUserFormData = z.infer<typeof editUserSchema>;

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: GetUserResponse;
  phone: string;
}

export function EditUserModal({ isOpen, onClose, user, phone }: EditUserModalProps) {
  const updateUser = useUpdateUser();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditUserFormData>({
    resolver: zodResolver(editUserSchema),
    defaultValues: {
      name: user.name,
      email: user.email || '',
    },
  });

  const onSubmit = (data: EditUserFormData) => {
    updateUser.mutate(
      { phone, data: { name: data.name, email: data.email || undefined } },
      {
        onSuccess: () => {
          onClose();
          reset();
        },
      }
    );
  };

  const handleClose = () => {
    reset({ name: user.name, email: user.email || '' });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Edit User" size="md">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          id="name"
          label="Full Name"
          placeholder="Enter full name"
          error={errors.name?.message}
          {...register('name')}
        />

        <Input
          id="email"
          label="Email Address"
          type="email"
          placeholder="Enter email address"
          error={errors.email?.message}
          {...register('email')}
        />

        <div className="flex gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={handleClose} className="flex-1">
            Cancel
          </Button>
          <Button type="submit" loading={updateUser.isPending} className="flex-1">
            Save Changes
          </Button>
        </div>
      </form>
    </Modal>
  );
}
