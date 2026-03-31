import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, json, float, index } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ============================================================================
// AGENT LOOP TABLES
// ============================================================================

export const tasks = mysqlTable(
  "tasks",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    userId: int("userId").notNull(),
    type: mysqlEnum("type", [
      "watch",
      "reason",
      "propose",
      "approve",
      "execute",
      "remember",
    ]).notNull(),
    status: mysqlEnum("status", [
      "pending",
      "running",
      "completed",
      "failed",
    ])
      .default("pending")
      .notNull(),
    input: json("input"),
    result: json("result"),
    logs: text("logs"),
    error: text("error"),
    startedAt: timestamp("startedAt"),
    completedAt: timestamp("completedAt"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => ({
    userIdx: index("user_idx").on(table.userId),
    statusIdx: index("status_idx").on(table.status),
    typeIdx: index("type_idx").on(table.type),
  })
);

export type Task = typeof tasks.$inferSelect;
export type InsertTask = typeof tasks.$inferInsert;

export const watchEvents = mysqlTable(
  "watch_events",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    userId: int("userId").notNull(),
    sourceType: mysqlEnum("sourceType", [
      "invoice",
      "lead",
      "calendar",
      "email",
    ]).notNull(),
    sourceId: varchar("sourceId", { length: 255 }),
    data: json("data").notNull(),
    detectedAt: timestamp("detectedAt").defaultNow().notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => ({
    userIdx: index("user_idx").on(table.userId),
    sourceTypeIdx: index("source_type_idx").on(table.sourceType),
  })
);

export type WatchEvent = typeof watchEvents.$inferSelect;
export type InsertWatchEvent = typeof watchEvents.$inferInsert;

export const findings = mysqlTable(
  "findings",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    userId: int("userId").notNull(),
    type: mysqlEnum("type", ["invoice", "lead", "calendar"]).notNull(),
    issue: text("issue").notNull(),
    value: int("value").notNull(),
    confidence: int("confidence").notNull(),
    recommendedAction: text("recommendedAction").notNull(),
    reasoning: text("reasoning"),
    status: mysqlEnum("status", [
      "pending",
      "approved",
      "rejected",
      "executed",
    ])
      .default("pending")
      .notNull(),
    executedAt: timestamp("executedAt"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => ({
    userIdx: index("user_idx").on(table.userId),
    typeIdx: index("type_idx").on(table.type),
    statusIdx: index("status_idx").on(table.status),
  })
);

export type Finding = typeof findings.$inferSelect;
export type InsertFinding = typeof findings.$inferInsert;

export const executions = mysqlTable(
  "executions",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    userId: int("userId").notNull(),
    findingId: varchar("findingId", { length: 36 }).notNull(),
    type: mysqlEnum("type", ["email", "calendar", "invoice"]).notNull(),
    status: mysqlEnum("status", [
      "pending",
      "running",
      "completed",
      "failed",
    ])
      .default("pending")
      .notNull(),
    result: json("result"),
    error: text("error"),
    startedAt: timestamp("startedAt"),
    completedAt: timestamp("completedAt"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => ({
    userIdx: index("user_idx").on(table.userId),
    findingIdx: index("finding_idx").on(table.findingId),
    statusIdx: index("status_idx").on(table.status),
  })
);

export type Execution = typeof executions.$inferSelect;
export type InsertExecution = typeof executions.$inferInsert;

export const knowledgeNodes = mysqlTable(
  "knowledge_nodes",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    userId: int("userId").notNull(),
    nodeType: mysqlEnum("nodeType", [
      "pattern",
      "preference",
      "constraint",
      "goal",
      "skill",
    ]).notNull(),
    category: varchar("category", { length: 100 }).notNull(),
    key: varchar("key", { length: 255 }).notNull(),
    value: json("value").notNull(),
    confidence: float("confidence").default(0.5),
    evidenceCount: int("evidenceCount").default(1),
    lastUpdated: timestamp("lastUpdated").defaultNow().onUpdateNow().notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => ({
    userIdx: index("user_idx").on(table.userId),
    nodeTypeIdx: index("node_type_idx").on(table.nodeType),
  })
);

export type KnowledgeNode = typeof knowledgeNodes.$inferSelect;
export type InsertKnowledgeNode = typeof knowledgeNodes.$inferInsert;