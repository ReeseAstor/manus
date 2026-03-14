CREATE TABLE `ai_studio_conversations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`model` varchar(100) NOT NULL,
	`system_prompt` text,
	`messages` text NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `ai_studio_conversations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `ai_studio_conversations` ADD CONSTRAINT `ai_studio_conversations_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;