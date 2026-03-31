import { describe, it, expect, beforeEach, vi } from "vitest";
import { createAgent } from "./agent-loop";
import { generateMockFindings, getTotalPotentialRevenue } from "./mock-data";

describe("ARIA-X Agent Loop", () => {
  describe("Mock Data Generation", () => {
    it("should generate mock findings with correct structure", () => {
      const findings = generateMockFindings();

      expect(findings.length).toBeGreaterThan(0);
      findings.forEach((finding) => {
        expect(finding).toHaveProperty("id");
        expect(finding).toHaveProperty("type");
        expect(finding).toHaveProperty("issue");
        expect(finding).toHaveProperty("value");
        expect(finding).toHaveProperty("confidence");
        expect(finding).toHaveProperty("recommendedAction");
        expect(finding).toHaveProperty("reasoning");

        expect(["invoice", "lead", "calendar"]).toContain(finding.type);
        expect(finding.confidence).toBeGreaterThanOrEqual(0);
        expect(finding.confidence).toBeLessThanOrEqual(100);
        expect(finding.value).toBeGreaterThanOrEqual(0);
      });
    });

    it("should calculate total potential revenue correctly", () => {
      const totalRevenue = getTotalPotentialRevenue();

      expect(totalRevenue).toBeGreaterThan(0);
      expect(typeof totalRevenue).toBe("number");

      // Verify it matches sum of findings
      const findings = generateMockFindings();
      const expectedTotal = findings.reduce((sum, f) => sum + f.value, 0);
      expect(totalRevenue).toBe(expectedTotal);
    });

    it("should include invoice findings", () => {
      const findings = generateMockFindings();
      const invoiceFindings = findings.filter((f) => f.type === "invoice");

      expect(invoiceFindings.length).toBeGreaterThan(0);
      invoiceFindings.forEach((finding) => {
        expect(finding.issue).toContain("Invoice");
        expect(finding.value).toBeGreaterThan(0);
      });
    });

    it("should include lead findings", () => {
      const findings = generateMockFindings();
      const leadFindings = findings.filter((f) => f.type === "lead");

      expect(leadFindings.length).toBeGreaterThan(0);
      leadFindings.forEach((finding) => {
        expect(finding.issue).toContain("Lead");
        expect(finding.value).toBeGreaterThan(0);
      });
    });

    it("should include calendar findings", () => {
      const findings = generateMockFindings();
      const calendarFindings = findings.filter((f) => f.type === "calendar");

      expect(calendarFindings.length).toBeGreaterThan(0);
      calendarFindings.forEach((finding) => {
        expect(finding.issue).toContain("Calendar");
      });
    });
  });

  describe("Agent Loop Initialization", () => {
    it("should create agent with demo mode enabled", () => {
      const agent = createAgent(1, true);
      expect(agent).toBeDefined();
    });

    it("should create agent with demo mode disabled", () => {
      const agent = createAgent(1, false);
      expect(agent).toBeDefined();
    });
  });

  describe("Agent Loop Methods", () => {
    let agent: ReturnType<typeof createAgent>;

    beforeEach(() => {
      agent = createAgent(1, true);
    });

    it("should have watch method", () => {
      expect(agent.watch).toBeDefined();
      expect(typeof agent.watch).toBe("function");
    });

    it("should have reason method", () => {
      expect(agent.reason).toBeDefined();
      expect(typeof agent.reason).toBe("function");
    });

    it("should have propose method", () => {
      expect(agent.propose).toBeDefined();
      expect(typeof agent.propose).toBe("function");
    });

    it("should have approve method", () => {
      expect(agent.approve).toBeDefined();
      expect(typeof agent.approve).toBe("function");
    });

    it("should have execute method", () => {
      expect(agent.execute).toBeDefined();
      expect(typeof agent.execute).toBe("function");
    });

    it("should have remember method", () => {
      expect(agent.remember).toBeDefined();
      expect(typeof agent.remember).toBe("function");
    });

    it("should have runFullCycle method", () => {
      expect(agent.runFullCycle).toBeDefined();
      expect(typeof agent.runFullCycle).toBe("function");
    });
  });

  describe("Demo Mode Behavior", () => {
    it("should return findings when running in demo mode", async () => {
      const agent = createAgent(1, true);
      const result = await agent.runFullCycle();

      expect(result).toHaveProperty("watchTaskId");
      expect(result).toHaveProperty("reasonTaskId");
      expect(result).toHaveProperty("proposeTaskId");
      expect(result).toHaveProperty("totalProposals");
      expect(result).toHaveProperty("totalValue");

      expect(result.totalProposals).toBeGreaterThan(0);
      expect(result.totalValue).toBeGreaterThan(0);
    });

    it("should generate consistent task IDs", async () => {
      const agent = createAgent(1, true);
      const result = await agent.runFullCycle();

      expect(result.watchTaskId).toBeDefined();
      expect(result.reasonTaskId).toBeDefined();
      expect(result.proposeTaskId).toBeDefined();

      // Task IDs should be non-empty strings
      expect(typeof result.watchTaskId).toBe("string");
      expect(result.watchTaskId.length).toBeGreaterThan(0);
    });
  });

  describe("Revenue Calculation", () => {
    it("should calculate correct total revenue from findings", () => {
      const findings = generateMockFindings();
      const totalRevenue = findings.reduce((sum, f) => sum + f.value, 0);

      expect(totalRevenue).toBeGreaterThan(0);

      // Verify specific amounts
      const invoiceTotal = findings
        .filter((f) => f.type === "invoice")
        .reduce((sum, f) => sum + f.value, 0);
      expect(invoiceTotal).toBeGreaterThan(0);

      const leadTotal = findings
        .filter((f) => f.type === "lead")
        .reduce((sum, f) => sum + f.value, 0);
      expect(leadTotal).toBeGreaterThan(0);
    });
  });

  describe("Confidence Scoring", () => {
    it("should have high confidence for overdue invoices", () => {
      const findings = generateMockFindings();
      const invoiceFindings = findings.filter((f) => f.type === "invoice");

      invoiceFindings.forEach((finding) => {
        expect(finding.confidence).toBeGreaterThanOrEqual(85);
      });
    });

    it("should have reasonable confidence for leads", () => {
      const findings = generateMockFindings();
      const leadFindings = findings.filter((f) => f.type === "lead");

      leadFindings.forEach((finding) => {
        expect(finding.confidence).toBeGreaterThanOrEqual(70);
        expect(finding.confidence).toBeLessThanOrEqual(100);
      });
    });

    it("should have high confidence for calendar conflicts", () => {
      const findings = generateMockFindings();
      const calendarFindings = findings.filter((f) => f.type === "calendar");

      calendarFindings.forEach((finding) => {
        expect(finding.confidence).toBe(100);
      });
    });
  });

  describe("Recommendation Quality", () => {
    it("should provide specific, actionable recommendations", () => {
      const findings = generateMockFindings();

      findings.forEach((finding) => {
        expect(finding.recommendedAction).toBeDefined();
        expect(finding.recommendedAction.length).toBeGreaterThan(0);
        expect(finding.recommendedAction).not.toBe("");
      });
    });

    it("should provide reasoning for each finding", () => {
      const findings = generateMockFindings();

      findings.forEach((finding) => {
        expect(finding.reasoning).toBeDefined();
        expect(finding.reasoning.length).toBeGreaterThan(0);
      });
    });
  });
});
