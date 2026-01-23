import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminTransactionsApi, transactionsApi } from '@/api';
import type { MarkResolvedRequest } from '@/types';
import toast from 'react-hot-toast';

export const TRANSACTIONS_QUERY_KEYS = {
  search: (params: Record<string, unknown>) => ['transactions', 'search', params] as const,
  disputed: (page: number) => ['transactions', 'disputed', page] as const,
};

export function useSearchTransactions(params: {
  code?: string;
  buyerPhone?: string;
  sellerPhone?: string;
  page?: number;
}) {
  return useQuery({
    queryKey: TRANSACTIONS_QUERY_KEYS.search(params),
    queryFn: () => adminTransactionsApi.search(params),
    enabled: !!(params.code || params.buyerPhone || params.sellerPhone),
  });
}

export function useDisputedTransactions(page: number) {
  return useQuery({
    queryKey: TRANSACTIONS_QUERY_KEYS.disputed(page),
    queryFn: () => adminTransactionsApi.listDisputed(page, 20),
  });
}

export function useCompleteTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => transactionsApi.complete(id),
    onSuccess: () => {
      toast.success('Transaction marked as completed');
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
    onError: () => {
      toast.error('Failed to complete transaction');
    },
  });
}

export function useMarkResolved() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data?: MarkResolvedRequest }) =>
      transactionsApi.markResolved(id, data),
    onSuccess: () => {
      toast.success('Transaction dispute resolved');
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
    onError: () => {
      toast.error('Failed to resolve dispute');
    },
  });
}
