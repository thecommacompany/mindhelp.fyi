CREATE TABLE `hospitals` (
	`id` text PRIMARY KEY NOT NULL,
	`profile_id` text,
	`name` text NOT NULL,
	`type` text NOT NULL,
	`facilities` text,
	`emergency_services` integer DEFAULT false,
	`accreditation` text,
	`website` text,
	`opening_hours` text,
	`address` text NOT NULL,
	`city` text NOT NULL,
	`state` text NOT NULL,
	`country` text NOT NULL,
	`latitude` real,
	`longitude` real,
	`is_claimable` integer DEFAULT true,
	`claimed_by` text,
	`verification_status` text DEFAULT 'pending',
	FOREIGN KEY (`profile_id`) REFERENCES `profiles`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`claimed_by`) REFERENCES `profiles`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `organizations` (
	`id` text PRIMARY KEY NOT NULL,
	`profile_id` text,
	`name` text NOT NULL,
	`type` text NOT NULL,
	`registration_number` text,
	`website` text,
	`focus_areas` text,
	`address` text NOT NULL,
	`city` text NOT NULL,
	`state` text NOT NULL,
	`country` text NOT NULL,
	`latitude` real,
	`longitude` real,
	`is_claimable` integer DEFAULT true,
	`claimed_by` text,
	`verification_status` text DEFAULT 'pending',
	FOREIGN KEY (`profile_id`) REFERENCES `profiles`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`claimed_by`) REFERENCES `profiles`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `professional_affiliations` (
	`id` text PRIMARY KEY NOT NULL,
	`professional_id` text NOT NULL,
	`hospital_id` text NOT NULL,
	`start_date` integer,
	`end_date` integer,
	`is_active` integer DEFAULT true,
	FOREIGN KEY (`professional_id`) REFERENCES `professionals`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`hospital_id`) REFERENCES `hospitals`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `professionals` (
	`id` text PRIMARY KEY NOT NULL,
	`profile_id` text NOT NULL,
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
CREATE TABLE `profiles` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`name` text NOT NULL,
	`role` text DEFAULT 'user' NOT NULL,
	`photo_url` text,
	`phone` text,
	`address` text,
	`city` text,
	`state` text,
	`country` text,
	`bio` text,
	`is_verified` integer DEFAULT false,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `profiles_email_unique` ON `profiles` (`email`);--> statement-breakpoint
CREATE TABLE `reviews` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`entity_type` text NOT NULL,
	`entity_id` text NOT NULL,
	`rating` integer NOT NULL,
	`review` text,
	`visit_date` integer,
	`is_anonymous` integer DEFAULT false,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `profiles`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `support_groups` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`organization_id` text,
	`description` text NOT NULL,
	`meeting_schedule` text,
	`address` text,
	`city` text,
	`state` text,
	`country` text,
	`latitude` real,
	`longitude` real,
	`online_link` text,
	`contact_person` text,
	`contact_email` text,
	`focus_area` text NOT NULL,
	`is_active` integer DEFAULT true,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`organization_id`) REFERENCES `organizations`(`id`) ON UPDATE no action ON DELETE no action
);
