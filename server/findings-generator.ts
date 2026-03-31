import { analyzeEmailsForOpportunities } from './gmail-service';
import { analyzeCalendarForOpportunities } from './calendar-service';
import { analyzeInvoicesForOpportunities } from './invoice-parser';
import type { EmailMessage } from './gmail-service';
import type { CalendarEvent } from './calendar-service';
import type { InvoiceRow } from './invoice-parser';

export type Finding = {
  type: 'email' | 'calendar' | 'invoice';
  title: string;
  description: string;
  value: number;
  confidence: number;
  recommendation: string;
};

/**
 * Generate findings from all data sources
 */
export function generateFindings(
  emails?: EmailMessage[],
  calendarEvents?: CalendarEvent[],
  invoices?: InvoiceRow[]
): Finding[] {
  const findings: Finding[] = [];

  // Analyze emails
  if (emails && emails.length > 0) {
    const emailFindings = analyzeEmailsForOpportunities(emails);
    findings.push(...(emailFindings as Finding[]));
  }

  // Analyze calendar
  if (calendarEvents && calendarEvents.length > 0) {
    const calendarFindings = analyzeCalendarForOpportunities(calendarEvents);
    findings.push(...(calendarFindings as Finding[]));
  }

  // Analyze invoices
  if (invoices && invoices.length > 0) {
    const invoiceFindings = analyzeInvoicesForOpportunities(invoices);
    findings.push(...(invoiceFindings as Finding[]));
  }

  // Sort by value (highest first)
  findings.sort((a, b) => b.value - a.value);

  return findings;
}

/**
 * Calculate total potential revenue from findings
 */
export function calculateTotalRevenuePotential(findings: Finding[]): number {
  return findings.reduce((sum, finding) => sum + finding.value, 0);
}

/**
 * Filter findings by type
 */
export function filterFindingsByType(findings: Finding[], type: 'email' | 'calendar' | 'invoice'): Finding[] {
  return findings.filter((f) => f.type === type);
}

/**
 * Get high-confidence findings (>70%)
 */
export function getHighConfidenceFindings(findings: Finding[]): Finding[] {
  return findings.filter((f) => f.confidence > 0.7);
}
