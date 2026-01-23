import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminKycApi, kycApi } from '@/api';
import type { UpdateSellerKycRequest, RejectKycRequest, KycStatus } from '@/types';
import toast from 'react-hot-toast';

export const KYC_QUERY_KEYS = {
  pendingList: (page: number, status?: KycStatus) => ['kyc', 'pending', page, status] as const,
  details: (sellerId: string) => ['kyc', 'details', sellerId] as const,
};

export function usePendingKycList(page: number, status?: KycStatus) {
  return useQuery({
    queryKey: KYC_QUERY_KEYS.pendingList(page, status),
    queryFn: () => adminKycApi.listPendingKyc(page, 20, status),
  });
}

export function useKycDetails(sellerId: string | null) {
  return useQuery({
    queryKey: KYC_QUERY_KEYS.details(sellerId || ''),
    queryFn: () => kycApi.getDetails(sellerId!),
    enabled: !!sellerId,
  });
}

export function useUpdateKyc() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ sellerId, data }: { sellerId: string; data: UpdateSellerKycRequest }) =>
      adminKycApi.updateSellerKyc(sellerId, data),
    onSuccess: (_, { sellerId }) => {
      toast.success('KYC details updated');
      queryClient.invalidateQueries({ queryKey: KYC_QUERY_KEYS.details(sellerId) });
      queryClient.invalidateQueries({ queryKey: ['kyc', 'pending'] });
    },
    onError: () => {
      toast.error('Failed to update KYC details');
    },
  });
}

export function useApproveKyc() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sellerId: string) => adminKycApi.approveKyc(sellerId),
    onSuccess: (_, sellerId) => {
      toast.success('KYC approved successfully');
      queryClient.invalidateQueries({ queryKey: KYC_QUERY_KEYS.details(sellerId) });
      queryClient.invalidateQueries({ queryKey: ['kyc', 'pending'] });
    },
    onError: () => {
      toast.error('Failed to approve KYC');
    },
  });
}

export function useRejectKyc() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ sellerId, data }: { sellerId: string; data: RejectKycRequest }) =>
      adminKycApi.rejectKyc(sellerId, data),
    onSuccess: (_, { sellerId }) => {
      toast.success('KYC rejected');
      queryClient.invalidateQueries({ queryKey: KYC_QUERY_KEYS.details(sellerId) });
      queryClient.invalidateQueries({ queryKey: ['kyc', 'pending'] });
    },
    onError: () => {
      toast.error('Failed to reject KYC');
    },
  });
}
