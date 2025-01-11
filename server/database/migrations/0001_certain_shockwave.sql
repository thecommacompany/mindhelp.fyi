PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_professionals` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`profile_id` text,
	`specialization` text NOT NULL,
	`qualifications` text NOT NULL,
	`license_number` text,
	`experience` integer,
	`consultation_fees` real,
	`available_for_online` integer DEFAULT false,
	`languages` text NOT NULL,
	`address` text,
	`city` text,
	`state` text,
	`country` text,
	`latitude` real,
	`longitude` real,
	`is_claimable` integer DEFAULT true,
	`claimed_by` text,
	`verification_status` text DEFAULT 'pending',
	FOREIGN KEY (`profile_id`) REFERENCES `profiles`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`claimed_by`) REFERENCES `profiles`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_professionals`("id", "name", "profile_id", "specialization", "qualifications", "license_number", "experience", "consultation_fees", "available_for_online", "languages", "address", "city", "state", "country", "latitude", "longitude", "is_claimable", "claimed_by", "verification_status") SELECT "id", "name", "profile_id", "specialization", "qualifications", "license_number", "experience", "consultation_fees", "available_for_online", "languages", "address", "city", "state", "country", "latitude", "longitude", "is_claimable", "claimed_by", "verification_status" FROM `professionals`;--> statement-breakpoint
DROP TABLE `professionals`;--> statement-breakpoint
ALTER TABLE `__new_professionals` RENAME TO `professionals`;--> statement-breakpoint
PRAGMA foreign_keys=ON;