-- Masquer le prix individuellement sur chaque date (surtout VRDF),
-- en complément du texte libre price_note (ex. PRIX SUR DEMANDE).
ALTER TABLE offer_dates
  ADD COLUMN hide_price TINYINT(1) NOT NULL DEFAULT 0 AFTER price_note;
