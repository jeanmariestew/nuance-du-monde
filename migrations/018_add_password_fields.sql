-- Migration 018: Add password fields to professionals table
ALTER TABLE professionals
  ADD COLUMN password_hash VARCHAR(255) NULL AFTER status,
  ADD COLUMN password_set_token VARCHAR(255) NULL,
  ADD COLUMN password_token_expires DATETIME NULL,
  ADD COLUMN password_reset_token VARCHAR(255) NULL,
  ADD COLUMN password_reset_expires DATETIME NULL;

-- Index sur les tokens pour recherche rapide
CREATE INDEX idx_password_set_token ON professionals(password_set_token);
CREATE INDEX idx_password_reset_token ON professionals(password_reset_token);
