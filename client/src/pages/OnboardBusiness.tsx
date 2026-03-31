import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Loader2, ArrowRight } from 'lucide-react';
import { trpc } from '@/lib/trpc';

export default function OnboardBusiness() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [step, setStep] = useState<'info' | 'data'>('info');
  const [businessName, setBusinessName] = useState('');
  const [industry, setIndustry] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCreateBusiness = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // TODO: Call tRPC to create business
      // For now, just proceed to next step
      setStep('data');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create business');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  if (step === 'info') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <Card className="p-8">
            <h1 className="text-3xl font-bold mb-2">Connect Your Business</h1>
            <p className="text-slate-600 mb-8">
              Tell us about your business so ARIA-X can find revenue recovery opportunities
            </p>

            <form onSubmit={handleCreateBusiness} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Business Name
                </label>
                <Input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="Your Company Inc."
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Industry
                </label>
                <select
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  disabled={loading}
                >
                  <option value="">Select an industry</option>
                  <option value="saas">SaaS</option>
                  <option value="ecommerce">E-commerce</option>
                  <option value="services">Services</option>
                  <option value="consulting">Consulting</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                disabled={loading || !businessName || !industry}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating business...
                  </>
                ) : (
                  <>
                    Continue
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </form>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <Card className="p-8 mb-8">
          <h1 className="text-3xl font-bold mb-2">Add Your Business Data</h1>
          <p className="text-slate-600 mb-8">
            Import your invoices and leads so ARIA-X can find recovery opportunities
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Invoices */}
            <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center">
              <div className="text-4xl mb-4">📄</div>
              <h3 className="text-lg font-semibold mb-2">Unpaid Invoices</h3>
              <p className="text-slate-600 mb-6">
                Upload a CSV or manually add unpaid invoices
              </p>
              <div className="space-y-3">
                <Button variant="outline" className="w-full">
                  Upload CSV
                </Button>
                <Button variant="outline" className="w-full">
                  Add Manually
                </Button>
              </div>
            </div>

            {/* Leads */}
            <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-lg font-semibold mb-2">Dormant Leads</h3>
              <p className="text-slate-600 mb-6">
                Add contacts you haven't followed up with recently
              </p>
              <div className="space-y-3">
                <Button variant="outline" className="w-full">
                  Upload CSV
                </Button>
                <Button variant="outline" className="w-full">
                  Add Manually
                </Button>
              </div>
            </div>
          </div>
        </Card>

        <div className="text-center">
          <Button
            onClick={() => setLocation('/dashboard')}
            className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-6"
          >
            Skip for Now
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          <p className="text-slate-600 mt-4">
            You can add data anytime from the dashboard
          </p>
        </div>
      </div>
    </div>
  );
}
