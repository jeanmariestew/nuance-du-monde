-- Migration: Masquer les extensions sur la page offre (désactivé par défaut)
-- Date: 2026-11-04

ALTER TABLE offers
  ADD COLUMN hide_extensions TINYINT(1) NOT NULL DEFAULT 0 AFTER hide_price;
