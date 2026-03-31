/**
 * Mock Data Generator for ARIA-X Demo
 * Generates realistic business scenarios for investor presentation
 */

import { nanoid } from "nanoid";

export interface MockFinding {
  id: string;
  type: "invoice" | "lead" | "calendar";
  issue: string;
  value: number;
  confidence: number;
  recommendedAction: string;
  reasoning: string;
}

export interface MockWatchEvent {
  id: string;
  sourceType: "invoice" | "lead" | "calendar" | "email";
  data: unknown;
}

// Mock Invoice Data - Realistic small business amounts
const mockInvoices = [
  {
    id: "INV-2025-001",
    client: "Acme Corp",
    amount: 4200,
    dueDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    status: "unpaid",
  },
  {
    id: "INV-2025-002",
    client: "TechStart Inc",
    amount: 4000,
    dueDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
    status: "unpaid",
  },
];

// Mock Lead Data - Realistic small business deal sizes
const mockLeads = [
  {
    id: "LEAD-001",
    company: "Local Services Co",
    contact: "John Smith",
    email: "john@localservices.com",
    lastContact: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
    value: 2500,
    status: "no_recent_contact",
  },
  {
    id: "LEAD-002",
    company: "Small Retail Shop",
    contact: "Sarah Johnson",
    email: "sarah@retail.com",
    lastContact: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
    value: 1000,
    status: "no_recent_contact",
  },
];

// Mock Calendar Data
const mockCalendarEvents = [
  {
    id: "CAL-001",
    title: "Team Standup",
    startTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
    endTime: new Date(Date.now() + 2.5 * 60 * 60 * 1000),
  },
  {
    id: "CAL-002",
    title: "Client Call - Acme",
    startTime: new Date(Date.now() + 2.25 * 60 * 60 * 1000),
    endTime: new Date(Date.now() + 3 * 60 * 60 * 1000),
  },
];

export function generateMockWatchEvents(): MockWatchEvent[] {
  const events: MockWatchEvent[] = [];

  mockInvoices.forEach((invoice) => {
    events.push({
      id: nanoid(),
      sourceType: "invoice",
      data: invoice,
    });
  });

  mockLeads.forEach((lead) => {
    events.push({
      id: nanoid(),
      sourceType: "lead",
      data: lead,
    });
  });

  mockCalendarEvents.forEach((event) => {
    events.push({
      id: nanoid(),
      sourceType: "calendar",
      data: event,
    });
  });

  return events;
}

export function generateMockFindings(): MockFinding[] {
  const findings: MockFinding[] = [];

  findings.push({
    id: nanoid(),
    type: "invoice",
    issue: "Invoice INV-2025-001 from Acme Corp is 30 days overdue",
    value: 4200,
    confidence: 95,
    recommendedAction: "Send payment reminder email to Acme Corp accounts payable",
    reasoning:
      "Invoice is significantly overdue. High confidence that follow-up will accelerate payment.",
  });

  findings.push({
    id: nanoid(),
    type: "invoice",
    issue: "Invoice INV-2025-002 from TechStart Inc is 15 days overdue",
    value: 4000,
    confidence: 88,
    recommendedAction: "Send polite payment reminder to TechStart Inc",
    reasoning:
      "Invoice is moderately overdue. Follow-up typically results in payment within 3-5 days.",
  });

  findings.push({
    id: nanoid(),
    type: "lead",
    issue: "Lead LEAD-001 (Local Services Co) - No contact for 45 days",
    value: 2500,
    confidence: 85,
    recommendedAction: "Send personalized follow-up email to John Smith",
    reasoning:
      "45-day silence indicates potential loss of interest. Timely re-engagement can recover 60% of leads.",
  });

  findings.push({
    id: nanoid(),
    type: "lead",
    issue: "Lead LEAD-002 (Small Retail Shop) - No contact for 60 days",
    value: 1000,
    confidence: 78,
    recommendedAction: "Send check-in email to Sarah Johnson",
    reasoning:
      "Lead has been quiet for 60 days. Quick follow-up can revive interest.",
  });

  findings.push({
    id: nanoid(),
    type: "calendar",
    issue: "Calendar conflict detected: Team Standup overlaps with Client Call",
    value: 0,
    confidence: 100,
    recommendedAction: "Reschedule Team Standup to 3:00 PM",
    reasoning: "Conflict prevents attendance at client call. Rescheduling ensures all meetings are attended.",
  });

  return findings;
}

export function generateMockExecutionResult(findingId: string, type: string) {
  const results: Record<string, unknown> = {
    email: {
      status: "sent",
      recipient: "accounts@acme.com",
      subject: "Payment Reminder - Invoice INV-2025-001",
      timestamp: new Date(),
      trackingId: nanoid(),
    },
    calendar: {
      status: "rescheduled",
      eventId: "CAL-001",
      newTime: new Date(Date.now() + 3 * 60 * 60 * 1000),
      attendeesNotified: true,
    },
    invoice: {
      status: "marked_reminded",
      invoiceId: "INV-2025-001",
      reminderCount: 1,
      nextReminderDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  };

  return results[type] || { status: "completed", timestamp: new Date() };
}

export function getTotalPotentialRevenue(): number {
  const findings = generateMockFindings();
  return findings.reduce((sum, finding) => sum + finding.value, 0);
}

export function getMockFindingsByType(
  type: "invoice" | "lead" | "calendar"
): MockFinding[] {
  return generateMockFindings().filter((f) => f.type === type);
}
