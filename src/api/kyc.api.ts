import api from './axios';
import type { KycDetailsResponse } from '@/types';

export const kycApi = {
  getDetails: async (sellerId: string): Promise<KycDetailsResponse> => {
    const response = await api.get<{ data: KycDetailsResponse }>(`/kyc/seller/${sellerId}/details`);
    return response.data.data;
  },
};
