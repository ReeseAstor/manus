CREATE TABLE `sms_message_log` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`templateId` int,
	`toPhoneNumber` varchar(20) NOT NULL,
	`messageBody` text NOT NULL,
	`twilioSid` varchar(64),
	`status` enum('queued','sent','delivered','failed','undelivered') NOT NULL DEFAULT 'queued',
	`errorMessage` text,
	`sentAt` timestamp NOT NULL DEFAULT (now()),
	`deliveredAt` timestamp,
	CONSTRAINT `sms_message_log_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `sms_templates` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(100) NOT NULL,
	`name` varchar(200) NOT NULL,
	`description` text,
	`messageTemplate` text NOT NULL,
	`category` enum('vip','order','marketing','system') NOT NULL DEFAULT 'system',
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `sms_templates_id` PRIMARY KEY(`id`),
	CONSTRAINT `sms_templates_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `user_sms_preferences` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`phoneNumber` varchar(20),
	`phoneVerified` boolean NOT NULL DEFAULT false,
	`smsOptIn` boolean NOT NULL DEFAULT false,
	`smsNewReleases` boolean NOT NULL DEFAULT true,
	`smsVipAlerts` boolean NOT NULL DEFAULT true,
	`smsOrderUpdates` boolean NOT NULL DEFAULT true,
	`smsMarketing` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `user_sms_preferences_id` PRIMARY KEY(`id`),
	CONSTRAINT `user_sms_preferences_userId_unique` UNIQUE(`userId`)
);
--> statement-breakpoint
ALTER TABLE `sms_message_log` ADD CONSTRAINT `sms_message_log_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `sms_message_log` ADD CONSTRAINT `sms_message_log_templateId_sms_templates_id_fk` FOREIGN KEY (`templateId`) REFERENCES `sms_templates`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user_sms_preferences` ADD CONSTRAINT `user_sms_preferences_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;