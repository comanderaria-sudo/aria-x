import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { CheckCircle } from 'lucide-react';

export default function Upgrade() {
  const { user } = useAuth();

  const handleCheckout = async () => {
    if (!user) return;

    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email }),
      });

      const { url } = await response.json();
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error('Checkout failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Upgrade to Pro</h1>
          <p className="text-xl text-slate-600">
            Unlock full access to ARIA-X revenue recovery
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Free Tier */}
          <Card className="p-8 opacity-75">
            <h2 className="text-2xl font-bold mb-6">Free</h2>
            <p className="text-4xl font-bold mb-2">$0</p>
            <p className="text-slate-600 mb-8">Forever</p>

            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-slate-400" />
                <span className="text-slate-600">Limited demo access</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-slate-400" />
                <span className="text-slate-600">5 findings per month</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-slate-400" />
                <span className="text-slate-600">Basic support</span>
              </li>
            </ul>

            <Button disabled className="w-full" variant="outline">
              Current Plan
            </Button>
          </Card>

          {/* Pro Tier */}
          <Card className="p-8 border-2 border-blue-600 relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">
              Recommended
            </div>

            <h2 className="text-2xl font-bold mb-6">Pro</h2>
            <p className="text-4xl font-bold mb-2">$29</p>
            <p className="text-slate-600 mb-8">per month</p>

            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="font-medium">Full dashboard access</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="font-medium">Unlimited findings</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="font-medium">Real-time execution</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="font-medium">Priority support</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="font-medium">API access</span>
              </li>
            </ul>

            <Button
              onClick={handleCheckout}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Upgrade to Pro
            </Button>
          </Card>
        </div>

        <div className="mt-12 bg-white rounded-lg p-8 border border-slate-200">
          <h3 className="text-lg font-semibold mb-4">What's included in Pro?</h3>
          <ul className="grid md:grid-cols-2 gap-4 text-slate-600">
            <li>✓ Scan unlimited invoices and leads</li>
            <li>✓ AI-powered recovery recommendations</li>
            <li>✓ Real-time execution tracking</li>
            <li>✓ Revenue impact analytics</li>
            <li>✓ Email and calendar integration</li>
            <li>✓ 24/7 priority support</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
