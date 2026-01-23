import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/auth/AuthContext';
import { AuthGuard } from '@/auth/AuthGuard';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import LoginPage from '@/pages/LoginPage';
import DashboardPage from '@/pages/DashboardPage';
import PendingKycPage from '@/features/kyc/pages/PendingKycPage';
import SearchUserPage from '@/features/users/pages/SearchUserPage';
import BlockedUsersPage from '@/features/users/pages/BlockedUsersPage';
import DisputedTransactionsPage from '@/features/transactions/pages/DisputedTransactionsPage';
import SearchTransactionsPage from '@/features/transactions/pages/SearchTransactionsPage';

function App() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />}
      />

      {/* Protected routes */}
      <Route element={<AuthGuard />}>
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/kyc/pending" element={<PendingKycPage />} />
          <Route path="/users/search" element={<SearchUserPage />} />
          <Route path="/users/blocked" element={<BlockedUsersPage />} />
          <Route path="/transactions/disputed" element={<DisputedTransactionsPage />} />
          <Route path="/transactions/search" element={<SearchTransactionsPage />} />
        </Route>
      </Route>

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
