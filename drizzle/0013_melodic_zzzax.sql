CREATE TABLE `audio_usage` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`minutesUsed` int NOT NULL,
	`characterCount` int NOT NULL,
	`voiceId` varchar(100) NOT NULL,
	`storyId` varchar(255),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `audio_usage_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `character_voice_assignments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`characterName` varchar(100) NOT NULL,
	`bookTitle` varchar(255),
	`voicePresetId` int,
	`elevenLabsVoiceId` varchar(100) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `character_voice_assignments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `generated_audio` (
	`id` varchar(36) NOT NULL,
	`userId` int NOT NULL,
	`storyId` varchar(255),
	`title` varchar(255) NOT NULL,
	`audioUrl` text NOT NULL,
	`durationSeconds` int NOT NULL,
	`voiceId` varchar(100) NOT NULL,
	`characterCount` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `generated_audio_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `voice_presets` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`name` varchar(100) NOT NULL,
	`elevenLabsVoiceId` varchar(100) NOT NULL,
	`description` text,
	`style` varchar(50),
	`gender` enum('male','female','neutral') NOT NULL,
	`isPremium` boolean NOT NULL DEFAULT false,
	`stability` int DEFAULT 50,
	`similarityBoost` int DEFAULT 75,
	`styleIntensity` int DEFAULT 50,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `voice_presets_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `audio_usage` ADD CONSTRAINT `audio_usage_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `character_voice_assignments` ADD CONSTRAINT `character_voice_assignments_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `character_voice_assignments` ADD CONSTRAINT `character_voice_assignments_voicePresetId_voice_presets_id_fk` FOREIGN KEY (`voicePresetId`) REFERENCES `voice_presets`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `generated_audio` ADD CONSTRAINT `generated_audio_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `voice_presets` ADD CONSTRAINT `voice_presets_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;