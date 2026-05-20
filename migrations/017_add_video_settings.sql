-- Migration: Ajouter les clés de vidéo dans la table settings
-- Date: 2026-04-23

INSERT IGNORE INTO settings (setting_key, setting_value)
VALUES
  ('pro_video_url', ''),
  ('particulier_video_url', '');
