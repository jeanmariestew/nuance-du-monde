-- Migration: Ajouter opc_verified à la table professionals
-- Date: 2026-04-23

ALTER TABLE professionals
  ADD COLUMN opc_verified BOOLEAN DEFAULT FALSE AFTER status,
  ADD COLUMN opc_checked_at TIMESTAMP NULL AFTER opc_verified;
