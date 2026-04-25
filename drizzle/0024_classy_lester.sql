CREATE TABLE `partner_applications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`authorName` varchar(255) NOT NULL,
	`email` varchar(320) NOT NULL,
	`website` text,
	`bookTitle` varchar(255) NOT NULL,
	`genre` varchar(100) NOT NULL,
	`tropes` text,
	`bookDescription` text NOT NULL,
	`downloadLink` text,
	`coverImageUrl` text,
	`subscriberCount` varchar(50),
	`socialLinks` text,
	`status` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending',
	`adminNotes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `partner_applications_id` PRIMARY KEY(`id`)
);
