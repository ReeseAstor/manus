CREATE TABLE `custom_story_requests` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`prompt` text NOT NULL,
	`characters` text,
	`setting` varchar(255),
	`heatLevel` int DEFAULT 4,
	`status` enum('pending','generating','completed','failed') NOT NULL DEFAULT 'pending',
	`generatedStoryId` int,
	`audioUrl` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`completedAt` timestamp,
	CONSTRAINT `custom_story_requests_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `steamy_stories` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`slug` varchar(255) NOT NULL,
	`description` text NOT NULL,
	`content` text NOT NULL,
	`excerpt` text,
	`audioUrl` text,
	`audioDuration` int,
	`coverImage` text,
	`category` enum('romance','passion','fantasy','reunion','forbidden','first_time') NOT NULL DEFAULT 'romance',
	`heatLevel` int DEFAULT 4,
	`characters` text,
	`bookId` int,
	`minTier` int DEFAULT 1,
	`featured` boolean DEFAULT false,
	`published` boolean DEFAULT false,
	`publishedAt` timestamp,
	`playCount` int DEFAULT 0,
	`likeCount` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `steamy_stories_id` PRIMARY KEY(`id`),
	CONSTRAINT `steamy_stories_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `story_likes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`storyId` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `story_likes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `story_play_history` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`storyId` int NOT NULL,
	`progress` int DEFAULT 0,
	`completed` boolean DEFAULT false,
	`playedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `story_play_history_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `vip_members` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`tierId` int NOT NULL,
	`stripeSubscriptionId` varchar(255),
	`stripeCustomerId` varchar(255),
	`status` enum('active','canceled','past_due','trial') NOT NULL DEFAULT 'active',
	`currentPeriodStart` timestamp NOT NULL,
	`currentPeriodEnd` timestamp NOT NULL,
	`cancelAtPeriodEnd` boolean NOT NULL DEFAULT false,
	`customStoriesUsed` int DEFAULT 0,
	`joinedAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `vip_members_id` PRIMARY KEY(`id`),
	CONSTRAINT `vip_members_userId_unique` UNIQUE(`userId`)
);
--> statement-breakpoint
CREATE TABLE `vip_tiers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`slug` varchar(100) NOT NULL,
	`description` text NOT NULL,
	`price` int NOT NULL,
	`features` text NOT NULL,
	`stripePriceId` varchar(255),
	`stripeProductId` varchar(255),
	`storiesPerMonth` int DEFAULT 0,
	`customStoriesAllowed` boolean DEFAULT false,
	`personalizedMessages` boolean DEFAULT false,
	`displayOrder` int DEFAULT 0,
	`active` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `vip_tiers_id` PRIMARY KEY(`id`),
	CONSTRAINT `vip_tiers_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
ALTER TABLE `custom_story_requests` ADD CONSTRAINT `custom_story_requests_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `custom_story_requests` ADD CONSTRAINT `custom_story_requests_generatedStoryId_steamy_stories_id_fk` FOREIGN KEY (`generatedStoryId`) REFERENCES `steamy_stories`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `steamy_stories` ADD CONSTRAINT `steamy_stories_bookId_books_id_fk` FOREIGN KEY (`bookId`) REFERENCES `books`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `story_likes` ADD CONSTRAINT `story_likes_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `story_likes` ADD CONSTRAINT `story_likes_storyId_steamy_stories_id_fk` FOREIGN KEY (`storyId`) REFERENCES `steamy_stories`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `story_play_history` ADD CONSTRAINT `story_play_history_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `story_play_history` ADD CONSTRAINT `story_play_history_storyId_steamy_stories_id_fk` FOREIGN KEY (`storyId`) REFERENCES `steamy_stories`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `vip_members` ADD CONSTRAINT `vip_members_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `vip_members` ADD CONSTRAINT `vip_members_tierId_vip_tiers_id_fk` FOREIGN KEY (`tierId`) REFERENCES `vip_tiers`(`id`) ON DELETE no action ON UPDATE no action;