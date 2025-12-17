CREATE TABLE `ebook_files` (
	`id` int AUTO_INCREMENT NOT NULL,
	`bookId` int NOT NULL,
	`format` enum('epub','mobi','pdf') NOT NULL,
	`fileUrl` text NOT NULL,
	`fileSize` varchar(50),
	`version` varchar(50) DEFAULT '1.0',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `ebook_files_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user_purchases` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`bookId` int NOT NULL,
	`orderId` int,
	`purchaseType` enum('single','bundle') NOT NULL DEFAULT 'single',
	`purchasePrice` int NOT NULL,
	`bonusContentUnlocked` boolean DEFAULT true,
	`downloadCount` int DEFAULT 0,
	`lastDownloadAt` timestamp,
	`purchasedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `user_purchases_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `ebook_files` ADD CONSTRAINT `ebook_files_bookId_books_id_fk` FOREIGN KEY (`bookId`) REFERENCES `books`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user_purchases` ADD CONSTRAINT `user_purchases_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user_purchases` ADD CONSTRAINT `user_purchases_bookId_books_id_fk` FOREIGN KEY (`bookId`) REFERENCES `books`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user_purchases` ADD CONSTRAINT `user_purchases_orderId_orders_id_fk` FOREIGN KEY (`orderId`) REFERENCES `orders`(`id`) ON DELETE no action ON UPDATE no action;