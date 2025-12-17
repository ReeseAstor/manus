CREATE TABLE `user_preferences` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`emailNewReleases` boolean NOT NULL DEFAULT true,
	`emailNewsletter` boolean NOT NULL DEFAULT true,
	`emailPromotions` boolean NOT NULL DEFAULT true,
	`emailBlogPosts` boolean NOT NULL DEFAULT false,
	`preferredFormat` enum('epub','mobi','pdf') NOT NULL DEFAULT 'epub',
	`displayName` varchar(100),
	`bio` text,
	`favoriteGenres` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `user_preferences_id` PRIMARY KEY(`id`),
	CONSTRAINT `user_preferences_userId_unique` UNIQUE(`userId`)
);
--> statement-breakpoint
ALTER TABLE `user_preferences` ADD CONSTRAINT `user_preferences_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;