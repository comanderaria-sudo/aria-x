import { parse } from 'csv-parse/sync';

export type InvoiceRow = {
  name: string;
  amount: number;
  dueDate: Date;
  status?: 'paid' | 'unpaid' | 'overdue';
};

/**
 * Parse CSV file for invoices
 * Expected format:
 * name,amount,due_date
 * Acme Corp,5000,2024-03-15
 * Tech Inc,2500,2024-03-20
 */
export function parseInvoiceCSV(csvContent: string): InvoiceRow[] {
  try {
    const records = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    });

    const invoices: InvoiceRow[] = [];

    for (const record of records) {
      const r = record as Record<string, unknown>;
      const name = (r.name || r.customer || r.company) as string;
      const amount = parseFloat((r.amount || r.total || '0') as string);
      const dueDate = new Date((r.due_date || r.dueDate || r.date) as string);

      if (!name || amount <= 0 || isNaN(dueDate.getTime())) {
        console.warn('Skipping invalid invoice row:', record);
        continue;
      }

      // Determine status based on due date
      const now = new Date();
      const status = dueDate < now ? 'overdue' : 'unpaid';

      invoices.push({
        name,
        amount,
        dueDate,
        status,
      });
    }

    return invoices;
  } catch (error) {
    console.error('Failed to parse CSV:', error);
    throw new Error(`CSV parsing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Analyze invoices for revenue recovery opportunities
 */
export function analyzeInvoicesForOpportunities(invoices: InvoiceRow[]) {
  const opportunities = [];

  // Find overdue invoices
  const overdueInvoices = invoices.filter((inv) => inv.status === 'overdue');
  if (overdueInvoices.length > 0) {
    const totalOverdue = overdueInvoices.reduce((sum, inv) => sum + inv.amount, 0);
    opportunities.push({
      type: 'invoice',
      title: `${overdueInvoices.length} overdue invoices`,
      description: `Total overdue: $${totalOverdue.toFixed(2)}`,
      value: totalOverdue,
      confidence: 0.9,
      recommendation: 'Send payment reminders to customers with overdue invoices',
    });
  }

  // Find invoices due soon
  const now = new Date();
  const dueSoon = invoices.filter((inv) => {
    const daysUntilDue = (inv.dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
    return daysUntilDue > 0 && daysUntilDue <= 7 && inv.status === 'unpaid';
  });

  if (dueSoon.length > 0) {
    const totalDueSoon = dueSoon.reduce((sum, inv) => sum + inv.amount, 0);
    opportunities.push({
      type: 'invoice',
      title: `${dueSoon.length} invoices due within 7 days`,
      description: `Total amount: $${totalDueSoon.toFixed(2)}`,
      value: totalDueSoon,
      confidence: 0.8,
      recommendation: 'Send payment reminders to ensure timely payment',
    });
  }

  // Find large invoices (high priority)
  const largeInvoices = invoices.filter((inv) => inv.amount > 5000 && inv.status === 'unpaid');
  if (largeInvoices.length > 0) {
    const totalLarge = largeInvoices.reduce((sum, inv) => sum + inv.amount, 0);
    opportunities.push({
      type: 'invoice',
      title: `${largeInvoices.length} high-value invoices pending`,
      description: `Total amount: $${totalLarge.toFixed(2)}`,
      value: totalLarge,
      confidence: 0.85,
      recommendation: 'Prioritize follow-up on high-value invoices',
    });
  }

  return opportunities;
}

/**
 * Validate CSV structure
 */
export function validateInvoiceCSV(csvContent: string): boolean {
  try {
    const records = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    });

    if (records.length === 0) {
      return false;
    }

    // Check if required columns exist
    const firstRecord = records[0] as Record<string, unknown>;
    const hasName = 'name' in firstRecord || 'customer' in firstRecord || 'company' in firstRecord;
    const hasAmount = 'amount' in firstRecord || 'total' in firstRecord;
    const hasDate = 'due_date' in firstRecord || 'dueDate' in firstRecord || 'date' in firstRecord;

    return hasName && hasAmount && hasDate;
  } catch {
    return false;
  }
}
