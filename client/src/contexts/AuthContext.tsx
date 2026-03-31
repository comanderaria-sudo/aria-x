import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase-client';
import type { User } from '@supabase/supabase-js';

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  subscriptionTier: 'free' | 'pro';
  isSupabaseAvailable: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [subscriptionTier, setSubscriptionTier] = useState<'free' | 'pro'>('free');
  const isSupabaseAvailable = !!supabase;

  useEffect(() => {
    // Check if user is logged in on mount
    const checkAuth = async () => {
      try {
        if (!supabase) {
          console.warn('[Auth] Supabase not available');
          setLoading(false);
          return;
        }

        const { data } = await supabase.auth.getSession();
        setUser(data.session?.user || null);
        
        // TODO: Fetch subscription tier from database
        if (data.session?.user) {
          setSubscriptionTier('free'); // Default to free for now
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    // Listen for auth changes
    if (supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event: any, session: any) => {
          setUser(session?.user || null);
          if (session?.user) {
            setSubscriptionTier('free'); // TODO: Fetch from database
          } else {
            setSubscriptionTier('free');
          }
        }
      );

      return () => {
        subscription?.unsubscribe();
      };
    }
  }, []);

  const signUp = async (email: string, password: string) => {
    if (!supabase) {
      throw new Error('Authentication is not available');
    }
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) throw error;
  };

  const signIn = async (email: string, password: string) => {
    if (!supabase) {
      throw new Error('Authentication is not available');
    }
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
  };

  const signOut = async () => {
    if (!supabase) {
      throw new Error('Authentication is not available');
    }
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut, subscriptionTier, isSupabaseAvailable }}>
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
