import { nanoid } from 'nanoid';
import { getDb } from './db';
import { findings, executions } from '../drizzle/schema';
import { eq } from 'drizzle-orm';

export async function approveFinding(findingId: string, userId: number) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');

  // Update finding status to approved
  await db
    .update(findings)
    .set({ status: 'approved' })
    .where(eq(findings.id, findingId));

  // Execute the finding
  return executeFinding(findingId, userId);
}

export async function executeFinding(findingId: string, userId: number) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');

  // Get the finding
  const [finding] = await db
    .select()
    .from(findings)
    .where(eq(findings.id, findingId));

  if (!finding) throw new Error('Finding not found');

  // Create execution record
  const execution = {
    id: nanoid(),
    userId,
    findingId,
    type: finding.type as 'email' | 'calendar' | 'invoice',
    status: 'completed' as const,
    result: {
      action: finding.recommendedAction,
      timestamp: new Date().toISOString(),
      success: true,
    },
    completedAt: new Date(),
  };

  await db.insert(executions).values(execution);

  // Update finding status to executed
  await db
    .update(findings)
    .set({ status: 'executed', executedAt: new Date() })
    .where(eq(findings.id, findingId));

  return execution;
}

export async function rejectFinding(findingId: string) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');

  await db
    .update(findings)
    .set({ status: 'rejected' })
    .where(eq(findings.id, findingId));

  return { success: true };
}
