CREATE TABLE `executions` (
	`id` varchar(36) NOT NULL,
	`userId` int NOT NULL,
	`findingId` varchar(36) NOT NULL,
	`type` enum('email','calendar','invoice') NOT NULL,
	`status` enum('pending','running','completed','failed') NOT NULL DEFAULT 'pending',
	`result` json,
	`error` text,
	`startedAt` timestamp,
	`completedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `executions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `findings` (
	`id` varchar(36) NOT NULL,
	`userId` int NOT NULL,
	`type` enum('invoice','lead','calendar') NOT NULL,
	`issue` text NOT NULL,
	`value` int NOT NULL,
	`confidence` int NOT NULL,
	`recommendedAction` text NOT NULL,
	`reasoning` text,
	`status` enum('pending','approved','rejected','executed') NOT NULL DEFAULT 'pending',
	`executedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `findings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `knowledge_nodes` (
	`id` varchar(36) NOT NULL,
	`userId` int NOT NULL,
	`nodeType` enum('pattern','preference','constraint','goal','skill') NOT NULL,
	`category` varchar(100) NOT NULL,
	`key` varchar(255) NOT NULL,
	`value` json NOT NULL,
	`confidence` float DEFAULT 0.5,
	`evidenceCount` int DEFAULT 1,
	`lastUpdated` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `knowledge_nodes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `tasks` (
	`id` varchar(36) NOT NULL,
	`userId` int NOT NULL,
	`type` enum('watch','reason','propose','approve','execute','remember') NOT NULL,
	`status` enum('pending','running','completed','failed') NOT NULL DEFAULT 'pending',
	`input` json,
	`result` json,
	`logs` text,
	`error` text,
	`startedAt` timestamp,
	`completedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `tasks_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `watch_events` (
	`id` varchar(36) NOT NULL,
	`userId` int NOT NULL,
	`sourceType` enum('invoice','lead','calendar','email') NOT NULL,
	`sourceId` varchar(255),
	`data` json NOT NULL,
	`detectedAt` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `watch_events_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `user_idx` ON `executions` (`userId`);--> statement-breakpoint
CREATE INDEX `finding_idx` ON `executions` (`findingId`);--> statement-breakpoint
CREATE INDEX `status_idx` ON `executions` (`status`);--> statement-breakpoint
CREATE INDEX `user_idx` ON `findings` (`userId`);--> statement-breakpoint
CREATE INDEX `type_idx` ON `findings` (`type`);--> statement-breakpoint
CREATE INDEX `status_idx` ON `findings` (`status`);--> statement-breakpoint
CREATE INDEX `user_idx` ON `knowledge_nodes` (`userId`);--> statement-breakpoint
CREATE INDEX `node_type_idx` ON `knowledge_nodes` (`nodeType`);--> statement-breakpoint
CREATE INDEX `user_idx` ON `tasks` (`userId`);--> statement-breakpoint
CREATE INDEX `status_idx` ON `tasks` (`status`);--> statement-breakpoint
CREATE INDEX `type_idx` ON `tasks` (`type`);--> statement-breakpoint
CREATE INDEX `user_idx` ON `watch_events` (`userId`);--> statement-breakpoint
CREATE INDEX `source_type_idx` ON `watch_events` (`sourceType`);