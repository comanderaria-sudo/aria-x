import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, tasks, watchEvents, findings, executions, knowledgeNodes } from "../drizzle/schema";
import { ENV } from './_core/env';
import { nanoid } from "nanoid";


let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Agent Loop Queries

export async function createTask(
  userId: number,
  type: "watch" | "reason" | "propose" | "approve" | "execute" | "remember",
  input?: unknown
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const taskId = nanoid();
  await db.insert(tasks).values({
    id: taskId,
    userId,
    type,
    status: "pending",
    input: input ? JSON.stringify(input) : null,
  });
  return taskId;
}

export async function updateTaskStatus(
  taskId: string,
  status: "pending" | "running" | "completed" | "failed",
  result?: unknown,
  error?: string,
  logs?: string
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .update(tasks)
    .set({
      status,
      result: result ? JSON.stringify(result) : null,
      error,
      logs,
      completedAt: status === "completed" || status === "failed" ? new Date() : null,
      startedAt: status === "running" ? new Date() : null,
    })
    .where(eq(tasks.id, taskId));
}

export async function createWatchEvent(
  userId: number,
  sourceType: "invoice" | "lead" | "calendar" | "email",
  data: unknown,
  sourceId?: string
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const eventId = nanoid();
  await db.insert(watchEvents).values({
    id: eventId,
    userId,
    sourceType,
    sourceId,
    data: JSON.stringify(data),
  });
  return eventId;
}

export async function createFinding(
  userId: number,
  type: "invoice" | "lead" | "calendar",
  issue: string,
  value: number,
  confidence: number,
  recommendedAction: string,
  reasoning?: string
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const findingId = nanoid();
  await db.insert(findings).values({
    id: findingId,
    userId,
    type,
    issue,
    value,
    confidence,
    recommendedAction,
    reasoning,
  });
  return findingId;
}

export async function getUserFindings(userId: number, status?: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  if (status) {
    return db
      .select()
      .from(findings)
      .where(
        status
          ? eq(findings.status, status as any)
          : eq(findings.userId, userId)
      );
  }
  return db.select().from(findings).where(eq(findings.userId, userId));
}

export async function updateFindingStatus(
  findingId: string,
  status: "pending" | "approved" | "rejected" | "executed"
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .update(findings)
    .set({
      status,
      executedAt: status === "executed" ? new Date() : null,
    })
    .where(eq(findings.id, findingId));
}

export async function createExecution(
  userId: number,
  findingId: string,
  type: "email" | "calendar" | "invoice"
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const executionId = nanoid();
  await db.insert(executions).values({
    id: executionId,
    userId,
    findingId,
    type,
    status: "pending",
  });
  return executionId;
}

export async function updateExecutionStatus(
  executionId: string,
  status: "pending" | "running" | "completed" | "failed",
  result?: unknown,
  error?: string
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .update(executions)
    .set({
      status,
      result: result ? JSON.stringify(result) : null,
      error,
      completedAt: status === "completed" || status === "failed" ? new Date() : null,
      startedAt: status === "running" ? new Date() : null,
    })
    .where(eq(executions.id, executionId));
}

export async function getUserTasks(userId: number, type?: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  if (type) {
    return db
      .select()
      .from(tasks)
      .where(
        type
          ? eq(tasks.type, type as any)
          : eq(tasks.userId, userId)
      );
  }
  return db.select().from(tasks).where(eq(tasks.userId, userId));
}

export async function getUserWatchEvents(userId: number, sourceType?: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  if (sourceType) {
    return db
      .select()
      .from(watchEvents)
      .where(
        sourceType
          ? eq(watchEvents.sourceType, sourceType as any)
          : eq(watchEvents.userId, userId)
      );
  }
  return db.select().from(watchEvents).where(eq(watchEvents.userId, userId));
}

// TODO: add more feature queries here as your schema grows.
