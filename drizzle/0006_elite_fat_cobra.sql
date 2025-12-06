CREATE TABLE `content_access` (
	`id` int AUTO_INCREMENT NOT NULL,
	`memberId` int NOT NULL,
	`contentId` int NOT NULL,
	`accessedAt` timestamp NOT NULL DEFAULT (now()),
	`viewCount` int DEFAULT 1,
	CONSTRAINT `content_access_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `exclusive_content` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`slug` varchar(255) NOT NULL,
	`type` enum('bonus_chapter','interview','behind_scenes') NOT NULL,
	`category` varchar(100),
	`description` text,
	`content` text NOT NULL,
	`coverImage` text,
	`bookId` int,
	`featured` boolean DEFAULT false,
	`displayOrder` int DEFAULT 0,
	`publishDate` timestamp NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `exclusive_content_id` PRIMARY KEY(`id`),
	CONSTRAINT `exclusive_content_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `reader_club_members` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`email` varchar(320) NOT NULL,
	`name` varchar(255),
	`joinedAt` timestamp NOT NULL DEFAULT (now()),
	`lastAccessAt` timestamp,
	`active` boolean DEFAULT true,
	CONSTRAINT `reader_club_members_id` PRIMARY KEY(`id`),
	CONSTRAINT `reader_club_members_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
ALTER TABLE `content_access` ADD CONSTRAINT `content_access_memberId_reader_club_members_id_fk` FOREIGN KEY (`memberId`) REFERENCES `reader_club_members`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `content_access` ADD CONSTRAINT `content_access_contentId_exclusive_content_id_fk` FOREIGN KEY (`contentId`) REFERENCES `exclusive_content`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `exclusive_content` ADD CONSTRAINT `exclusive_content_bookId_books_id_fk` FOREIGN KEY (`bookId`) REFERENCES `books`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `reader_club_members` ADD CONSTRAINT `reader_club_members_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;