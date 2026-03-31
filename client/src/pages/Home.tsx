import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, TrendingUp, AlertCircle, CheckCircle2 } from "lucide-react";
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
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin w-8 h-8" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">ARIA-X</h1>
          <p className="text-xl text-slate-300 mb-8">Autonomous Revenue Intelligence Agent</p>
          <a href={getLoginUrl()}>
            <Button size="lg">Sign In to Continue</Button>
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
              <h1 className="text-3xl font-bold text-slate-900">ARIA-X Dashboard</h1>
              <p className="text-slate-600 mt-1">Revenue Recovery Agent</p>
            </div>
            <div className="flex gap-4">
              <a href="/dashboard">
                <Button variant="outline">Go to Dashboard</Button>
              </a>
              <Button onClick={handleRunDemo} disabled={demoRunning}>
                {demoRunning ? (
                  <>
                    <Loader2 className="animate-spin mr-2 w-4 h-4" />
                    Running Demo...
                  </>
                ) : (
                  "Run Agent Cycle"
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Revenue Counter */}
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 mb-8">
          <div className="p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 mb-2">Potential Revenue Recovered</p>
                <p className="text-5xl font-bold text-green-600">${totalRevenue.toLocaleString()}</p>
              </div>
              <TrendingUp className="w-16 h-16 text-green-400" />
            </div>
          </div>
        </Card>

        {/* Findings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {findings.map((finding) => (
            <Card key={finding.id} className="hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900 mb-2">{finding.issue}</h3>
                    <p className="text-sm text-slate-600">{finding.recommendedAction}</p>
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
                  <Button size="sm" variant="outline">
                    Approve
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Demo Info */}
        {findings.length === 0 && (
          <Card className="bg-slate-50 border-slate-200">
            <div className="p-8 text-center">
              <p className="text-slate-600 mb-4">Click "Run Agent Cycle" to start the demo and see ARIA-X in action</p>
              <p className="text-sm text-slate-500">The agent will scan for unpaid invoices, dormant leads, and calendar conflicts</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
