import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminUsersApi } from '@/api';
import type { UpdateUserRequest, BlockUserRequest } from '@/types';
import toast from 'react-hot-toast';

export const USERS_QUERY_KEYS = {
  user: (phone: string) => ['users', 'user', phone] as const,
  blockedList: (page: number) => ['users', 'blocked', page] as const,
};

export function useUser(phone: string | null) {
  return useQuery({
    queryKey: USERS_QUERY_KEYS.user(phone || ''),
    queryFn: () => adminUsersApi.getUser(phone!),
    enabled: !!phone,
    retry: false,
  });
}

export function useBlockedUsers(page: number) {
  return useQuery({
    queryKey: USERS_QUERY_KEYS.blockedList(page),
    queryFn: () => adminUsersApi.listBlockedUsers(page, 20),
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ phone, data }: { phone: string; data: UpdateUserRequest }) =>
      adminUsersApi.updateUser(phone, data),
    onSuccess: (_, { phone }) => {
      toast.success('User updated successfully');
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEYS.user(phone) });
    },
    onError: () => {
      toast.error('Failed to update user');
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (phone: string) => adminUsersApi.deleteUser(phone),
    onSuccess: () => {
      toast.success('User deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: () => {
      toast.error('Failed to delete user');
    },
  });
}

export function useBlockUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ phone, data }: { phone: string; data: BlockUserRequest }) =>
      adminUsersApi.blockUser(phone, data),
    onSuccess: (_, { phone }) => {
      toast.success('User blocked successfully');
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEYS.user(phone) });
      queryClient.invalidateQueries({ queryKey: ['users', 'blocked'] });
    },
    onError: () => {
      toast.error('Failed to block user');
    },
  });
}

export function useUnblockUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (phone: string) => adminUsersApi.unblockUser(phone),
    onSuccess: (_, phone) => {
      toast.success('User unblocked successfully');
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEYS.user(phone) });
      queryClient.invalidateQueries({ queryKey: ['users', 'blocked'] });
    },
    onError: () => {
      toast.error('Failed to unblock user');
    },
  });
}
