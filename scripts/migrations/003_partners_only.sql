-- Migration: Add partners table only
-- Run date: 2025-01-02

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

-- Insert initial partners data
INSERT INTO partners (name, agency, image_url, sort_order, is_active) VALUES
('Caroline Racine', 'Voyage Vasco Beauport', '/images/caroline-racine.jpg', 1, 1),
('Cathérine', 'Voyages Eclipse', NULL, 2, 1),
('Lyne', 'Voyages Prestige', NULL, 3, 1),
('Sonia Gioffre', 'Voyages Reid', NULL, 4, 1);
