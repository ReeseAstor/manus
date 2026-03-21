CREATE TABLE `business_goals` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`category` enum('subscribers','revenue','books','content','social','launches','other') NOT NULL,
	`targetValue` int NOT NULL,
	`currentValue` int NOT NULL DEFAULT 0,
	`unit` varchar(50) NOT NULL,
	`startDate` timestamp NOT NULL,
	`endDate` timestamp NOT NULL,
	`status` enum('active','completed','missed','paused') NOT NULL DEFAULT 'active',
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `business_goals_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `business_metrics` (
	`id` int AUTO_INCREMENT NOT NULL,
	`date` timestamp NOT NULL,
	`totalSubscribers` int DEFAULT 0,
	`newSubscribers` int DEFAULT 0,
	`unsubscribes` int DEFAULT 0,
	`emailOpenRate` decimal(5,2),
	`emailClickRate` decimal(5,2),
	`pageViews` int DEFAULT 0,
	`uniqueVisitors` int DEFAULT 0,
	`dailyRevenue` int DEFAULT 0,
	`ordersCount` int DEFAULT 0,
	`instagramFollowers` int,
	`tiktokFollowers` int,
	`goodreadsFollowers` int,
	`amazonRanking` int,
	`reviewCount` int,
	`averageRating` decimal(3,2),
	`kdpRoyalties` int,
	`pagesRead` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `business_metrics_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `daily_briefings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`briefingDate` timestamp NOT NULL,
	`executiveSummary` text NOT NULL,
	`subscriberUpdate` text,
	`revenueUpdate` text,
	`contentUpdate` text,
	`goalProgress` text,
	`actionItems` text,
	`alerts` text,
	`toolRecommendations` text,
	`dataSnapshot` text,
	`emailSent` boolean DEFAULT false,
	`emailSentAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `daily_briefings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `tool_inventory` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`url` text NOT NULL,
	`category` enum('video','audio','design','writing','marketing','analytics','kdp','social','email','other') NOT NULL,
	`plan` varchar(100),
	`loginEmail` varchar(320),
	`loginMethod` varchar(50),
	`status` enum('active','needs_login','expired','pending') NOT NULL DEFAULT 'active',
	`description` text,
	`kdpUseCases` text,
	`features` text,
	`usageLimits` text,
	`lastChecked` timestamp,
	`iconEmoji` varchar(10),
	`displayOrder` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `tool_inventory_id` PRIMARY KEY(`id`)
);
