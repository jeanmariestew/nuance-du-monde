-- Migration: Créer la table des demandes de brochures
-- Date: 2026-04-23

CREATE TABLE IF NOT EXISTS brochure_requests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name  VARCHAR(100) NOT NULL,
  email      VARCHAR(255) NOT NULL,
  agency_name VARCHAR(255),
  phone      VARCHAR(50),
  address    TEXT,
  quantity   INT DEFAULT 1,
  status     ENUM('pending','sent','cancelled') DEFAULT 'pending',
  notes      TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  sent_at    TIMESTAMP NULL,
  INDEX idx_email (email),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
