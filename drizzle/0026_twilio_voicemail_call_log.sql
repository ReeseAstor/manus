CREATE TABLE `voicemail_recordings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`callSid` varchar(64) NOT NULL,
	`recordingSid` varchar(64) NOT NULL,
	`recordingUrl` text,
	`durationSeconds` int,
	`fromPhoneNumber` varchar(20),
	`toPhoneNumber` varchar(20),
	`status` varchar(32),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `voicemail_recordings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `voicemail_recordings_callSid_idx` ON `voicemail_recordings` (`callSid`);--> statement-breakpoint
CREATE INDEX `voicemail_recordings_recordingSid_idx` ON `voicemail_recordings` (`recordingSid`);--> statement-breakpoint
CREATE TABLE `twilio_call_log` (
	`id` int AUTO_INCREMENT NOT NULL,
	`callSid` varchar(64) NOT NULL,
	`fromPhoneNumber` varchar(20),
	`toPhoneNumber` varchar(20),
	`callStatus` varchar(32),
	`direction` varchar(32),
	`durationSeconds` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `twilio_call_log_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `twilio_call_log_callSid_idx` ON `twilio_call_log` (`callSid`);
