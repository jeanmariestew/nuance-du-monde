-- Popup de présentation (ex. VRDF) sur la page d'accueil
-- Table settings : colonnes name / value_text
INSERT IGNORE INTO settings (name, value_text)
VALUES
  ('home_popup_enabled', '0'),
  ('home_popup_media_type', 'video'),
  ('home_popup_media_url', ''),
  ('home_popup_title', '');
