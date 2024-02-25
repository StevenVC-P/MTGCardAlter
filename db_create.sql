USE arcane_proxies;

-- Drop tables in the correct order to avoid foreign key constraints issues
DROP TABLE IF EXISTS CardPrices;
DROP TABLE IF EXISTS Legalities;
DROP TABLE IF EXISTS Games;
DROP TABLE IF EXISTS RelatedCards;
DROP TABLE IF EXISTS CardFaces;
DROP TABLE IF EXISTS Keywords;
DROP TABLE IF EXISTS CardColorIdentities;
DROP TABLE IF EXISTS CardColors;
DROP TABLE IF EXISTS GeneratedImages;
DROP TABLE IF EXISTS UserCards;
DROP TABLE IF EXISTS Cards;

-- Create the Cards table
CREATE TABLE Cards (
    card_id VARCHAR(36) PRIMARY KEY,
    oracle_id VARCHAR(36) NULL,
    mtgo_id INT NULL,
    tcgplayer_id INT NULL,
    cardmarket_id INT NULL,
    name TEXT NULL,
    mana_cost TEXT NULL,
    type_line TEXT NULL,
    oracle_text TEXT NULL,
    flavor_text TEXT NULL,
    power VARCHAR(10) NULL,
    toughness VARCHAR(10) NULL,
    watermark VARCHAR(50) NULL,
    artist TEXT NULL,
    lang VARCHAR(10) NULL,
	loyalty VARCHAR(10) NULL,
    released_at DATE NULL,
    uri TEXT NULL,
    scryfall_uri TEXT NULL,
    layout TEXT,
    cmc FLOAT NULL,
    rarity TEXT,
    border_color TEXT NULL,
    set_id VARCHAR(36) NULL,
    set_code TEXT NULL,
    set_name TEXT NULL,
    set_type TEXT NULL,
    oversized BOOLEAN NULL,
    promo BOOLEAN NULL,
    reprint BOOLEAN NULL,
    variation BOOLEAN NULL,
    digital BOOLEAN NULL,
    booster BOOLEAN NULL,
    story_spotlight BOOLEAN NULL,
    edhrec_rank INT NULL,
    penny_rank INT NULL
);

-- Create the CardColors table
CREATE TABLE CardColors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    card_id VARCHAR(36),
    color CHAR(1) NULL,
    FOREIGN KEY (card_id) REFERENCES Cards(card_id)
);

-- Create the CardColorIdentities table
CREATE TABLE CardColorIdentities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    card_id VARCHAR(36),
    color_identity CHAR(1) NULL,
    FOREIGN KEY (card_id) REFERENCES Cards(card_id)
);

-- Create the Keywords table
CREATE TABLE Keywords (
    id INT AUTO_INCREMENT PRIMARY KEY,
    card_id VARCHAR(36),
    keyword TEXT NULL,
    FOREIGN KEY (card_id) REFERENCES Cards(card_id)
);

-- Create the CardFaces table
CREATE TABLE CardFaces (
    id INT AUTO_INCREMENT PRIMARY KEY,
    card_id VARCHAR(36),
    name TEXT NULL,
    mana_cost TEXT NULL,
    type_line TEXT NULL,
    oracle_text TEXT NULL,
	power VARCHAR(10) NULL,
    toughness VARCHAR(10) NULL,
	loyalty VARCHAR(10) NULL,
    defense VARCHAR(10) NULL,
    watermark VARCHAR(50) NULL,
    artist TEXT NULL,
    artist_id VARCHAR(36) NULL,
    FOREIGN KEY (card_id) REFERENCES Cards(card_id)
);

-- Create the RelatedCards table
CREATE TABLE RelatedCards (
    id INT AUTO_INCREMENT PRIMARY KEY,
    card_id VARCHAR(36) NOT NULL,
    parent_card_name TEXT NULL,  -- New column
    related_card_id VARCHAR(36) NULL,
    component TEXT NULL,
    name TEXT NULL,  -- This now refers to the related card
    type_line TEXT NULL,
    FOREIGN KEY (card_id) REFERENCES Cards(card_id),
    UNIQUE (parent_card_name(255), related_card_id)
);

-- Create the Legalities table
CREATE TABLE Legalities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    card_id VARCHAR(36),
    format_name TEXT,
    legality TEXT,
    FOREIGN KEY (card_id) REFERENCES Cards(card_id)
);

-- Create the Games table
CREATE TABLE Games (
    id INT AUTO_INCREMENT PRIMARY KEY,
    card_id VARCHAR(36),
    game TEXT,
    FOREIGN KEY (card_id) REFERENCES Cards(card_id)
);

CREATE TABLE CardPrices (
    id INT AUTO_INCREMENT PRIMARY KEY,
    card_id VARCHAR(36),
    usd FLOAT NULL,
    usd_foil FLOAT NULL,
    usd_etched FLOAT NULL,
    eur FLOAT NULL,
    eur_foil FLOAT NULL,
    tix FLOAT NULL,
    FOREIGN KEY (card_id) REFERENCES Cards(card_id)
);

DROP TABLE IF EXISTS token_transactions;
DROP TABLE IF EXISTS user_patreon_link;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS patreon_accounts;

-- Create the Patreon table
CREATE TABLE patreon_accounts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    patreon_id VARCHAR(50) NOT NULL UNIQUE,
    total_pledged INT DEFAULT 0
);

-- Create the User table
CREATE TABLE `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(50) UNIQUE NOT NULL,
  `email` VARCHAR(50) UNIQUE NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `google_id` VARCHAR(50),
  `facebook_id` VARCHAR(50),
  `patreon_account_id` INT,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `tokens` INT DEFAULT 10,
  `refresh_token` VARCHAR(255),
  `isEmailVerified` BOOLEAN DEFAULT FALSE,
  `emailVerificationToken` VARCHAR(255),
  `emailVerificationExpires` DATETIME,
  FOREIGN KEY (`patreon_account_id`) REFERENCES `patreon_accounts`(`id`)
);

CREATE TABLE user_patreon_link (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL UNIQUE,
  patreon_account_id INT NOT NULL UNIQUE,
  linked_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (patreon_account_id) REFERENCES patreon_accounts(id)
);

CREATE TABLE UserCards (
    user_card_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    card_id VARCHAR(36) NOT NULL,
    face_type ENUM('front', 'back') DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (card_id) REFERENCES Cards(card_id)
);

-- Create the GeneratedImages table
CREATE TABLE GeneratedImages (
    image_id INT AUTO_INCREMENT PRIMARY KEY,
    user_card_id INT NOT NULL, -- This replaces the user_id and card_id
    image_url MEDIUMTEXT NOT NULL,
    cfg_scale FLOAT NOT NULL,
    clip_guidance_preset VARCHAR(50) NOT NULL,
    sampler VARCHAR(50) NOT NULL,
    steps INT NOT NULL,
    style_preset VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY (user_card_id) REFERENCES UserCards(user_card_id)
);

-- Create the TokenTransaction table
CREATE TABLE token_transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    amount INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    source VARCHAR(50) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);