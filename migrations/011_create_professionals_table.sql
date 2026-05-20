-- Migration: Create professionals table for B2B authentication
-- Date: 2026-03-10

CREATE TABLE IF NOT EXISTS professionals (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  agency_name VARCHAR(255) NOT NULL,
  certificate_number VARCHAR(100) NOT NULL,
  status ENUM('pending', 'validated', 'rejected') DEFAULT 'pending',
  phone VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_status (status),
  INDEX idx_certificate (certificate_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
