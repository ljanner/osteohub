CREATE TABLE `body_region` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `body_system` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `disease_body_region` (
	`diseaseId` integer NOT NULL,
	`bodyRegionId` integer NOT NULL,
	CONSTRAINT `disease_body_region_pk` PRIMARY KEY(`diseaseId`, `bodyRegionId`),
	CONSTRAINT `fk_disease_body_region_diseaseId_disease_id_fk` FOREIGN KEY (`diseaseId`) REFERENCES `disease`(`id`),
	CONSTRAINT `fk_disease_body_region_bodyRegionId_body_region_id_fk` FOREIGN KEY (`bodyRegionId`) REFERENCES `body_region`(`id`)
);
--> statement-breakpoint
CREATE TABLE `disease_body_system` (
	`diseaseId` integer NOT NULL,
	`bodySystemId` integer NOT NULL,
	CONSTRAINT `disease_body_system_pk` PRIMARY KEY(`diseaseId`, `bodySystemId`),
	CONSTRAINT `fk_disease_body_system_diseaseId_disease_id_fk` FOREIGN KEY (`diseaseId`) REFERENCES `disease`(`id`),
	CONSTRAINT `fk_disease_body_system_bodySystemId_body_system_id_fk` FOREIGN KEY (`bodySystemId`) REFERENCES `body_system`(`id`)
);
--> statement-breakpoint
CREATE TABLE `disease_osteopathic_model` (
	`diseaseId` integer NOT NULL,
	`osteopathicModelId` integer NOT NULL,
	CONSTRAINT `disease_osteopathic_model_pk` PRIMARY KEY(`diseaseId`, `osteopathicModelId`),
	CONSTRAINT `fk_disease_osteopathic_model_diseaseId_disease_id_fk` FOREIGN KEY (`diseaseId`) REFERENCES `disease`(`id`),
	CONSTRAINT `fk_disease_osteopathic_model_osteopathicModelId_osteopathic_model_id_fk` FOREIGN KEY (`osteopathicModelId`) REFERENCES `osteopathic_model`(`id`)
);
--> statement-breakpoint
CREATE TABLE `disease_symptom` (
	`diseaseId` integer NOT NULL,
	`symptomId` integer NOT NULL,
	CONSTRAINT `disease_symptom_pk` PRIMARY KEY(`diseaseId`, `symptomId`),
	CONSTRAINT `fk_disease_symptom_diseaseId_disease_id_fk` FOREIGN KEY (`diseaseId`) REFERENCES `disease`(`id`),
	CONSTRAINT `fk_disease_symptom_symptomId_symptom_id_fk` FOREIGN KEY (`symptomId`) REFERENCES `symptom`(`id`)
);
--> statement-breakpoint
CREATE TABLE `disease_vindicate_category` (
	`diseaseId` integer NOT NULL,
	`vindicateCategoryId` integer NOT NULL,
	CONSTRAINT `disease_vindicate_category_pk` PRIMARY KEY(`diseaseId`, `vindicateCategoryId`),
	CONSTRAINT `fk_disease_vindicate_category_diseaseId_disease_id_fk` FOREIGN KEY (`diseaseId`) REFERENCES `disease`(`id`),
	CONSTRAINT `fk_disease_vindicate_category_vindicateCategoryId_vindicate_category_id_fk` FOREIGN KEY (`vindicateCategoryId`) REFERENCES `vindicate_category`(`id`)
);
--> statement-breakpoint
CREATE TABLE `disease` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`name` text NOT NULL,
	`icd` text NOT NULL,
	`description` text NOT NULL,
	`frequency` text NOT NULL,
	`etiology` text NOT NULL,
	`pathogenesis` text NOT NULL,
	`redFlags` text NOT NULL,
	`diagnostics` text NOT NULL,
	`therapy` text NOT NULL,
	`prognosis` text NOT NULL,
	`osteopathicTreatment` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `osteopathic_model` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `symptom` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `vindicate_category` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `disease_body_region_disease_id_idx` ON `disease_body_region` (`diseaseId`);--> statement-breakpoint
CREATE INDEX `disease_body_region_body_region_id_idx` ON `disease_body_region` (`bodyRegionId`);--> statement-breakpoint
CREATE INDEX `disease_body_system_disease_id_idx` ON `disease_body_system` (`diseaseId`);--> statement-breakpoint
CREATE INDEX `disease_body_system_body_system_id_idx` ON `disease_body_system` (`bodySystemId`);--> statement-breakpoint
CREATE INDEX `disease_osteopathic_model_disease_id_idx` ON `disease_osteopathic_model` (`diseaseId`);--> statement-breakpoint
CREATE INDEX `disease_osteopathic_model_osteopathic_model_id_idx` ON `disease_osteopathic_model` (`osteopathicModelId`);--> statement-breakpoint
CREATE INDEX `disease_symptom_disease_id_idx` ON `disease_symptom` (`diseaseId`);--> statement-breakpoint
CREATE INDEX `disease_symptom_symptom_id_idx` ON `disease_symptom` (`symptomId`);--> statement-breakpoint
CREATE INDEX `disease_vindicate_category_disease_id_idx` ON `disease_vindicate_category` (`diseaseId`);--> statement-breakpoint
CREATE INDEX `disease_vindicate_category_vindicate_category_id_idx` ON `disease_vindicate_category` (`vindicateCategoryId`);