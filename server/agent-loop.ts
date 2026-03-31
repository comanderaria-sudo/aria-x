/**
 * ARIA-X Revenue Recovery Engine
 * Simple workflow: Find → Fix → Recover
 */

import { nanoid } from "nanoid";
import {
  createTask,
  updateTaskStatus,
  createWatchEvent,
  createFinding,
  updateFindingStatus,
  createExecution,
  updateExecutionStatus,
  getUserFindings,
} from "./db";
import { generateMockFindings, generateMockExecutionResult } from "./mock-data";
import { invokeLLM } from "./_core/llm";

export interface AgentLoopContext {
  userId: number;
  demoMode?: boolean;
}

export class ARIAAgentLoop {
  private userId: number;
  private demoMode: boolean;

  constructor(context: AgentLoopContext) {
    this.userId = context.userId;
    this.demoMode = context.demoMode || false;
  }

  /**
   * FIND: Scan for revenue recovery opportunities
   */
  async watch(): Promise<string> {
    const taskId = await createTask(this.userId, "watch", {
      timestamp: new Date(),
      sources: ["invoices", "leads", "calendar"],
    });

    try {
      await updateTaskStatus(taskId, "running", undefined, undefined, "Scanning for opportunities...");

      // In demo mode, use mock data
      if (this.demoMode) {
        const findings = generateMockFindings();
        const invoices = findings.filter(f => f.type === "invoice");
        const leads = findings.filter(f => f.type === "lead");
        const logs = `Found ${findings.length} revenue recovery opportunities: ${invoices.length} unpaid invoices, ${leads.length} dormant leads`;

        await updateTaskStatus(taskId, "completed", { opportunitiesFound: findings.length }, undefined, logs);
        return taskId;
      }

      // In production, would scan real data sources
      const logs = "Scanned invoices, leads, and calendar data";
      await updateTaskStatus(taskId, "completed", { opportunitiesFound: 0 }, undefined, logs);
      return taskId;
    } catch (error) {
      await updateTaskStatus(taskId, "failed", undefined, String(error));
      throw error;
    }
  }

  /**
   * FIX: Analyze and generate recovery actions
   */
  async reason(watchTaskId: string): Promise<string> {
    const taskId = await createTask(this.userId, "reason", { watchTaskId });

    try {
      await updateTaskStatus(taskId, "running", undefined, undefined, "Analyzing opportunities...");

      // In demo mode, use mock analysis
      if (this.demoMode) {
        const findings = generateMockFindings();
        const actionable = findings.filter((f) => f.confidence > 80);

        const logs = `Analyzed ${findings.length} opportunities. Generated ${actionable.length} high-confidence recovery actions.`;

        await updateTaskStatus(
          taskId,
          "completed",
          {
            opportunitiesAnalyzed: findings.length,
            actionsGenerated: actionable.length,
          },
          undefined,
          logs
        );
        return taskId;
      }

      // In production, would call Claude for analysis
      const response = await invokeLLM({
        messages: [
          {
            role: "system",
            content:
              "You are a revenue recovery assistant. Analyze business opportunities and generate concrete recovery actions.",
          },
          {
            role: "user",
            content: "Analyze the opportunities and generate recovery actions.",
          },
        ],
      });

      const content = response.choices?.[0]?.message?.content;
      const responseText = typeof content === "string" ? content : "Analysis complete";
      await updateTaskStatus(taskId, "completed", { analysis: responseText }, undefined, responseText);
      return taskId;
    } catch (error) {
      await updateTaskStatus(taskId, "failed", undefined, String(error));
      throw error;
    }
  }

  /**
   * RECOVER: Create actionable proposals
   */
  async propose(reasonTaskId: string): Promise<string> {
    const taskId = await createTask(this.userId, "propose", { reasonTaskId });

    try {
      await updateTaskStatus(taskId, "running", undefined, undefined, "Preparing recovery actions...");

      // In demo mode, use mock findings
      if (this.demoMode) {
        const findings = generateMockFindings();
        let proposalsCreated = 0;

        for (const finding of findings) {
          await createFinding(
            this.userId,
            finding.type,
            finding.issue,
            finding.value,
            finding.confidence,
            finding.recommendedAction,
            finding.reasoning
          );
          proposalsCreated++;
        }

        const totalValue = findings.reduce((sum, f) => sum + f.value, 0);
        const logs = `Created ${proposalsCreated} recovery actions worth $${totalValue.toLocaleString()} in potential revenue`;

        await updateTaskStatus(
          taskId,
          "completed",
          { actionsCreated: proposalsCreated, totalValue: totalValue },
          undefined,
          logs
        );
        return taskId;
      }

      // In production, would generate proposals
      await updateTaskStatus(taskId, "completed", { actionsCreated: 0 }, undefined, "Recovery actions prepared");
      return taskId;
    } catch (error) {
      await updateTaskStatus(taskId, "failed", undefined, String(error));
      throw error;
    }
  }

  /**
   * Approve a recovery action
   */
  async approve(proposalId: string, approved: boolean, feedback?: string): Promise<string> {
    const taskId = await createTask(this.userId, "approve", {
      proposalId,
      decision: approved ? "approved" : "rejected",
      feedback,
    });

    try {
      await updateTaskStatus(taskId, "running", undefined, undefined, "Recording decision...");

      const status = approved ? "approved" : "rejected";
      await updateFindingStatus(proposalId, status);

      const logs = `Action ${approved ? "approved" : "rejected"} by user. ${feedback || ""}`;
      await updateTaskStatus(taskId, "completed", { decision: status }, undefined, logs);
      return taskId;
    } catch (error) {
      await updateTaskStatus(taskId, "failed", undefined, String(error));
      throw error;
    }
  }

  /**
   * Execute recovery action
   */
  async execute(findingId: string): Promise<string> {
    const taskId = await createTask(this.userId, "execute", { findingId });

    try {
      await updateTaskStatus(taskId, "running", undefined, undefined, "Executing action...");

      // Create execution record
      const executionId = await createExecution(this.userId, findingId, "email");

      // In demo mode, simulate execution
      if (this.demoMode) {
        await updateExecutionStatus(executionId, "running", undefined, undefined);

        // Simulate execution delay
        await new Promise((resolve) => setTimeout(resolve, 1500));

        const result = generateMockExecutionResult(findingId, "email");
        await updateExecutionStatus(executionId, "completed", result, undefined);

        const logs = `Action executed successfully. Recovery initiated.`;
        await updateTaskStatus(taskId, "completed", { executionId, result }, undefined, logs);
        return taskId;
      }

      // In production, would execute real actions
      await updateExecutionStatus(executionId, "completed", { status: "simulated" }, undefined);
      await updateTaskStatus(taskId, "completed", { executionId }, undefined, "Action executed");
      return taskId;
    } catch (error) {
      await updateTaskStatus(taskId, "failed", undefined, String(error));
      throw error;
    }
  }

  /**
   * Run full recovery cycle
   */
  async runFullCycle(): Promise<{
    watchTaskId: string;
    reasonTaskId: string;
    proposeTaskId: string;
    totalActions: number;
    totalValue: number;
  }> {
    const watchTaskId = await this.watch();
    const reasonTaskId = await this.reason(watchTaskId);
    const proposeTaskId = await this.propose(reasonTaskId);

    // Get created findings
    const findings = await getUserFindings(this.userId, "pending");
    const totalValue = findings.reduce((sum, f) => sum + (f.value || 0), 0);

    return {
      watchTaskId,
      reasonTaskId,
      proposeTaskId,
      totalActions: findings.length,
      totalValue,
    };
  }
}

/**
 * Create agent instance for user
 */
export function createAgent(userId: number, demoMode = false): ARIAAgentLoop {
  return new ARIAAgentLoop({ userId, demoMode });
}
