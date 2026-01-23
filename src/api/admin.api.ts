import api from './axios';
import type {
  AdminLoginRequest,
  AdminLoginResponse,
  AdminSessionResponse,
  ListBlockedUsersResponse,
  GetUserResponse,
  UpdateUserRequest,
  BlockUserRequest,
  ListPendingKycResponse,
  UpdateSellerKycRequest,
  RejectKycRequest,
  SearchTransactionsResponse,
  ListDisputedTransactionsResponse,
} from '@/types';

// ============================================
// Auth APIs
// ============================================

export const adminAuthApi = {
  login: async (data: AdminLoginRequest): Promise<AdminLoginResponse> => {
    const response = await api.post<{ data: AdminLoginResponse }>('/admin/auth/login', data);
    return response.data.data;
  },

  logout: async (): Promise<void> => {
    await api.post('/admin/auth/logout');
  },

  verifySession: async (): Promise<AdminSessionResponse> => {
    const response = await api.get<{ data: AdminSessionResponse }>('/admin/auth/session');
    return response.data.data;
  },
};

// ============================================
// User Management APIs
// ============================================

export const adminUsersApi = {
  getUser: async (phone: string): Promise<GetUserResponse> => {
    const response = await api.get<{ data: GetUserResponse }>(`/admin/users/${phone}`);
    return response.data.data;
  },

  updateUser: async (phone: string, data: UpdateUserRequest): Promise<GetUserResponse> => {
    const response = await api.patch<{ data: { user: GetUserResponse } }>(`/admin/users/${phone}`, data);
    return response.data.data.user;
  },

  deleteUser: async (phone: string): Promise<void> => {
    await api.delete(`/admin/users/${phone}`);
  },

  blockUser: async (phone: string, data: BlockUserRequest): Promise<void> => {
    await api.post(`/admin/users/${phone}/block`, data);
  },

  unblockUser: async (phone: string): Promise<void> => {
    await api.post(`/admin/users/${phone}/unblock`);
  },

  listBlockedUsers: async (page = 1, limit = 20): Promise<ListBlockedUsersResponse> => {
    const response = await api.get<{ data: ListBlockedUsersResponse }>('/admin/users/blocked', {
      params: { page, limit },
    });
    return response.data.data;
  },
};

// ============================================
// KYC Management APIs
// ============================================

export const adminKycApi = {
  listPendingKyc: async (
    page = 1,
    limit = 20,
    status?: string
  ): Promise<ListPendingKycResponse> => {
    const response = await api.get<{ data: ListPendingKycResponse }>('/admin/sellers/pending-kyc', {
      params: { page, limit, status },
    });
    return response.data.data;
  },

  updateSellerKyc: async (sellerId: string, data: UpdateSellerKycRequest): Promise<void> => {
    await api.patch(`/admin/sellers/${sellerId}/kyc`, data);
  },

  approveKyc: async (sellerId: string): Promise<void> => {
    await api.post(`/admin/sellers/${sellerId}/kyc/approve`);
  },

  rejectKyc: async (sellerId: string, data: RejectKycRequest): Promise<void> => {
    await api.post(`/admin/sellers/${sellerId}/kyc/reject`, data);
  },
};

// ============================================
// Transaction Management APIs
// ============================================

export const adminTransactionsApi = {
  search: async (
    params: {
      code?: string;
      buyerPhone?: string;
      sellerPhone?: string;
      page?: number;
      limit?: number;
    }
  ): Promise<SearchTransactionsResponse> => {
    const response = await api.get<{ data: SearchTransactionsResponse }>('/admin/transactions/search', {
      params,
    });
    return response.data.data;
  },

  listDisputed: async (page = 1, limit = 20): Promise<ListDisputedTransactionsResponse> => {
    const response = await api.get<{ data: ListDisputedTransactionsResponse }>('/admin/transactions/disputed', {
      params: { page, limit },
    });
    return response.data.data;
  },
};
