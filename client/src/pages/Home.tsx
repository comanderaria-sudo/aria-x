import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, TrendingUp, AlertCircle, CheckCircle2, ArrowRight, Zap } from "lucide-react";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import React from "react";

export default function Home() {
  const { user, loading, isAuthenticated } = useAuth();
  const [demoRunning, setDemoRunning] = useState(false);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [findings, setFindings] = useState<any[]>([]);

  const runCycleMutation = trpc.agent.runCycle.useMutation();
  const getFindingsQuery = trpc.agent.getFindings.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  // Update findings when query data changes
  React.useEffect(() => {
    if (getFindingsQuery.data) {
      setFindings(getFindingsQuery.data);
    }
  }, [getFindingsQuery.data]);

  const handleRunDemo = async () => {
    setDemoRunning(true);
    try {
      const result = await runCycleMutation.mutateAsync();
      setTotalRevenue(result.totalValue);

      // Fetch findings
      const findingsData = await getFindingsQuery.refetch();
      setFindings(findingsData.data || []);
    } catch (error) {
      console.error("Demo error:", error);
    } finally {
      setDemoRunning(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin w-8 h-8 text-blue-600" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">ARIA-X</h1>
          <p className="text-xl text-slate-700 mb-2">Revenue Recovery</p>
          <p className="text-slate-600 mb-8 text-lg font-medium">Find → Fix → Recover</p>
          <p className="text-slate-600 mb-8">Automatically detect and recover lost revenue from unpaid invoices and dormant leads.</p>
          <a href={getLoginUrl()}>
            <Button size="lg" className="w-full">
              Sign In to Get Started
            </Button>
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Revenue Recovery</h1>
              <p className="text-slate-600 mt-1">Find → Fix → Recover</p>
            </div>
            <div className="flex gap-4">
              <a href="/dashboard">
                <Button variant="outline">Dashboard</Button>
              </a>
              <Button onClick={handleRunDemo} disabled={demoRunning}>
                {demoRunning ? (
                  <>
                    <Loader2 className="animate-spin mr-2 w-4 h-4" />
                    Scanning...
                  </>
                ) : (
                  <>
                    <Zap className="mr-2 w-4 h-4" />
                    Run Scan
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Revenue Counter */}
        {totalRevenue > 0 && (
          <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 mb-8">
            <div className="p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-2">Revenue Recovered</p>
                  <p className="text-5xl font-bold text-green-600">${totalRevenue.toLocaleString()}</p>
                  <p className="text-sm text-slate-600 mt-2">in this scan</p>
                </div>
                <CheckCircle2 className="w-16 h-16 text-green-500" />
              </div>
            </div>
          </Card>
        )}

        {/* Findings Grid */}
        {findings.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Recovery Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {findings.map((finding) => (
                <Card key={finding.id} className="hover:shadow-lg transition-shadow">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900 mb-2 line-clamp-2">{finding.issue}</h3>
                        <p className="text-sm text-slate-600 line-clamp-2">{finding.recommendedAction}</p>
                      </div>
                      {finding.type === "invoice" && <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 ml-2" />}
                      {finding.type === "lead" && <TrendingUp className="w-5 h-5 text-blue-500 flex-shrink-0 ml-2" />}
                      {finding.type === "calendar" && <CheckCircle2 className="w-5 h-5 text-slate-500 flex-shrink-0 ml-2" />}
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-2xl font-bold text-slate-900">${finding.value.toLocaleString()}</p>
                        <p className="text-xs text-slate-500">Confidence: {finding.confidence}%</p>
                      </div>
                      <Button size="sm" variant="default">
                        Approve
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {findings.length === 0 && (
          <Card className="bg-slate-50 border-slate-200">
            <div className="p-12 text-center">
              <Zap className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-700 mb-2 text-lg font-medium">Ready to recover revenue?</p>
              <p className="text-slate-600 mb-8">Click "Run Scan" to analyze your business for unpaid invoices and dormant leads</p>
              <Button onClick={handleRunDemo} size="lg" disabled={demoRunning}>
                {demoRunning ? (
                  <>
                    <Loader2 className="animate-spin mr-2 w-4 h-4" />
                    Scanning...
                  </>
                ) : (
                  <>
                    <Zap className="mr-2 w-4 h-4" />
                    Run Your First Scan
                  </>
                )}
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
