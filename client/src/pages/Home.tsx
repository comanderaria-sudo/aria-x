import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowRight } from "lucide-react";
import { useLocation } from "wouter";
import { Card } from "@/components/ui/card";

export default function Home() {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4">Welcome back, {user.email}</h1>
            <p className="text-xl text-slate-600 mb-8">
              Ready to recover revenue?
            </p>
            <Button
              onClick={() => setLocation('/dashboard')}
              className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-6"
            >
              Go to Dashboard
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-2">🎯 Find</h3>
              <p className="text-slate-600">
                Automatically scan for unpaid invoices and dormant leads
              </p>
            </Card>
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-2">🔧 Fix</h3>
              <p className="text-slate-600">
                Get AI-powered recommendations for recovery actions
              </p>
            </Card>
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-2">💰 Recover</h3>
              <p className="text-slate-600">
                Execute actions and track revenue recovery in real-time
              </p>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold mb-4">ARIA-X</h1>
          <p className="text-2xl text-slate-600 mb-2">Revenue Recovery Platform</p>
          <p className="text-xl text-slate-500 mb-8">Find → Fix → Recover</p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-3xl font-bold mb-6">The Problem</h2>
            <ul className="space-y-4 text-lg text-slate-600">
              <li>✗ Unpaid invoices slip through the cracks</li>
              <li>✗ Dormant leads never get followed up</li>
              <li>✗ Revenue recovery is manual and time-consuming</li>
              <li>✗ You're leaving money on the table</li>
            </ul>
          </div>

          <div>
            <h2 className="text-3xl font-bold mb-6">The Solution</h2>
            <ul className="space-y-4 text-lg text-slate-600">
              <li>✓ AI scans your business data automatically</li>
              <li>✓ Identifies recovery opportunities with confidence scores</li>
              <li>✓ Recommends actions (email, calendar, invoices)</li>
              <li>✓ You approve, ARIA-X executes</li>
            </ul>
          </div>
        </div>

        <div className="bg-white rounded-lg p-12 mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">Live Demo Results</h2>
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div className="text-center">
              <p className="text-5xl font-bold text-green-600 mb-2">$8,200</p>
              <p className="text-slate-600">Unpaid Invoices</p>
            </div>
            <div className="text-center">
              <p className="text-5xl font-bold text-green-600 mb-2">$3,500</p>
              <p className="text-slate-600">Dormant Leads</p>
            </div>
            <div className="text-center">
              <p className="text-5xl font-bold text-green-600 mb-2">$11,700</p>
              <p className="text-slate-600">Total Recoverable</p>
            </div>
          </div>
          <p className="text-center text-slate-600">Scanned in 60 seconds</p>
        </div>

        <div className="text-center">
          <h2 className="text-3xl font-bold mb-8">Ready to get started?</h2>
          <div className="flex gap-4 justify-center">
            <Button
              onClick={() => setLocation('/signup')}
              className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-6"
            >
              Sign Up Free
            </Button>
            <Button
              onClick={() => setLocation('/login')}
              variant="outline"
              className="text-lg px-8 py-6"
            >
              Sign In
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
