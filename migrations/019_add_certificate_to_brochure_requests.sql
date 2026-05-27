-- Migration: Ajouter le numéro de certificat à la table brochure_requests
-- Date: 2026-05-27

ALTER TABLE brochure_requests ADD COLUMN certificate_number VARCHAR(100) NULL AFTER agency_name;
