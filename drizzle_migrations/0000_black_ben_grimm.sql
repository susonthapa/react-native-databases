CREATE TABLE `sub_tasks` (
	`id` text PRIMARY KEY NOT NULL,
	`text` text NOT NULL,
	`completed` integer DEFAULT false NOT NULL,
	`todo_id` text NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`todo_id`) REFERENCES `todos`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `todos` (
	`id` text PRIMARY KEY NOT NULL,
	`text` text NOT NULL,
	`completed` integer DEFAULT false NOT NULL,
	`created_at` integer NOT NULL
);
