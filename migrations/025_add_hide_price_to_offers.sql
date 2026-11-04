-- Migration: Masquer le prix sur la page offre (désactivé par défaut)
-- Date: 2026-11-04

ALTER TABLE offers
  ADD COLUMN hide_price TINYINT(1) NOT NULL DEFAULT 0 AFTER price_currency;
