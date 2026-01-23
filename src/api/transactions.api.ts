import api from './axios';
import type { MarkResolvedRequest } from '@/types';

export const transactionsApi = {
  complete: async (id: string): Promise<void> => {
    await api.patch(`/transactions/${id}/complete`);
  },

  markResolved: async (id: string, data?: MarkResolvedRequest): Promise<void> => {
    await api.post(`/transactions/${id}/mark-resolved`, data || {});
  },
};
