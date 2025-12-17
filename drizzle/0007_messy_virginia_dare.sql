ALTER TABLE `books` ADD `retailPrice` int DEFAULT 499;--> statement-breakpoint
ALTER TABLE `books` ADD `directPrice` int DEFAULT 399;--> statement-breakpoint
ALTER TABLE `books` ADD `memberPrice` int DEFAULT 299;--> statement-breakpoint
ALTER TABLE `books` ADD `directSaleUrl` text;