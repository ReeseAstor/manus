CREATE TABLE `affiliate_clicks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`productName` varchar(255) NOT NULL,
	`productId` varchar(64),
	`affiliateUrl` text NOT NULL,
	`sourceSlug` varchar(255) NOT NULL,
	`clickType` enum('inline','card','favorites') NOT NULL DEFAULT 'inline',
	`sessionHash` varchar(64),
	`userAgent` text,
	`referrer` text,
	`country` varchar(2),
	`userId` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `affiliate_clicks_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `affiliate_metrics_daily` (
	`id` int AUTO_INCREMENT NOT NULL,
	`metricDate` timestamp NOT NULL,
	`totalClicks` int NOT NULL DEFAULT 0,
	`uniqueClicks` int NOT NULL DEFAULT 0,
	`topProduct` text,
	`topSource` text,
	`clickTypeBreakdown` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `affiliate_metrics_daily_id` PRIMARY KEY(`id`)
);
