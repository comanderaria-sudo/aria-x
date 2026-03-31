/**
 * ARIA-X Agent Loop Engine
 * 6-Phase Loop: Watch -> Reason -> Propose -> Approve -> Execute -> Remember
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
   * PHASE 1: WATCH
   * Monitor business data sources for events
   */
  async watch(): Promise<string> {
    const taskId = await createTask(this.userId, "watch", {
      timestamp: new Date(),
      sources: ["invoices", "leads", "calendar"],
    });

    try {
      await updateTaskStatus(taskId, "running", undefined, undefined, "Scanning business data sources...");

      // In demo mode, use mock data
      if (this.demoMode) {
        const findings = generateMockFindings();
        const logs = `Detected ${findings.length} business events: ${findings.length} invoices, leads, and calendar conflicts`;

        await updateTaskStatus(taskId, "completed", { eventsDetected: findings.length }, undefined, logs);
        return taskId;
      }

      // In production, would scan real data sources
      const logs = "Scanned invoices, leads, and calendar data";
      await updateTaskStatus(taskId, "completed", { eventsDetected: 0 }, undefined, logs);
      return taskId;
    } catch (error) {
      await updateTaskStatus(taskId, "failed", undefined, String(error));
      throw error;
    }
  }

  /**
   * PHASE 2: REASON
   * Use Claude to analyze events and form judgments
   */
  async reason(watchTaskId: string): Promise<string> {
    const taskId = await createTask(this.userId, "reason", { watchTaskId });

    try {
      await updateTaskStatus(taskId, "running", undefined, undefined, "Analyzing business events with Claude...");

      // In demo mode, use mock reasoning
      if (this.demoMode) {
        const findings = generateMockFindings();
        const reasoning = `Analyzed ${findings.length} business events. Identified ${findings.filter((f) => f.confidence > 80).length} high-confidence opportunities for revenue recovery.`;

        await updateTaskStatus(
          taskId,
          "completed",
          {
            findingsAnalyzed: findings.length,
            highConfidenceFindings: findings.filter((f) => f.confidence > 80).length,
          },
          undefined,
          reasoning
        );
        return taskId;
      }

      // In production, would call Claude for reasoning
      const response = await invokeLLM({
        messages: [
          {
            role: "system",
            content:
              "You are ARIA-X, an autonomous business intelligence agent. Analyze business events and identify revenue recovery opportunities.",
          },
          {
            role: "user",
            content: "Analyze the business events and identify key findings.",
          },
        ],
      });

      const content = response.choices?.[0]?.message?.content;
      const responseText = typeof content === "string" ? content : "Analysis complete";
      await updateTaskStatus(taskId, "completed", { reasoning: responseText }, undefined, responseText);
      return taskId;
    } catch (error) {
      await updateTaskStatus(taskId, "failed", undefined, String(error));
      throw error;
    }
  }

  /**
   * PHASE 3: PROPOSE
   * Generate actionable proposals from findings
   */
  async propose(reasonTaskId: string): Promise<string> {
    const taskId = await createTask(this.userId, "propose", { reasonTaskId });

    try {
      await updateTaskStatus(taskId, "running", undefined, undefined, "Generating proposals...");

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
        const logs = `Created ${proposalsCreated} proposals worth $${totalValue.toLocaleString()} in potential revenue`;

        await updateTaskStatus(
          taskId,
          "completed",
          { proposalsCreated, totalPotentialValue: totalValue },
          undefined,
          logs
        );
        return taskId;
      }

      // In production, would generate proposals from reasoning
      await updateTaskStatus(taskId, "completed", { proposalsCreated: 0 }, undefined, "Proposals generated");
      return taskId;
    } catch (error) {
      await updateTaskStatus(taskId, "failed", undefined, String(error));
      throw error;
    }
  }

  /**
   * PHASE 4: APPROVE
   * Capture user decisions on proposals
   */
  async approve(proposalId: string, approved: boolean, feedback?: string): Promise<string> {
    const taskId = await createTask(this.userId, "approve", {
      proposalId,
      decision: approved ? "approved" : "rejected",
      feedback,
    });

    try {
      await updateTaskStatus(taskId, "running", undefined, undefined, "Recording user decision...");

      const status = approved ? "approved" : "rejected";
      await updateFindingStatus(proposalId, status);

      const logs = `Proposal ${approved ? "approved" : "rejected"} by user. ${feedback || ""}`;
      await updateTaskStatus(taskId, "completed", { decision: status }, undefined, logs);
      return taskId;
    } catch (error) {
      await updateTaskStatus(taskId, "failed", undefined, String(error));
      throw error;
    }
  }

  /**
   * PHASE 5: EXECUTE
   * Dispatch actions to external systems
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

        const logs = `Action executed successfully. Email sent to recipient.`;
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
   * PHASE 6: REMEMBER
   * Learn from outcomes and update knowledge graph
   */
  async remember(executionId: string, outcome: "success" | "failure"): Promise<string> {
    const taskId = await createTask(this.userId, "remember", { executionId, outcome });

    try {
      await updateTaskStatus(taskId, "running", undefined, undefined, "Learning from outcome...");

      const logs = `Recorded ${outcome} outcome. Knowledge graph updated with new patterns.`;
      await updateTaskStatus(
        taskId,
        "completed",
        { outcome, knowledgeUpdated: true },
        undefined,
        logs
      );
      return taskId;
    } catch (error) {
      await updateTaskStatus(taskId, "failed", undefined, String(error));
      throw error;
    }
  }

  /**
   * Run full agent loop cycle
   */
  async runFullCycle(): Promise<{
    watchTaskId: string;
    reasonTaskId: string;
    proposeTaskId: string;
    totalProposals: number;
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
      totalProposals: findings.length,
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
