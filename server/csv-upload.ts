import { parse } from 'csv-parse/sync';
import { nanoid } from 'nanoid';
import { getDb } from './db';
import { watchEvents } from '../drizzle/schema';

export async function parseAndStoreInvoices(csvContent: string, userId: number) {
  try {
    const records = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    }) as Array<Record<string, unknown>>;

    const db = await getDb();
    if (!db) throw new Error('Database not available');

    const storedInvoices = [];

    for (const record of records) {
      const invoice = {
        id: nanoid(),
        name: (record.name || record.company || 'Unknown') as string,
        amount: parseFloat(String(record.amount)) || 0,
        dueDate: new Date(String(record.due_date || record.dueDate || Date.now())),
      };

      // Store as watch event for invoice
      await db.insert(watchEvents).values({
        id: nanoid(),
        userId,
        sourceType: 'invoice',
        sourceId: invoice.id,
        data: invoice,
      });
      storedInvoices.push(invoice);
    }

    return storedInvoices;
  } catch (error) {
    throw new Error(`CSV parsing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export function validateCSVFormat(csvContent: string): boolean {
  try {
    const records = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    }) as Array<Record<string, unknown>>;

    if (records.length === 0) return false;

    // Check if required columns exist
    const firstRecord = records[0];
    const hasName = 'name' in firstRecord || 'company' in firstRecord;
    const hasAmount = 'amount' in firstRecord;
    const hasDueDate = 'due_date' in firstRecord || 'dueDate' in firstRecord;

    return hasName && hasAmount && hasDueDate;
  } catch {
    return false;
  }
}
