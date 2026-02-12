// Admin Types
export type AdminRole = 'superadmin' | 'admin' | 'support' | 'viewer';

export interface AdminUser {
  id: string;
  username: string;
  role: AdminRole;
  createdAt: string;
}

export interface AdminLoginRequest {
  username: string;
  password: string;
}

export interface AdminLoginResponse {
  accessToken: string;
  expiresIn: number;
  admin: AdminUser;
}

export interface AdminSessionResponse {
  valid: boolean;
  admin?: AdminUser;
}

// Pagination
export interface Pagination {
  totalCount: number;
  totalPages: number;
  currentPage: number;
  limit: number;
  hasMore: boolean;
}

// KYC Types
export type KycStatus = 'NOT_STARTED' | 'PENDING' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED';
export type VerificationStatus = 'PENDING' | 'VERIFIED' | 'FAILED';
export type BusinessType = 'INDIVIDUAL' | 'PARTNERSHIP' | 'PRIVATE_LIMITED' | 'LLP' | 'PUBLIC_LIMITED';

export interface PendingKycSellerUser {
  id: string;
  name: string;
  email?: string;
  phone: string;
  verified: boolean;
  createdAt: string;
}

export interface PendingKycSellerKyc {
  kycStatus: KycStatus;
  basicDetailsSubmitted: boolean;
  panVerified: boolean;
  bankVerified: boolean;
  rejectionReason?: string;
  submittedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PendingKycSellerBasicDetails {
  businessName?: string;
  businessType?: BusinessType;
  panNumber?: string;
  gstin?: string;
  city?: string;
  state?: string;
  contactPersonName?: string;
  contactPersonEmail?: string;
  contactPersonPhone?: string;
}

export interface PendingKycSellerItem {
  sellerId: string;
  user: PendingKycSellerUser;
  kyc: PendingKycSellerKyc;
  basicDetails?: PendingKycSellerBasicDetails;
  totalTransactions: number;
  averageRating: number;
  totalReviews: number;
  createdAt: string;
}

export interface ListPendingKycResponse {
  sellers: PendingKycSellerItem[];
  pagination: Pagination;
}

export interface KycDetailsResponse {
  sellerId: string;
  kycStatus: KycStatus;
  completionPercentage: number;
  businessName?: string;
  businessType?: BusinessType;
  panNumber?: string;
  panVerificationStatus: VerificationStatus;
  nameOnPan?: string;
  gstin?: string;
  registeredAddress?: string;
  city?: string;
  state?: string;
  pincode?: string;
  contactPersonName?: string;
  contactPersonEmail?: string;
  contactPersonPhone?: string;
  bankAccountNumber?: string;
  bankIfscCode?: string;
  bankName?: string;
  bankAccountHolderName?: string;
  bankVerificationStatus: VerificationStatus;
  rejectionReason?: string;
  rejectedAt?: string;
  approvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateSellerKycRequest {
  businessName?: string;
  panNumber?: string;
  gstin?: string;
  registeredAddress?: string;
  city?: string;
  state?: string;
  pincode?: string;
  contactPersonName?: string;
  contactPersonEmail?: string;
  contactPersonPhone?: string;
  accountHolderName?: string;
  accountNumber?: string;
  ifscCode?: string;
}

export interface RejectKycRequest {
  reason: string;
}

// User Types
export type HeardAboutUs = 'INSTAGRAM' | 'YOUTUBE' | 'GOOGLE' | 'FRIEND' | 'LINKEDIN' | 'PARTNER' | 'EVENT' | 'AD' | 'OTHER';

export interface UserSellerDetails {
  sellerId: string;
  businessName?: string;
  gstNumber?: string;
  totalTransactions: number;
  averageRating: number;
  totalReviews: number;
  payoutVerified: boolean;
}

export interface UserKycDetails {
  kycStatus: KycStatus;
  basicDetailsSubmitted: boolean;
  panVerified: boolean;
  bankVerified: boolean;
  panNumber?: string;
  rejectionReason?: string;
}

export interface UserBasicDetails {
  businessName?: string;
  panNumber?: string;
  gstin?: string;
  registeredAddress?: string;
  city?: string;
  state?: string;
  pincode?: string;
  contactPersonName?: string;
  contactPersonEmail?: string;
  contactPersonPhone?: string;
}

export interface UserPayoutSummary {
  totalPending: number;
  totalCompleted: number;
  pendingCount: number;
  completedCount: number;
}

export interface GetUserResponse {
  id: string;
  name: string;
  phone: string;
  email?: string;
  verified: boolean;
  emailVerified: boolean;
  profilePicture?: string;
  heardAboutUs?: HeardAboutUs;
  isSeller: boolean;
  isBlocked: boolean;
  blockedAt?: string;
  createdAt: string;
  updatedAt: string;
  sellerDetails?: UserSellerDetails;
  kycDetails?: UserKycDetails;
  basicDetails?: UserBasicDetails;
  bankAccounts?: unknown[];
  payoutSummary?: UserPayoutSummary;
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
}

export interface BlockUserRequest {
  reason: string;
}

export interface BlockedUserItem {
  id: string;
  name: string;
  phone: string;
  email?: string;
  blockedAt: string;
  reason: string;
  blockedByUsername?: string;
}

export interface ListBlockedUsersResponse {
  users: BlockedUserItem[];
  pagination: Pagination;
}

// Transaction Types
export type TransactionStatus = 'CREATED' | 'JOINED' | 'PENDING_PAYMENT' | 'PAID' | 'DISPATCHED' | 'DISPUTED' | 'RESOLVED' | 'COMPLETED' | 'READY_FOR_PAYOUT' | 'PAYOUT_INITIATED' | 'FULFILLED' | 'REFUNDED' | 'CANCELLED' | 'SPLIT_SETTLED';
export type OwnerType = 'BUYER' | 'SELLER';
export type DeliveryMethod = 
  // New delivery methods
  | 'COURIER' 
  | 'LOCAL_PICKUP_DROP' 
  | 'IN_PERSON_HANDOVER' 
  | 'DIGITAL_DELIVERY' 
  | 'SERVICE_COMPLETION'
  // Legacy values (backward compatibility)
  | 'PICKUP'
  | 'DIGITAL'
  | 'IN_PERSON';
export type AdminDisputeDecision = 'REFUND' | 'PAYOUT' | 'SPLIT';

export interface TransactionParty {
  id: string;
  name: string;
  phone: string;
  email?: string;
  profilePicture?: string;
}

export interface TransactionSearchResult {
  id: string;
  txnCode: string;
  title: string;
  amount: number;
  description?: string;
  status: TransactionStatus;
  ownerType: OwnerType;
  deliveryMethod?: DeliveryMethod;
  trackingLink?: string;
  chatLink?: string;
  buyer?: TransactionParty;
  seller?: TransactionParty;
  paidAt?: string;
  createdAt: string;
  lastUpdatedAt: string;
}

export interface SearchTransactionsResponse {
  transactions: TransactionSearchResult[];
  pagination: Pagination;
}

export interface DisputeAttachment {
  url: string;
  name: string;
  type: string;
}

export interface DisputedTransaction extends TransactionSearchResult {
  disputeReason?: string;
  disputeDescription?: string;
  disputeAttachments?: DisputeAttachment[];
  disputedAt?: string;
}

export interface ListDisputedTransactionsResponse {
  transactions: DisputedTransaction[];
  pagination: Pagination;
}

export interface MarkResolvedRequest {
  resolutionNotes?: string;
}

export interface AdminResolveDisputeRequest {
  decision: AdminDisputeDecision;
  buyerRefundAmount?: number;
  sellerPayoutAmount?: number;
  notes?: string;
}

export interface AdminResolveDisputeResponse {
  message: string;
  transactionId: string;
  decision: AdminDisputeDecision;
  status: TransactionStatus;
  buyerRefundAmount?: number;
  sellerPayoutAmount?: number;
  resolvedAt: string;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  meta?: { timestamp: string };
  error?: null;
  traceId?: string;
}

export interface ApiError {
  data: null;
  error: {
    code: string;
    message: string;
    details?: unknown[];
  };
  traceId?: string;
}
