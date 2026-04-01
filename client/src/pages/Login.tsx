import { useEffect } from 'react';
import { useAuth } from '@/_core/hooks/useAuth';
import { getLoginUrl } from '@/const';
import { Loader2 } from 'lucide-react';

export default function Login() {
  const { user } = useAuth();

  useEffect(() => {
    // If already logged in, redirect to dashboard
    if (user) {
      window.location.href = '/dashboard';
      return;
    }

    // Otherwise, redirect to Manus OAuth login
    window.location.href = getLoginUrl();
  }, [user]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">ARIA-X</h1>
        <p className="text-slate-600 mb-8">Revenue Recovery Platform</p>
        <div className="flex items-center justify-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
          <p className="text-slate-600">Redirecting to login...</p>
        </div>
      </div>
    </div>
  );
}
