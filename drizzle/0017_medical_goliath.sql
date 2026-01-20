CREATE TABLE `sms_analytics_daily` (
	`id` int AUTO_INCREMENT NOT NULL,
	`date` timestamp NOT NULL,
	`totalSent` int NOT NULL DEFAULT 0,
	`totalDelivered` int NOT NULL DEFAULT 0,
	`totalFailed` int NOT NULL DEFAULT 0,
	`totalOptIns` int NOT NULL DEFAULT 0,
	`totalOptOuts` int NOT NULL DEFAULT 0,
	`totalResponses` int NOT NULL DEFAULT 0,
	`deliveryRate` decimal(5,2),
	`responseRate` decimal(5,2),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `sms_analytics_daily_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `sms_incoming_messages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`fromPhoneNumber` varchar(20) NOT NULL,
	`messageBody` text NOT NULL,
	`twilioSid` varchar(64),
	`keyword` varchar(20),
	`processed` boolean NOT NULL DEFAULT false,
	`responseStatus` enum('success','failed','pending') NOT NULL DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `sms_incoming_messages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `sms_opt_events` (
	`id` int AUTO_INCREMENT NOT NULL,
	`phoneNumber` varchar(20) NOT NULL,
	`userId` int,
	`eventType` enum('opt_in','opt_out','resubscribe') NOT NULL,
	`source` varchar(50),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `sms_opt_events_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `sms_opt_events` ADD CONSTRAINT `sms_opt_events_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;