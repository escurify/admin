import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { adminAuthApi } from '@/api';
import type { AdminUser, AdminLoginRequest } from '@/types';

interface AuthContextType {
  user: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: AdminLoginRequest) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Verify session on mount
  useEffect(() => {
    const verifySession = async () => {
      const token = localStorage.getItem('adminToken');
      const storedUser = localStorage.getItem('adminUser');

      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        // First try to use stored user for instant UI
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }

        // Then verify with server
        const session = await adminAuthApi.verifySession();
        if (session.valid && session.admin) {
          setUser(session.admin);
          localStorage.setItem('adminUser', JSON.stringify(session.admin));
        } else {
          // Invalid session
          localStorage.removeItem('adminToken');
          localStorage.removeItem('adminUser');
          setUser(null);
        }
      } catch {
        // Session verification failed
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    verifySession();
  }, []);

  const login = useCallback(async (credentials: AdminLoginRequest) => {
    const response = await adminAuthApi.login(credentials);
    localStorage.setItem('adminToken', response.accessToken);
    localStorage.setItem('adminUser', JSON.stringify(response.admin));
    setUser(response.admin);
  }, []);

  const logout = useCallback(async () => {
    try {
      await adminAuthApi.logout();
    } catch {
      // Ignore errors during logout
    } finally {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      setUser(null);
    }
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
