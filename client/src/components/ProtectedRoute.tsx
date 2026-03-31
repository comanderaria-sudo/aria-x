import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from 'wouter';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

type ProtectedRouteProps = {
  children: React.ReactNode;
  requirePro?: boolean;
};

export function ProtectedRoute({ children, requirePro = false }: ProtectedRouteProps) {
  const { user, loading, subscriptionTier } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        setLocation('/login');
      } else if (requirePro && subscriptionTier !== 'pro') {
        setLocation('/upgrade');
      }
    }
  }, [user, loading, subscriptionTier, requirePro, setLocation]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (requirePro && subscriptionTier !== 'pro') {
    return null;
  }

  return <>{children}</>;
}
