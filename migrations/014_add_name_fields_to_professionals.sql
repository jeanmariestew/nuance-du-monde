-- Migration: Ajouter les champs nom et prénom du conseiller à la table professionals
-- Date: 2026-03-17

ALTER TABLE professionals 
ADD COLUMN first_name VARCHAR(100) NULL AFTER agency_name,
ADD COLUMN last_name VARCHAR(100) NULL AFTER first_name;
