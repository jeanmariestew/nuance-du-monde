-- Migration: Ajouter le flag is_pro à la table offers
-- Date: 2026-05-28

ALTER TABLE offers ADD COLUMN is_pro BOOLEAN DEFAULT FALSE AFTER is_active;
CREATE INDEX idx_offers_is_pro ON offers(is_pro);
