-- Ajout de la colonne continent à la table destinations
ALTER TABLE destinations ADD COLUMN continent VARCHAR(100) NULL AFTER slug;

-- Ajout d'un index sur la colonne continent pour optimiser les requêtes
CREATE INDEX idx_destinations_continent ON destinations(continent);

-- Mise à jour de quelques destinations existantes avec des continents par défaut (optionnel)
-- Ces lignes peuvent être modifiées selon vos données existantes
-- UPDATE destinations SET continent = 'Europe' WHERE slug LIKE '%europe%' OR slug LIKE '%france%' OR slug LIKE '%italie%' OR slug LIKE '%espagne%';
-- UPDATE destinations SET continent = 'Asie' WHERE slug LIKE '%asie%' OR slug LIKE '%japon%' OR slug LIKE '%chine%' OR slug LIKE '%thailande%';
-- UPDATE destinations SET continent = 'Amérique du Nord' WHERE slug LIKE '%canada%' OR slug LIKE '%usa%' OR slug LIKE '%etats-unis%';
-- UPDATE destinations SET continent = 'Amérique du Sud' WHERE slug LIKE '%bresil%' OR slug LIKE '%argentine%' OR slug LIKE '%perou%';
-- UPDATE destinations SET continent = 'Afrique' WHERE slug LIKE '%afrique%' OR slug LIKE '%maroc%' OR slug LIKE '%egypte%';
-- UPDATE destinations SET continent = 'Océanie' WHERE slug LIKE '%australie%' OR slug LIKE '%nouvelle-zelande%';
