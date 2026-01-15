CREATE TABLE `mailerlite_webhook_events` (
	`id` int AUTO_INCREMENT NOT NULL,
	`eventType` varchar(100) NOT NULL,
	`subscriberId` varchar(100),
	`subscriberEmail` varchar(320),
	`groupId` varchar(100),
	`groupName` varchar(255),
	`payload` text NOT NULL,
	`processed` boolean NOT NULL DEFAULT false,
	`processedAt` timestamp,
	`error` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `mailerlite_webhook_events_id` PRIMARY KEY(`id`)
);
