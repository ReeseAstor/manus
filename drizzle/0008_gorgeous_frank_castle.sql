CREATE TABLE `browsing_history` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`bookId` int NOT NULL,
	`viewCount` int NOT NULL DEFAULT 1,
	`lastViewedAt` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `browsing_history_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `browsing_history` ADD CONSTRAINT `browsing_history_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `browsing_history` ADD CONSTRAINT `browsing_history_bookId_books_id_fk` FOREIGN KEY (`bookId`) REFERENCES `books`(`id`) ON DELETE no action ON UPDATE no action;