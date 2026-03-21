ALTER TABLE `blog_posts` ADD `scheduledPublishAt` timestamp;--> statement-breakpoint
ALTER TABLE `blog_posts` ADD `seoKeywords` text;--> statement-breakpoint
ALTER TABLE `blog_posts` ADD `metaDescription` varchar(320);