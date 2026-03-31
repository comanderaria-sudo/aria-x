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

// Mock Invoice Data
const mockInvoices = [
  {
    id: "INV-2025-001",
    client: "Acme Corp",
    amount: 15000,
    dueDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    status: "unpaid",
  },
  {
    id: "INV-2025-002",
    client: "TechStart Inc",
    amount: 8500,
    dueDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
    status: "unpaid",
  },
  {
    id: "INV-2025-003",
    client: "Global Solutions",
    amount: 22000,
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    status: "unpaid",
  },
];

// Mock Lead Data
const mockLeads = [
  {
    id: "LEAD-001",
    company: "Enterprise Systems",
    contact: "John Smith",
    email: "john@enterprise.com",
    lastContact: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
    value: 50000,
    status: "no_recent_contact",
  },
  {
    id: "LEAD-002",
    company: "Digital Innovations",
    contact: "Sarah Johnson",
    email: "sarah@digital.com",
    lastContact: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
    value: 35000,
    status: "no_recent_contact",
  },
  {
    id: "LEAD-003",
    company: "Cloud Ventures",
    contact: "Mike Chen",
    email: "mike@cloud.com",
    lastContact: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
    value: 75000,
    status: "dormant",
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
  {
    id: "CAL-003",
    title: "Project Review",
    startTime: new Date(Date.now() + 3 * 60 * 60 * 1000),
    endTime: new Date(Date.now() + 4 * 60 * 60 * 1000),
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
    value: 15000,
    confidence: 95,
    recommendedAction: "Send payment reminder email to Acme Corp accounts payable",
    reasoning:
      "Invoice is significantly overdue. High confidence that follow-up will accelerate payment.",
  });

  findings.push({
    id: nanoid(),
    type: "invoice",
    issue: "Invoice INV-2025-002 from TechStart Inc is 15 days overdue",
    value: 8500,
    confidence: 88,
    recommendedAction: "Send polite payment reminder to TechStart Inc",
    reasoning:
      "Invoice is moderately overdue. Follow-up typically results in payment within 3-5 days.",
  });

  findings.push({
    id: nanoid(),
    type: "invoice",
    issue: "Invoice INV-2025-003 from Global Solutions due in 5 days",
    value: 22000,
    confidence: 92,
    recommendedAction: "Send proactive payment reminder to Global Solutions",
    reasoning:
      "Proactive reminder before due date increases on-time payment probability to 87%.",
  });

  findings.push({
    id: nanoid(),
    type: "lead",
    issue: "Lead LEAD-001 (Enterprise Systems) - No contact for 45 days",
    value: 50000,
    confidence: 85,
    recommendedAction: "Send personalized follow-up email to John Smith",
    reasoning:
      "45-day silence indicates potential loss of interest. Timely re-engagement can recover 60% of leads.",
  });

  findings.push({
    id: nanoid(),
    type: "lead",
    issue: "Lead LEAD-003 (Cloud Ventures) - Dormant for 90 days",
    value: 75000,
    confidence: 78,
    recommendedAction: "Schedule discovery call with Mike Chen to re-engage",
    reasoning:
      "High-value lead dormant for 90 days. Re-engagement call can revive 40% of dormant opportunities.",
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
