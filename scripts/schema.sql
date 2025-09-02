-- Schema for Nuance du Monde
-- Uses InnoDB, utf8mb4, idempotent creation

SET NAMES utf8mb4;

-- Referential tables
CREATE TABLE IF NOT EXISTS travel_types (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(191) NOT NULL,
  slug VARCHAR(191) NOT NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_travel_types_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS travel_themes (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(191) NOT NULL,
  slug VARCHAR(191) NOT NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_travel_themes_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS destinations (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(191) NOT NULL,
  slug VARCHAR(191) NOT NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_destinations_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Central table: offers
CREATE TABLE IF NOT EXISTS offers (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(191) NOT NULL,
  subtitle VARCHAR(255) NULL,
  short_description VARCHAR(500) NOT NULL,
  description MEDIUMTEXT NULL,
  meta_title VARCHAR(255) NULL,
  meta_description VARCHAR(500) NULL,
  image_main VARCHAR(1024) NULL,
  image_banner VARCHAR(1024) NULL,
  duration INT UNSIGNED NULL,
  price DECIMAL(10,2) NULL,
  price_currency VARCHAR(8) NULL DEFAULT 'EUR',
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_offers_slug (slug),
  KEY ix_offers_is_active (is_active),
  KEY ix_offers_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Junction tables
CREATE TABLE IF NOT EXISTS offer_travel_types (
  offer_id INT UNSIGNED NOT NULL,
  travel_type_id INT UNSIGNED NOT NULL,
  PRIMARY KEY (offer_id, travel_type_id),
  CONSTRAINT fk_ott_offer FOREIGN KEY (offer_id) REFERENCES offers(id) ON DELETE CASCADE,
  CONSTRAINT fk_ott_type FOREIGN KEY (travel_type_id) REFERENCES travel_types(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS offer_travel_themes (
  offer_id INT UNSIGNED NOT NULL,
  travel_theme_id INT UNSIGNED NOT NULL,
  PRIMARY KEY (offer_id, travel_theme_id),
  CONSTRAINT fk_otth_offer FOREIGN KEY (offer_id) REFERENCES offers(id) ON DELETE CASCADE,
  CONSTRAINT fk_otth_theme FOREIGN KEY (travel_theme_id) REFERENCES travel_themes(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS offer_destinations (
  offer_id INT UNSIGNED NOT NULL,
  destination_id INT UNSIGNED NOT NULL,
  PRIMARY KEY (offer_id, destination_id),
  CONSTRAINT fk_od_offer FOREIGN KEY (offer_id) REFERENCES offers(id) ON DELETE CASCADE,
  CONSTRAINT fk_od_dest FOREIGN KEY (destination_id) REFERENCES destinations(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Dates per offer
CREATE TABLE IF NOT EXISTS offer_dates (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  offer_id INT UNSIGNED NOT NULL,
  departure_date DATE NOT NULL,
  note VARCHAR(255) NULL,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_dates_offer FOREIGN KEY (offer_id) REFERENCES offers(id) ON DELETE CASCADE,
  KEY ix_dates_offer (offer_id),
  KEY ix_dates_date (departure_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Settings (key/value)
CREATE TABLE IF NOT EXISTS settings (
  `key` VARCHAR(64) NOT NULL,
  `value` TEXT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Users (minimal)
CREATE TABLE IF NOT EXISTS users (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(191) NOT NULL,
  password_hash CHAR(32) NOT NULL,
  role VARCHAR(32) NOT NULL DEFAULT 'admin',
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Partners table
CREATE TABLE IF NOT EXISTS partners (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(191) NOT NULL,
  agency VARCHAR(191) NOT NULL,
  image_url VARCHAR(1024) NULL,
  sort_order INT UNSIGNED NOT NULL DEFAULT 0,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY ix_partners_sort_order (sort_order),
  KEY ix_partners_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Testimonials table
CREATE TABLE IF NOT EXISTS testimonials (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(191) NOT NULL,
  content TEXT NOT NULL,
  image_url VARCHAR(1024) NULL,
  is_featured TINYINT(1) NOT NULL DEFAULT 0,
  is_published TINYINT(1) NOT NULL DEFAULT 1,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY ix_testimonials_featured (is_featured),
  KEY ix_testimonials_published (is_published),
  KEY ix_testimonials_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
