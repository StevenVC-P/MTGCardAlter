-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema arcane_proxies
-- -----------------------------------------------------
DROP SCHEMA IF EXISTS `arcane_proxies` ;

-- -----------------------------------------------------
-- Schema arcane_proxies
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `arcane_proxies` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ;
USE `arcane_proxies` ;

-- -----------------------------------------------------
-- Table `cards`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `cards` ;

CREATE TABLE IF NOT EXISTS `cards` (
  `card_id` VARCHAR(36) NOT NULL,
  `oracle_id` VARCHAR(36) NULL DEFAULT NULL,
  `mtgo_id` INT NULL DEFAULT NULL,
  `tcgplayer_id` INT NULL DEFAULT NULL,
  `cardmarket_id` INT NULL DEFAULT NULL,
  `name` TEXT NULL DEFAULT NULL,
  `mana_cost` TEXT NULL DEFAULT NULL,
  `type_line` TEXT NULL DEFAULT NULL,
  `oracle_text` TEXT NULL DEFAULT NULL,
  `flavor_text` TEXT NULL DEFAULT NULL,
  `power` VARCHAR(10) NULL DEFAULT NULL,
  `toughness` VARCHAR(10) NULL DEFAULT NULL,
  `watermark` VARCHAR(50) NULL DEFAULT NULL,
  `artist` TEXT NULL DEFAULT NULL,
  `lang` VARCHAR(10) NULL DEFAULT NULL,
  `loyalty` VARCHAR(10) NULL DEFAULT NULL,
  `released_at` DATE NULL DEFAULT NULL,
  `uri` TEXT NULL DEFAULT NULL,
  `scryfall_uri` TEXT NULL DEFAULT NULL,
  `layout` TEXT NULL DEFAULT NULL,
  `cmc` FLOAT NULL DEFAULT NULL,
  `rarity` TEXT NULL DEFAULT NULL,
  `border_color` TEXT NULL DEFAULT NULL,
  `set_id` VARCHAR(36) NULL DEFAULT NULL,
  `set_code` TEXT NULL DEFAULT NULL,
  `set_name` TEXT NULL DEFAULT NULL,
  `set_type` TEXT NULL DEFAULT NULL,
  `oversized` TINYINT(1) NULL DEFAULT NULL,
  `promo` TINYINT(1) NULL DEFAULT NULL,
  `reprint` TINYINT(1) NULL DEFAULT NULL,
  `variation` TINYINT(1) NULL DEFAULT NULL,
  `digital` TINYINT(1) NULL DEFAULT NULL,
  `booster` TINYINT(1) NULL DEFAULT NULL,
  `story_spotlight` TINYINT(1) NULL DEFAULT NULL,
  `edhrec_rank` INT NULL DEFAULT NULL,
  `penny_rank` INT NULL DEFAULT NULL,
  PRIMARY KEY (`card_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `cardcoloridentities`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `cardcoloridentities` ;

CREATE TABLE IF NOT EXISTS `cardcoloridentities` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `card_id` VARCHAR(36) NULL DEFAULT NULL,
  `color_identity` CHAR(1) NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `cardcoloridentities_ibfk_1`
    FOREIGN KEY (`card_id`)
    REFERENCES `cards` (`card_id`))
ENGINE = InnoDB
AUTO_INCREMENT = 485609
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

CREATE INDEX `card_id` ON `cardcoloridentities` (`card_id` ASC) VISIBLE;


-- -----------------------------------------------------
-- Table `cardcolors`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `cardcolors` ;

CREATE TABLE IF NOT EXISTS `cardcolors` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `card_id` VARCHAR(36) NULL DEFAULT NULL,
  `color` CHAR(1) NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `cardcolors_ibfk_1`
    FOREIGN KEY (`card_id`)
    REFERENCES `cards` (`card_id`))
ENGINE = InnoDB
AUTO_INCREMENT = 412033
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

CREATE INDEX `card_id` ON `cardcolors` (`card_id` ASC) VISIBLE;


-- -----------------------------------------------------
-- Table `cardfaces`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `cardfaces` ;

CREATE TABLE IF NOT EXISTS `cardfaces` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `card_id` VARCHAR(36) NULL DEFAULT NULL,
  `name` TEXT NULL DEFAULT NULL,
  `mana_cost` TEXT NULL DEFAULT NULL,
  `type_line` TEXT NULL DEFAULT NULL,
  `oracle_text` TEXT NULL DEFAULT NULL,
  `power` VARCHAR(10) NULL DEFAULT NULL,
  `toughness` VARCHAR(10) NULL DEFAULT NULL,
  `loyalty` VARCHAR(10) NULL DEFAULT NULL,
  `defense` VARCHAR(10) NULL DEFAULT NULL,
  `watermark` VARCHAR(50) NULL DEFAULT NULL,
  `artist` TEXT NULL DEFAULT NULL,
  `artist_id` VARCHAR(36) NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `cardfaces_ibfk_1`
    FOREIGN KEY (`card_id`)
    REFERENCES `cards` (`card_id`))
ENGINE = InnoDB
AUTO_INCREMENT = 13349
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

CREATE INDEX `card_id` ON `cardfaces` (`card_id` ASC) VISIBLE;


-- -----------------------------------------------------
-- Table `cardprices`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `cardprices` ;

CREATE TABLE IF NOT EXISTS `cardprices` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `card_id` VARCHAR(36) NULL DEFAULT NULL,
  `usd` FLOAT NULL DEFAULT NULL,
  `usd_foil` FLOAT NULL DEFAULT NULL,
  `usd_etched` FLOAT NULL DEFAULT NULL,
  `eur` FLOAT NULL DEFAULT NULL,
  `eur_foil` FLOAT NULL DEFAULT NULL,
  `tix` FLOAT NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `cardprices_ibfk_1`
    FOREIGN KEY (`card_id`)
    REFERENCES `cards` (`card_id`))
ENGINE = InnoDB
AUTO_INCREMENT = 444519
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

CREATE INDEX `card_id` ON `cardprices` (`card_id` ASC) VISIBLE;


-- -----------------------------------------------------
-- Table `games`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `games` ;

CREATE TABLE IF NOT EXISTS `games` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `card_id` VARCHAR(36) NULL DEFAULT NULL,
  `game` TEXT NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `games_ibfk_1`
    FOREIGN KEY (`card_id`)
    REFERENCES `cards` (`card_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

CREATE INDEX `card_id` ON `games` (`card_id` ASC) VISIBLE;


-- -----------------------------------------------------
-- Table `generatedimages`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `generatedimages` ;

CREATE TABLE IF NOT EXISTS `generatedimages` (
  `image_id` INT NOT NULL AUTO_INCREMENT,
  `image_url` MEDIUMTEXT NOT NULL,
  `cfg_scale` FLOAT NOT NULL,
  `clip_guidance_preset` VARCHAR(50) NOT NULL,
  `sampler` VARCHAR(50) NOT NULL,
  `steps` INT NOT NULL,
  `style_preset` VARCHAR(50) NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`image_id`))
ENGINE = InnoDB
AUTO_INCREMENT = 11
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `keywords`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `keywords` ;

CREATE TABLE IF NOT EXISTS `keywords` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `card_id` VARCHAR(36) NULL DEFAULT NULL,
  `keyword` TEXT NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `keywords_ibfk_1`
    FOREIGN KEY (`card_id`)
    REFERENCES `cards` (`card_id`))
ENGINE = InnoDB
AUTO_INCREMENT = 240669
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

CREATE INDEX `card_id` ON `keywords` (`card_id` ASC) VISIBLE;


-- -----------------------------------------------------
-- Table `legalities`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `legalities` ;

CREATE TABLE IF NOT EXISTS `legalities` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `card_id` VARCHAR(36) NULL DEFAULT NULL,
  `format_name` TEXT NULL DEFAULT NULL,
  `legality` TEXT NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `legalities_ibfk_1`
    FOREIGN KEY (`card_id`)
    REFERENCES `cards` (`card_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

CREATE INDEX `card_id` ON `legalities` (`card_id` ASC) VISIBLE;


-- -----------------------------------------------------
-- Table `patreon_accounts`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `patreon_accounts` ;

CREATE TABLE IF NOT EXISTS `patreon_accounts` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `patreon_id` VARCHAR(50) NOT NULL,
  `total_pledged` INT NULL DEFAULT '0',
  `deferred_tokens` INT NULL DEFAULT '0',
  PRIMARY KEY (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

CREATE UNIQUE INDEX `patreon_id` ON `patreon_accounts` (`patreon_id` ASC) VISIBLE;


-- -----------------------------------------------------
-- Table `relatedcards`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `relatedcards` ;

CREATE TABLE IF NOT EXISTS `relatedcards` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `card_id` VARCHAR(36) NOT NULL,
  `parent_card_name` TEXT NULL DEFAULT NULL,
  `related_card_id` VARCHAR(36) NULL DEFAULT NULL,
  `component` TEXT NULL DEFAULT NULL,
  `name` TEXT NULL DEFAULT NULL,
  `type_line` TEXT NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `relatedcards_ibfk_1`
    FOREIGN KEY (`card_id`)
    REFERENCES `cards` (`card_id`))
ENGINE = InnoDB
AUTO_INCREMENT = 86059
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

CREATE UNIQUE INDEX `parent_card_name` ON `relatedcards` (`parent_card_name`(255) ASC, `related_card_id` ASC) VISIBLE;

CREATE INDEX `card_id` ON `relatedcards` (`card_id` ASC) VISIBLE;


-- -----------------------------------------------------
-- Table `users`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `users` ;

CREATE TABLE IF NOT EXISTS `users` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(50) NOT NULL,
  `email` VARCHAR(50) NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `google_id` VARCHAR(50) NULL DEFAULT NULL,
  `facebook_id` VARCHAR(50) NULL DEFAULT NULL,
  `patreon_account_id` INT NULL DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `tokens` INT NULL DEFAULT '10',
  `refresh_token` VARCHAR(255) NULL DEFAULT NULL,
  `isEmailVerified` TINYINT(1) NULL DEFAULT '0',
  `emailVerificationToken` VARCHAR(255) NULL DEFAULT NULL,
  `emailVerificationExpires` DATETIME NULL DEFAULT NULL,
  `resetPasswordToken` VARCHAR(255) NULL DEFAULT NULL,
  `resetPasswordExpires` DATETIME NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `users_ibfk_1`
    FOREIGN KEY (`patreon_account_id`)
    REFERENCES `patreon_accounts` (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 2
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

CREATE UNIQUE INDEX `username` ON `users` (`username` ASC) VISIBLE;

CREATE UNIQUE INDEX `email` ON `users` (`email` ASC) VISIBLE;

CREATE INDEX `patreon_account_id` ON `users` (`patreon_account_id` ASC) VISIBLE;


-- -----------------------------------------------------
-- Table `token_transactions`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `token_transactions` ;

CREATE TABLE IF NOT EXISTS `token_transactions` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `amount` INT NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `source` VARCHAR(50) NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `token_transactions_ibfk_1`
    FOREIGN KEY (`user_id`)
    REFERENCES `users` (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

CREATE INDEX `user_id` ON `token_transactions` (`user_id` ASC) VISIBLE;


-- -----------------------------------------------------
-- Table `user_patreon_link`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `user_patreon_link` ;

CREATE TABLE IF NOT EXISTS `user_patreon_link` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `patreon_account_id` INT NOT NULL,
  `linked_at` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `user_patreon_link_ibfk_1`
    FOREIGN KEY (`user_id`)
    REFERENCES `users` (`id`),
  CONSTRAINT `user_patreon_link_ibfk_2`
    FOREIGN KEY (`patreon_account_id`)
    REFERENCES `patreon_accounts` (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

CREATE UNIQUE INDEX `user_id` ON `user_patreon_link` (`user_id` ASC) VISIBLE;

CREATE UNIQUE INDEX `patreon_account_id` ON `user_patreon_link` (`patreon_account_id` ASC) VISIBLE;


-- -----------------------------------------------------
-- Table `usercards`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `usercards` ;

CREATE TABLE IF NOT EXISTS `usercards` (
  `user_card_id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `card_id` VARCHAR(36) NOT NULL,
  `face_type` ENUM('front', 'back') NULL DEFAULT NULL,
  `rec_stat` TINYINT(1) NOT NULL DEFAULT '1',
  `full_frame` TINYINT(1) NOT NULL DEFAULT '0',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_card_id`),
  CONSTRAINT `usercards_ibfk_1`
    FOREIGN KEY (`user_id`)
    REFERENCES `users` (`id`),
  CONSTRAINT `usercards_ibfk_2`
    FOREIGN KEY (`card_id`)
    REFERENCES `cards` (`card_id`))
ENGINE = InnoDB
AUTO_INCREMENT = 11
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

CREATE INDEX `user_id` ON `usercards` (`user_id` ASC) VISIBLE;

CREATE INDEX `card_id` ON `usercards` (`card_id` ASC) VISIBLE;


-- -----------------------------------------------------
-- Table `usercardimages`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `usercardimages` ;

CREATE TABLE IF NOT EXISTS `usercardimages` (
  `user_card_id` INT NOT NULL,
  `image_id` INT NOT NULL,
  PRIMARY KEY (`user_card_id`, `image_id`),
  CONSTRAINT `usercardimages_ibfk_1`
    FOREIGN KEY (`user_card_id`)
    REFERENCES `usercards` (`user_card_id`),
  CONSTRAINT `usercardimages_ibfk_2`
    FOREIGN KEY (`image_id`)
    REFERENCES `generatedimages` (`image_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

CREATE INDEX `image_id` ON `usercardimages` (`image_id` ASC) VISIBLE;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
-