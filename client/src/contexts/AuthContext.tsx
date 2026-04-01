import React, { createContext, useContext, useEffect, useState } from 'react';
import { trpc } from '@/lib/trpc';
import type { User } from '@shared/types';

type AuthContextType = {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Get current user from backend
  const { data: currentUser, isLoading } = trpc.auth.me.useQuery();

  useEffect(() => {
    if (!isLoading) {
      setUser(currentUser || null);
      setLoading(false);
    }
  }, [currentUser, isLoading]);

  return (
    <AuthContext.Provider value={{ user, loading, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
