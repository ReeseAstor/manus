CREATE TABLE `admin_reminders` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`title` varchar(255) NOT NULL,
	`description` text,
	`reminderType` enum('broken_link','pricing_check','content_review','qa_issue','custom') NOT NULL,
	`priority` enum('low','medium','high','urgent') NOT NULL DEFAULT 'medium',
	`relatedEntityType` varchar(50),
	`relatedEntityId` int,
	`dueDate` timestamp,
	`status` enum('pending','completed','dismissed','snoozed') NOT NULL DEFAULT 'pending',
	`snoozedUntil` timestamp,
	`completedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `admin_reminders_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `book_characters` (
	`id` int AUTO_INCREMENT NOT NULL,
	`bookId` int NOT NULL,
	`fullName` varchar(255) NOT NULL,
	`nickname` varchar(100),
	`role` enum('protagonist','love_interest','antagonist','supporting','minor') NOT NULL,
	`description` text,
	`physicalDescription` text,
	`personality` text,
	`backstory` text,
	`occupation` varchar(255),
	`age` varchar(50),
	`displayOrder` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `book_characters_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `book_pricing_history` (
	`id` int AUTO_INCREMENT NOT NULL,
	`bookId` int NOT NULL,
	`platform` enum('amazon','apple','kobo','barnes_noble','google_play','direct') NOT NULL,
	`price` varchar(50) NOT NULL,
	`priceInCents` int,
	`currency` varchar(3) DEFAULT 'USD',
	`verifiedAt` timestamp NOT NULL,
	`verificationSource` varchar(100),
	`previousPrice` varchar(50),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `book_pricing_history_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `book_storylines` (
	`id` int AUTO_INCREMENT NOT NULL,
	`bookId` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`storylineType` enum('main_plot','subplot','romance_arc','character_arc','mystery') NOT NULL,
	`description` text NOT NULL,
	`keyEvents` text,
	`resolution` text,
	`displayOrder` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `book_storylines_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `character_relationships` (
	`id` int AUTO_INCREMENT NOT NULL,
	`character1Id` int NOT NULL,
	`character2Id` int NOT NULL,
	`relationshipType` enum('romantic','family','friend','rival','colleague','enemy') NOT NULL,
	`description` text,
	`bookId` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `character_relationships_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `content_audit_log` (
	`id` int AUTO_INCREMENT NOT NULL,
	`entityType` varchar(50) NOT NULL,
	`entityId` int NOT NULL,
	`action` enum('create','update','delete','publish','unpublish') NOT NULL,
	`fieldChanged` varchar(100),
	`oldValue` text,
	`newValue` text,
	`changedBy` int,
	`changeReason` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `content_audit_log_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `daily_reports` (
	`id` int AUTO_INCREMENT NOT NULL,
	`reportDate` timestamp NOT NULL,
	`reportType` enum('daily_overview','weekly_summary','monthly_summary') NOT NULL DEFAULT 'daily_overview',
	`pageViews` int DEFAULT 0,
	`uniqueVisitors` int DEFAULT 0,
	`bounceRate` decimal(5,2),
	`avgSessionDuration` int,
	`newSubscribers` int DEFAULT 0,
	`unsubscribes` int DEFAULT 0,
	`blogPostViews` int DEFAULT 0,
	`bookPageViews` int DEFAULT 0,
	`qaChecksPassed` int DEFAULT 0,
	`qaChecksFailed` int DEFAULT 0,
	`openIssues` int DEFAULT 0,
	`resolvedIssues` int DEFAULT 0,
	`brokenLinksFound` int DEFAULT 0,
	`totalOrders` int DEFAULT 0,
	`totalRevenue` int DEFAULT 0,
	`summary` text,
	`alerts` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `daily_reports_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `external_links` (
	`id` int AUTO_INCREMENT NOT NULL,
	`url` text NOT NULL,
	`displayText` varchar(255),
	`linkType` enum('amazon','social','affiliate','resource','other') NOT NULL DEFAULT 'other',
	`location` varchar(255) NOT NULL,
	`componentPath` varchar(255),
	`lastChecked` timestamp,
	`lastStatus` enum('active','broken','redirected','unknown') NOT NULL DEFAULT 'unknown',
	`httpStatus` int,
	`responseTime` int,
	`checkCount` int NOT NULL DEFAULT 0,
	`failCount` int NOT NULL DEFAULT 0,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `external_links_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `qa_checks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`checkDate` timestamp NOT NULL,
	`checkType` enum('pricing','links','content','characters','full_audit') NOT NULL,
	`status` enum('passed','failed','warning') NOT NULL DEFAULT 'passed',
	`itemsChecked` int NOT NULL DEFAULT 0,
	`issuesFound` int NOT NULL DEFAULT 0,
	`details` text,
	`autoResolved` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `qa_checks_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `qa_issues` (
	`id` int AUTO_INCREMENT NOT NULL,
	`checkId` int,
	`issueType` enum('pricing_mismatch','broken_link','content_error','character_inconsistency','missing_data') NOT NULL,
	`severity` enum('critical','warning','info') NOT NULL DEFAULT 'warning',
	`location` varchar(255) NOT NULL,
	`description` text NOT NULL,
	`expectedValue` text,
	`actualValue` text,
	`status` enum('open','resolved','ignored') NOT NULL DEFAULT 'open',
	`resolvedAt` timestamp,
	`resolvedBy` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `qa_issues_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `admin_reminders` ADD CONSTRAINT `admin_reminders_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `book_characters` ADD CONSTRAINT `book_characters_bookId_books_id_fk` FOREIGN KEY (`bookId`) REFERENCES `books`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `book_pricing_history` ADD CONSTRAINT `book_pricing_history_bookId_books_id_fk` FOREIGN KEY (`bookId`) REFERENCES `books`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `book_storylines` ADD CONSTRAINT `book_storylines_bookId_books_id_fk` FOREIGN KEY (`bookId`) REFERENCES `books`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `character_relationships` ADD CONSTRAINT `character_relationships_character1Id_book_characters_id_fk` FOREIGN KEY (`character1Id`) REFERENCES `book_characters`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `character_relationships` ADD CONSTRAINT `character_relationships_character2Id_book_characters_id_fk` FOREIGN KEY (`character2Id`) REFERENCES `book_characters`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `character_relationships` ADD CONSTRAINT `character_relationships_bookId_books_id_fk` FOREIGN KEY (`bookId`) REFERENCES `books`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `content_audit_log` ADD CONSTRAINT `content_audit_log_changedBy_users_id_fk` FOREIGN KEY (`changedBy`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `qa_issues` ADD CONSTRAINT `qa_issues_checkId_qa_checks_id_fk` FOREIGN KEY (`checkId`) REFERENCES `qa_checks`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `qa_issues` ADD CONSTRAINT `qa_issues_resolvedBy_users_id_fk` FOREIGN KEY (`resolvedBy`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;