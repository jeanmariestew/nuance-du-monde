-- Migration: Renommer la colonne "notes" (existante, jamais utilisée par le code)
-- en "price_note" : texte libre affiché à droite du prix sur la fiche offre
-- (ex: COMPLET, PRIX SUR DEMANDE, TARIF PROMOTIONNEL...).
-- Le champ Prix reste optionnel (déjà nullable) pour permettre d'annoncer une date
-- sans prix connu.
-- Date: 2026-08-31

ALTER TABLE offer_dates
  CHANGE COLUMN notes price_note VARCHAR(255) NULL DEFAULT NULL;
