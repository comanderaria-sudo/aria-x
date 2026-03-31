import { describe, it, expect } from 'vitest';
import { parseInvoiceCSV, validateInvoiceCSV, analyzeInvoicesForOpportunities } from './invoice-parser';
import { generateFindings, calculateTotalRevenuePotential, getHighConfidenceFindings } from './findings-generator';

describe('Invoice Parser', () => {
  it('should parse valid CSV with invoices', () => {
    const csv = `name,amount,due_date
Acme Corp,5000,2024-03-15
Tech Inc,2500,2024-03-20`;

    const invoices = parseInvoiceCSV(csv);
    expect(invoices).toHaveLength(2);
    expect(invoices[0].name).toBe('Acme Corp');
    expect(invoices[0].amount).toBe(5000);
  });

  it('should handle alternative column names', () => {
    const csv = `customer,total,dueDate
Global Solutions,8200,2024-03-10`;

    const invoices = parseInvoiceCSV(csv);
    expect(invoices).toHaveLength(1);
    expect(invoices[0].name).toBe('Global Solutions');
    expect(invoices[0].amount).toBe(8200);
  });

  it('should skip invalid rows', () => {
    const csv = `name,amount,due_date
Acme Corp,5000,2024-03-15
Invalid,invalid,invalid
Tech Inc,2500,2024-03-20`;

    const invoices = parseInvoiceCSV(csv);
    expect(invoices).toHaveLength(2);
  });

  it('should validate CSV structure', () => {
    const validCSV = `name,amount,due_date
Acme Corp,5000,2024-03-15`;

    const invalidCSV = `name,description
Acme Corp,Some description`;

    expect(validateInvoiceCSV(validCSV)).toBe(true);
    expect(validateInvoiceCSV(invalidCSV)).toBe(false);
  });

  it('should determine invoice status based on due date', () => {
    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    const csv = `name,amount,due_date
Overdue,5000,${yesterday.toISOString().split('T')[0]}
Pending,2500,${tomorrow.toISOString().split('T')[0]}`;

    const invoices = parseInvoiceCSV(csv);
    expect(invoices[0].status).toBe('overdue');
    expect(invoices[1].status).toBe('unpaid');
  });
});

describe('Invoice Analysis', () => {
  it('should detect overdue invoices', () => {
    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const invoices = [
      {
        name: 'Acme Corp',
        amount: 5000,
        dueDate: yesterday,
        status: 'overdue' as const,
      },
    ];

    const opportunities = analyzeInvoicesForOpportunities(invoices);
    const overdueOpportunity = opportunities.find((o) => o.title.includes('overdue'));

    expect(overdueOpportunity).toBeDefined();
    expect(overdueOpportunity?.value).toBe(5000);
    expect(overdueOpportunity?.confidence).toBe(0.9);
  });

  it('should detect invoices due soon', () => {
    const now = new Date();
    const inThreeDays = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);

    const invoices = [
      {
        name: 'Tech Inc',
        amount: 2500,
        dueDate: inThreeDays,
        status: 'unpaid' as const,
      },
    ];

    const opportunities = analyzeInvoicesForOpportunities(invoices);
    const dueSoonOpportunity = opportunities.find((o) => o.title.includes('due within 7 days'));

    expect(dueSoonOpportunity).toBeDefined();
    expect(dueSoonOpportunity?.value).toBe(2500);
  });

  it('should identify high-value invoices', () => {
    const invoices = [
      {
        name: 'Global Solutions',
        amount: 8200,
        dueDate: new Date(),
        status: 'unpaid' as const,
      },
      {
        name: 'Small Client',
        amount: 500,
        dueDate: new Date(),
        status: 'unpaid' as const,
      },
    ];

    const opportunities = analyzeInvoicesForOpportunities(invoices);
    const highValueOpportunity = opportunities.find((o) => o.title.includes('high-value'));

    expect(highValueOpportunity).toBeDefined();
    expect(highValueOpportunity?.value).toBe(8200);
  });
});

describe('Findings Generator', () => {
  it('should calculate total revenue potential', () => {
    const findings = [
      { type: 'invoice' as const, title: 'Test 1', description: '', value: 5000, confidence: 0.9, recommendation: '' },
      { type: 'invoice' as const, title: 'Test 2', description: '', value: 3000, confidence: 0.8, recommendation: '' },
    ];

    const total = calculateTotalRevenuePotential(findings);
    expect(total).toBe(8000);
  });

  it('should filter high confidence findings', () => {
    const findings = [
      { type: 'invoice' as const, title: 'High', description: '', value: 5000, confidence: 0.9, recommendation: '' },
      { type: 'invoice' as const, title: 'Low', description: '', value: 1000, confidence: 0.5, recommendation: '' },
      { type: 'invoice' as const, title: 'Medium', description: '', value: 2000, confidence: 0.75, recommendation: '' },
    ];

    const highConfidence = getHighConfidenceFindings(findings);
    expect(highConfidence).toHaveLength(2);
    expect(highConfidence.every((f) => f.confidence > 0.7)).toBe(true);
  });

  it('should sort findings by value', () => {
    const findings = generateFindings(undefined, undefined, [
      {
        name: 'Small',
        amount: 1000,
        dueDate: new Date(),
        status: 'unpaid' as const,
      },
      {
        name: 'Large',
        amount: 10000,
        dueDate: new Date(),
        status: 'unpaid' as const,
      },
    ]);

    expect(findings[0].value).toBeGreaterThanOrEqual(findings[1]?.value || 0);
  });
});
