-- Seed reference data and offers (idempotent)

-- travel_types
INSERT IGNORE INTO travel_types (title, slug, is_active) VALUES
 ('Départs Garantis', 'departs-garantis', 1),
 ('Voyages en individuel', 'voyages-individuel', 1),
 ('Voyages en groupe', 'voyages-en-groupe', 1);

-- travel_themes
INSERT IGNORE INTO travel_themes (title, slug, is_active) VALUES
 ('Nature', 'nature', 1),
 ('Culture', 'culture', 1),
 ('Aventure', 'aventure', 1);

-- destinations
INSERT IGNORE INTO destinations (title, slug, is_active) VALUES
 ('Égypte', 'egypte', 1),
 ('Mexique', 'mexique', 1),
 ('Maroc', 'maroc', 1),
 ('Afrique du Sud', 'afrique-du-sud', 1),
 ('Kenya', 'kenya', 1),
 ('Colombie', 'colombie', 1),
 ('Pérou', 'perou', 1),
 ('États-Unis', 'usa', 1),
 ('Argentine', 'argentine', 1),
 ('Thaïlande', 'thailande', 1);

-- offers (placeholders for images)
INSERT IGNORE INTO offers (title, slug, subtitle, short_description, description, meta_title, meta_description, image_main, image_banner, duration, price, price_currency, is_active)
VALUES
 ('Égypte – Le Caire + Croisière sur le Nil + Mer Rouge', 'egypte-croisiere-nil-mer-rouge-jordanie', NULL, 'Découverte de l\'Égypte entre Caire, Nil et Mer Rouge', 'Programme complet entre Caire, croisière sur le Nil et détente en Mer Rouge. Itinéraires susceptibles de varier.', 'Égypte – Croisière et Mer Rouge', 'Offre Égypte complète', 'https://placehold.co/800x600?text=Egypte', 'https://placehold.co/1600x400?text=Egypte+Banner', 12, 2499.00, 'EUR', 1),
 ('Maroc – Villes impériales et Sud Marocain', 'maroc-villes-imperiales-sud', NULL, 'Villes impériales et Sud', 'Circuit combinant villes impériales et Sud marocain.', 'Maroc – Villes impériales', 'Découverte des villes impériales du Maroc', 'https://placehold.co/800x600?text=Maroc', 'https://placehold.co/1600x400?text=Maroc+Banner', 10, 1390.00, 'EUR', 1),
 ('Maroc – Désert et Sud Marocain', 'maroc-desert-et-sud', NULL, 'Désert et Sud', 'Immersion dans le désert et le Sud marocain.', 'Maroc – Désert', 'Aventure dans le désert', 'https://placehold.co/800x600?text=Maroc+Desert', 'https://placehold.co/1600x400?text=Maroc+Desert+Banner', 8, 1290.00, 'EUR', 1),
 ('Afrique du Sud – Entre aventure, nature et traditions', 'afrique-du-sud-entre-aventure-nature-traditions', NULL, 'Aventure, nature et traditions', 'Grand tour Afrique du Sud.', 'Afrique du Sud – Aventure', 'Aventure, nature et traditions', 'https://placehold.co/800x600?text=AfSud', 'https://placehold.co/1600x400?text=AfSud+Banner', 13, 3190.00, 'EUR', 1),
 ('Afrique du Sud – En option Orpaillage', 'afrique-du-sud-orpaillage', NULL, 'Option orpaillage', 'Extension axée sur l\'orpaillage.', 'Afrique du Sud – Orpaillage', 'Expérience orpaillage', 'https://placehold.co/800x600?text=AfSud+Or', 'https://placehold.co/1600x400?text=AfSud+Or+Banner', 5, 790.00, 'EUR', 1),
 ('Afrique du Sud – Extension Chutes Victoria', 'afrique-du-sud-chutes-victoria', NULL, 'Extension Chutes Victoria', 'Extension vers les Chutes Victoria.', 'Afrique du Sud – Chutes Victoria', 'Extension Chutes Victoria', 'https://placehold.co/800x600?text=Chutes', 'https://placehold.co/1600x400?text=Chutes+Banner', 4, 990.00, 'EUR', 1),
 ('Kenya – Avec séjour en bord de mer', 'kenya-sejour-bord-de-mer', NULL, 'Safari et mer', 'Safari au Kenya avec extension balnéaire.', 'Kenya – Safari et Mer', 'Safari + séjour balnéaire', 'https://placehold.co/800x600?text=Kenya', 'https://placehold.co/1600x400?text=Kenya+Banner', 11, 2890.00, 'EUR', 1),
 ('Colombie – L’essentiel du pays', 'colombie-essentiel', NULL, 'Essentiels Colombie', 'Visite des essentiels de la Colombie.', 'Colombie – Essentiel', 'L\'essentiel de la Colombie', 'https://placehold.co/800x600?text=Colombie', 'https://placehold.co/1600x400?text=Colombie+Banner', 12, 2590.00, 'EUR', 1),
 ('Pérou – Exploration des merveilles du Pérou', 'perou-merveilles', NULL, 'Merveilles du Pérou', 'Exploration des sites majeurs du Pérou.', 'Pérou – Merveilles', 'Exploration des merveilles', 'https://placehold.co/800x600?text=Perou', 'https://placehold.co/1600x400?text=Perou+Banner', 12, 2790.00, 'EUR', 1),
 ('Californie Viticole', 'californie-viticole', NULL, 'Californie viticole', 'Découverte des vignobles californiens.', 'Californie – Vignobles', 'Route des vins en Californie', 'https://placehold.co/800x600?text=California', 'https://placehold.co/1600x400?text=California+Banner', 7, 2190.00, 'EUR', 1),
 ('Thaïlande – Trésors du Sud', 'thailande-tresors-du-sud', NULL, 'Trésors du Sud', 'Découverte des trésors du Sud thaïlandais.', 'Thaïlande – Trésors du Sud', 'Circuit dans le Sud', 'https://placehold.co/800x600?text=Thailande', 'https://placehold.co/1600x400?text=Thailande+Banner', 10, 1890.00, 'EUR', 1),
 ('Argentine – Découverte des merveilles de l’Argentine', 'argentine-merveilles', NULL, 'Merveilles de l\'Argentine', 'Découverte des merveilles d\'Argentine.', 'Argentine – Merveilles', 'Les merveilles d\'Argentine', 'https://placehold.co/800x600?text=Argentine', 'https://placehold.co/1600x400?text=Argentine+Banner', 12, 2990.00, 'EUR', 1);

-- N:N links for types
-- Départs Garantis for: Égypte, Maroc (x2), Af. du Sud (entre aventure…), Colombie, Pérou, Argentine, Thaïlande.
INSERT IGNORE INTO offer_travel_types (offer_id, travel_type_id)
SELECT o.id, tt.id FROM offers o JOIN travel_types tt ON tt.slug = 'departs-garantis'
WHERE o.slug IN (
 'egypte-croisiere-nil-mer-rouge-jordanie',
 'maroc-villes-imperiales-sud',
 'maroc-desert-et-sud',
 'afrique-du-sud-entre-aventure-nature-traditions',
 'colombie-essentiel',
 'perou-merveilles',
 'argentine-merveilles',
 'thailande-tresors-du-sud'
);

-- Voyages en groupe for: Af. du Sud (orpaillage), Af. du Sud (Chutes Victoria), Californie Viticole.
INSERT IGNORE INTO offer_travel_types (offer_id, travel_type_id)
SELECT o.id, tt.id FROM offers o JOIN travel_types tt ON tt.slug = 'voyages-en-groupe'
WHERE o.slug IN (
 'afrique-du-sud-orpaillage',
 'afrique-du-sud-chutes-victoria',
 'californie-viticole'
);

-- N:N links for themes
-- Nature for: Égypte, Maroc (désert), Af. du Sud (x3), Kenya, Pérou, Argentine, Thaïlande.
INSERT IGNORE INTO offer_travel_themes (offer_id, travel_theme_id)
SELECT o.id, th.id FROM offers o JOIN travel_themes th ON th.slug = 'nature'
WHERE o.slug IN (
 'egypte-croisiere-nil-mer-rouge-jordanie',
 'maroc-desert-et-sud',
 'afrique-du-sud-entre-aventure-nature-traditions',
 'afrique-du-sud-orpaillage',
 'afrique-du-sud-chutes-victoria',
 'kenya-sejour-bord-de-mer',
 'perou-merveilles',
 'argentine-merveilles',
 'thailande-tresors-du-sud'
);

-- Culture for: Égypte, Maroc (villes impériales), Af. du Sud (entre aventure…), Colombie, Pérou, Californie, Argentine.
INSERT IGNORE INTO offer_travel_themes (offer_id, travel_theme_id)
SELECT o.id, th.id FROM offers o JOIN travel_themes th ON th.slug = 'culture'
WHERE o.slug IN (
 'egypte-croisiere-nil-mer-rouge-jordanie',
 'maroc-villes-imperiales-sud',
 'afrique-du-sud-entre-aventure-nature-traditions',
 'colombie-essentiel',
 'perou-merveilles',
 'californie-viticole',
 'argentine-merveilles'
);

-- N:N links for destinations
INSERT IGNORE INTO offer_destinations (offer_id, destination_id)
SELECT o.id, d.id FROM offers o JOIN destinations d ON d.slug = 'egypte' WHERE o.slug = 'egypte-croisiere-nil-mer-rouge-jordanie';

INSERT IGNORE INTO offer_destinations (offer_id, destination_id)
SELECT o.id, d.id FROM offers o JOIN destinations d ON d.slug = 'maroc' WHERE o.slug IN ('maroc-villes-imperiales-sud', 'maroc-desert-et-sud');

INSERT IGNORE INTO offer_destinations (offer_id, destination_id)
SELECT o.id, d.id FROM offers o JOIN destinations d ON d.slug = 'afrique-du-sud' WHERE o.slug IN ('afrique-du-sud-entre-aventure-nature-traditions','afrique-du-sud-orpaillage','afrique-du-sud-chutes-victoria');

INSERT IGNORE INTO offer_destinations (offer_id, destination_id)
SELECT o.id, d.id FROM offers o JOIN destinations d ON d.slug = 'kenya' WHERE o.slug = 'kenya-sejour-bord-de-mer';

INSERT IGNORE INTO offer_destinations (offer_id, destination_id)
SELECT o.id, d.id FROM offers o JOIN destinations d ON d.slug = 'colombie' WHERE o.slug = 'colombie-essentiel';

INSERT IGNORE INTO offer_destinations (offer_id, destination_id)
SELECT o.id, d.id FROM offers o JOIN destinations d ON d.slug = 'perou' WHERE o.slug = 'perou-merveilles';

INSERT IGNORE INTO offer_destinations (offer_id, destination_id)
SELECT o.id, d.id FROM offers o JOIN destinations d ON d.slug = 'usa' WHERE o.slug = 'californie-viticole';

INSERT IGNORE INTO offer_destinations (offer_id, destination_id)
SELECT o.id, d.id FROM offers o JOIN destinations d ON d.slug = 'argentine' WHERE o.slug = 'argentine-merveilles';

INSERT IGNORE INTO offer_destinations (offer_id, destination_id)
SELECT o.id, d.id FROM offers o JOIN destinations d ON d.slug = 'thailande' WHERE o.slug = 'thailande-tresors-du-sud';

-- offer_dates
INSERT IGNORE INTO offer_dates (offer_id, departure_date, note)
SELECT o.id, DATE('2025-10-16'), 'départ garanti (au 29/10/2025)'
FROM offers o WHERE o.slug = 'argentine-merveilles';

INSERT IGNORE INTO offer_dates (offer_id, departure_date, note)
SELECT o.id, DATE('2025-09-14'), NULL FROM offers o WHERE o.slug = 'thailande-tresors-du-sud';
INSERT IGNORE INTO offer_dates (offer_id, departure_date, note)
SELECT o.id, DATE('2025-10-16'), NULL FROM offers o WHERE o.slug = 'thailande-tresors-du-sud';
INSERT IGNORE INTO offer_dates (offer_id, departure_date, note)
SELECT o.id, DATE('2025-12-11'), NULL FROM offers o WHERE o.slug = 'thailande-tresors-du-sud';

-- settings
INSERT IGNORE INTO settings (`key`, `value`) VALUES ('maintenance_mode', 'FALSE');

-- admin user (md5("admin") demo)
INSERT IGNORE INTO users (email, password_hash, role)
VALUES ('admin@example.com', MD5('admin'), 'admin');
