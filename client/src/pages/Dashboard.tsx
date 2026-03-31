import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, TrendingUp, AlertCircle, CheckCircle2, Clock, ArrowRight } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useState, useEffect } from "react";

interface ExecutionStep {
  phase: "watch" | "reason" | "propose" | "approve" | "execute" | "remember";
  status: "pending" | "running" | "completed" | "failed";
  timestamp: Date;
  logs?: string;
}

export default function Dashboard() {
  const { isAuthenticated } = useAuth();
  const [executionSteps, setExecutionSteps] = useState<ExecutionStep[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const runCycleMutation = trpc.agent.runCycle.useMutation();
  const getFindingsQuery = trpc.agent.getFindings.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const findings = getFindingsQuery.data || [];
  const totalValue = findings.reduce((sum, f) => sum + (f.value || 0), 0);
  const invoiceFindings = findings.filter((f) => f.type === "invoice");
  const leadFindings = findings.filter((f) => f.type === "lead");
  const calendarFindings = findings.filter((f) => f.type === "calendar");

  const handleRunCycle = async () => {
    setIsRunning(true);
    setExecutionSteps([
      { phase: "watch", status: "running", timestamp: new Date() },
    ]);

    try {
      // Simulate phase progression
      const phases: ExecutionStep["phase"][] = ["watch", "reason", "propose", "approve", "execute", "remember"];

      for (let i = 0; i < phases.length; i++) {
        const phase = phases[i];

        // Mark current as running
        setExecutionSteps((prev) => {
          const updated = [...prev];
          const idx = updated.findIndex((s) => s.phase === phase);
          if (idx >= 0) {
            updated[idx] = { ...updated[idx], status: "running" };
          } else {
            updated.push({ phase, status: "running", timestamp: new Date() });
          }
          return updated;
        });

        // Simulate phase execution
        await new Promise((resolve) => setTimeout(resolve, 800));

        // Mark as completed
        setExecutionSteps((prev) => {
          const updated = [...prev];
          const idx = updated.findIndex((s) => s.phase === phase);
          if (idx >= 0) {
            updated[idx] = { ...updated[idx], status: "completed" };
          }
          return updated;
        });

        // Add next phase if not last
        if (i < phases.length - 1) {
          const nextPhase = phases[i + 1];
          setExecutionSteps((prev) => [
            ...prev,
            { phase: nextPhase, status: "pending", timestamp: new Date() },
          ]);
        }
      }

      // Run actual mutation
      await runCycleMutation.mutateAsync();

      // Refetch findings
      await getFindingsQuery.refetch();
    } catch (error) {
      console.error("Cycle error:", error);
    } finally {
      setIsRunning(false);
    }
  };

  const phaseLabels: Record<ExecutionStep["phase"], string> = {
    watch: "Watch",
    reason: "Reason",
    propose: "Propose",
    approve: "Approve",
    execute: "Execute",
    remember: "Remember",
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">ARIA-X Dashboard</h1>
              <p className="text-slate-600 mt-1">6-Phase Revenue Recovery Loop</p>
            </div>
            <Button onClick={handleRunCycle} disabled={isRunning} size="lg">
              {isRunning ? (
                <>
                  <Loader2 className="animate-spin mr-2 w-4 h-4" />
                  Running...
                </>
              ) : (
                "Run Agent Cycle"
              )}
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Revenue Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
            <div className="p-6">
              <p className="text-sm font-medium text-slate-600 mb-2">Total Value</p>
              <p className="text-3xl font-bold text-green-600">${totalValue.toLocaleString()}</p>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
            <div className="p-6">
              <p className="text-sm font-medium text-slate-600 mb-2">Invoices</p>
              <p className="text-3xl font-bold text-amber-600">{invoiceFindings.length}</p>
              <p className="text-xs text-amber-600 mt-2">
                ${invoiceFindings.reduce((sum, f) => sum + f.value, 0).toLocaleString()}
              </p>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
            <div className="p-6">
              <p className="text-sm font-medium text-slate-600 mb-2">Leads</p>
              <p className="text-3xl font-bold text-blue-600">{leadFindings.length}</p>
              <p className="text-xs text-blue-600 mt-2">
                ${leadFindings.reduce((sum, f) => sum + f.value, 0).toLocaleString()}
              </p>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-slate-50 to-gray-50 border-slate-200">
            <div className="p-6">
              <p className="text-sm font-medium text-slate-600 mb-2">Calendar</p>
              <p className="text-3xl font-bold text-slate-600">{calendarFindings.length}</p>
              <p className="text-xs text-slate-600 mt-2">Conflicts resolved</p>
            </div>
          </Card>
        </div>

        {/* Execution Timeline */}
        {executionSteps.length > 0 && (
          <Card className="mb-8">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-6">6-Phase Loop Execution</h2>
              <div className="flex items-center justify-between">
                {executionSteps.map((step, idx) => (
                  <div key={step.phase} className="flex items-center flex-1">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all ${
                          step.status === "completed"
                            ? "bg-green-100 text-green-700"
                            : step.status === "running"
                              ? "bg-blue-100 text-blue-700 animate-pulse"
                              : step.status === "failed"
                                ? "bg-red-100 text-red-700"
                                : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {step.status === "completed" ? (
                          <CheckCircle2 className="w-5 h-5" />
                        ) : step.status === "running" ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <Clock className="w-5 h-5" />
                        )}
                      </div>
                      <p className="text-xs font-medium text-slate-600 mt-2">{phaseLabels[step.phase]}</p>
                    </div>
                    {idx < executionSteps.length - 1 && (
                      <div className="flex-1 mx-2 h-1 bg-slate-200 relative">
                        <div
                          className={`h-full transition-all ${
                            executionSteps[idx + 1]?.status === "completed" ||
                            executionSteps[idx + 1]?.status === "running"
                              ? "bg-green-500"
                              : "bg-slate-200"
                          }`}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </Card>
        )}

        {/* Findings Grid */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Detected Opportunities</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {findings.map((finding) => (
              <Card key={finding.id} className="hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900 mb-2 line-clamp-2">{finding.issue}</h3>
                      <p className="text-sm text-slate-600 line-clamp-2">{finding.recommendedAction}</p>
                    </div>
                    {finding.type === "invoice" && (
                      <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 ml-2" />
                    )}
                    {finding.type === "lead" && (
                      <TrendingUp className="w-5 h-5 text-blue-500 flex-shrink-0 ml-2" />
                    )}
                    {finding.type === "calendar" && (
                      <CheckCircle2 className="w-5 h-5 text-slate-500 flex-shrink-0 ml-2" />
                    )}
                  </div>

                  <div className="bg-slate-50 rounded p-3 mb-4">
                    <p className="text-xs text-slate-600 mb-1">Reasoning</p>
                    <p className="text-sm text-slate-700 line-clamp-2">{finding.reasoning}</p>
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

          {findings.length === 0 && (
            <Card className="bg-slate-50 border-slate-200">
              <div className="p-12 text-center">
                <p className="text-slate-600 mb-4">No findings yet</p>
                <p className="text-sm text-slate-500">Click "Run Agent Cycle" to scan for opportunities</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
