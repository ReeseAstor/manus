CREATE TABLE `ai_chat_messages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`session_id` varchar(255) NOT NULL,
	`role` enum('user','assistant') NOT NULL,
	`content` text NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `ai_chat_messages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `ai_generated_content` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int,
	`content_type` enum('blog_post','story_idea','book_cover','character_portrait','social_graphic') NOT NULL,
	`prompt` text NOT NULL,
	`result` text NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `ai_generated_content_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `quiz_results` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(320),
	`result` varchar(255) NOT NULL,
	`personality` text NOT NULL,
	`answers` text NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `quiz_results_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `ai_generated_content` ADD CONSTRAINT `ai_generated_content_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;