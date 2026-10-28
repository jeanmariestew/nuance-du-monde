-- Agences partenaires copiées depuis la base Alwaysdata (nuance_du_monde).
-- À exécuter sur la base du site en ligne.
-- Les logos sont des fichiers du site : public/images/partners/
-- Ils doivent être publiés avec le code pour que les images s'affichent.

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

DELETE FROM partners;

INSERT INTO partners (id, name, agency, description, logo_url, website_url, sort_order, is_active) VALUES
(7, 'Club Voyages Raymonde Potvin', 'Châteauguay', NULL, '/images/partners/club-voyages.svg', 'https://www.clubvoyages.com/agences-de-voyages/chateauguay/raymondepotvin-chateauguay-42454', 1, 1),
(14, 'Club Voyages Solerama', 'Saint-Eustache', NULL, '/images/partners/club-voyages.svg', 'https://www.clubvoyages.com/agences-de-voyages/saint-eustache/solerama-st-eustache-47568', 2, 1),
(2, 'Eclipse Voyage', 'McMasterville', 'Partenaire agence de voyage', '/images/partners/eclipse.svg', 'https://voyageseclipse.ca/', 3, 1),
(8, 'Espace Voyages', '', NULL, '/images/partners/espace-voyages.svg', 'https://espacevoyages.ca/', 4, 1),
(9, 'Voyage Fontainebleau', 'Blainville', NULL, '/images/partners/fontainebleau.svg', 'https://voyagesfontainebleau.com/', 5, 1),
(17, 'Voyage Horizon', 'Sherbrooke', NULL, '/images/partners/horizon.png', 'https://voyagehorizon.com/', 6, 1),
(1, 'Voyage Vasco Côte-de-Beauport', 'Québec', 'Partenaire agence de voyage', '/images/partners/vasco.png', 'https://www.vascobeauport.com/', 7, 1),
(13, 'Voyage Vasco Lachute', 'Lachute', NULL, '/images/partners/vasco.png', 'https://voyagevasco.com/agence/lachute', 8, 1),
(16, 'Voyage Vasco MRC Maskinongé', 'Louiseville', NULL, '/images/partners/vasco.png', 'https://voyagevasco.com/agence/voyage-vasco-mrc-maskinonge/', 9, 1),
(5, 'Voyage Vasco Toutes Saisons', 'Thetford Mines', NULL, '/images/partners/vasco.png', 'https://www.vascots.com/', 10, 1),
(15, 'Voyage Vasco Victoriaville', 'Victoriaville', NULL, '/images/partners/vasco.png', 'https://voyagevasco.com/agences', 11, 1),
(6, 'Voyages ALM', 'Repentigny', NULL, '/images/partners/alm.png', 'https://www.voyagesalm.com/', 12, 1),
(18, 'Voyages GABY', '', NULL, '/images/partners/gaby.png', 'https://www.voyagesgabymsh.ca/', 13, 1),
(11, 'Voyages Nouveau-Monde', 'Joliette', NULL, '/images/partners/nouveau-monde.png', 'https://voyagesnouveaumonde.com/', 14, 1),
(3, 'Voyages Prestige', 'Blainville', 'Partenaire agence de voyage', '/images/partners/prestige.webp', 'https://www.voyagesprestige.com/', 15, 1),
(4, 'Voyages Reid', '', 'Partenaire agence de voyage', '/images/partners/reid.png', 'https://voyagesreid.com/', 16, 1),
(10, 'Voyages Signés Mario Brisebois', 'Cowansville', NULL, '/images/partners/mario-brisebois.png', 'https://vsmb.ca/', 17, 1),
(12, 'Voyages Simon Pelletier', 'Noyan', NULL, '/images/partners/simon-pelletier.svg', 'https://lesvoyagessimonpelletier.com/', 18, 1);

ALTER TABLE partners AUTO_INCREMENT = 19;

SET FOREIGN_KEY_CHECKS = 1;
