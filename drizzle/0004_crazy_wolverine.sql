CREATE TABLE `book_reviews` (
	`id` int AUTO_INCREMENT NOT NULL,
	`bookId` int NOT NULL,
	`reviewerName` varchar(255) NOT NULL,
	`reviewerPhoto` text,
	`rating` int NOT NULL,
	`review` text NOT NULL,
	`source` varchar(100),
	`featured` boolean DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `book_reviews_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `books` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`slug` varchar(255) NOT NULL,
	`series` varchar(255),
	`seriesOrder` int,
	`coverImage` text NOT NULL,
	`description` text NOT NULL,
	`sampleChapter` text,
	`rating` int DEFAULT 5,
	`reviewCount` int DEFAULT 0,
	`tropes` text,
	`heatLevel` int DEFAULT 3,
	`pageCount` int,
	`publishDate` varchar(100),
	`amazonUrl` text,
	`appleUrl` text,
	`koboUrl` text,
	`barnesNobleUrl` text,
	`googlePlayUrl` text,
	`featured` boolean DEFAULT false,
	`displayOrder` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `books_id` PRIMARY KEY(`id`),
	CONSTRAINT `books_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
ALTER TABLE `book_reviews` ADD CONSTRAINT `book_reviews_bookId_books_id_fk` FOREIGN KEY (`bookId`) REFERENCES `books`(`id`) ON DELETE no action ON UPDATE no action;