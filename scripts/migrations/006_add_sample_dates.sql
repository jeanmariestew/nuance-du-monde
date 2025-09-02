-- Add sample departure dates for all offers
-- Clear existing dates first
DELETE FROM offer_dates;

-- Add sample dates for each offer (assuming we have offers with IDs 1-10)
-- Egypt offers
INSERT INTO offer_dates (offer_id, departure_date, note) VALUES
(1, '2024-03-15', 'Départ de printemps'),
(1, '2024-04-20', 'Départ de Pâques'),
(1, '2024-05-10', 'Départ de mai'),
(1, '2024-06-15', 'Départ d\'été'),
(1, '2024-09-20', 'Départ d\'automne'),
(1, '2024-10-25', 'Départ d\'octobre'),
(1, '2024-11-30', 'Départ d\'hiver');

-- Morocco offers
INSERT INTO offer_dates (offer_id, departure_date, note) VALUES
(2, '2024-03-10', 'Départ de printemps'),
(2, '2024-04-15', 'Départ d\'avril'),
(2, '2024-05-20', 'Départ de mai'),
(2, '2024-06-25', 'Départ d\'été'),
(2, '2024-09-15', 'Départ d\'automne'),
(2, '2024-10-20', 'Départ d\'octobre');

-- Kenya offers
INSERT INTO offer_dates (offer_id, departure_date, note) VALUES
(3, '2024-02-28', 'Safari de février'),
(3, '2024-04-10', 'Safari de printemps'),
(3, '2024-06-20', 'Safari d\'été'),
(3, '2024-08-15', 'Safari d\'août'),
(3, '2024-10-10', 'Safari d\'automne'),
(3, '2024-12-20', 'Safari d\'hiver');

-- Add dates for remaining offers (IDs 4-10)
INSERT INTO offer_dates (offer_id, departure_date, note) VALUES
(4, '2024-03-20', 'Départ de mars'),
(4, '2024-05-15', 'Départ de mai'),
(4, '2024-07-10', 'Départ d\'été'),
(4, '2024-09-25', 'Départ d\'automne'),
(5, '2024-04-05', 'Départ d\'avril'),
(5, '2024-06-10', 'Départ de juin'),
(5, '2024-08-20', 'Départ d\'août'),
(5, '2024-11-15', 'Départ d\'automne'),
(6, '2024-03-25', 'Départ de printemps'),
(6, '2024-05-30', 'Départ de mai'),
(6, '2024-07-20', 'Départ d\'été'),
(6, '2024-10-05', 'Départ d\'octobre'),
(7, '2024-04-12', 'Départ d\'avril'),
(7, '2024-06-18', 'Départ de juin'),
(7, '2024-08-25', 'Départ d\'été'),
(7, '2024-11-10', 'Départ d\'automne'),
(8, '2024-03-08', 'Départ de mars'),
(8, '2024-05-22', 'Départ de mai'),
(8, '2024-07-15', 'Départ d\'été'),
(8, '2024-09-30', 'Départ d\'automne'),
(9, '2024-04-18', 'Départ d\'avril'),
(9, '2024-06-25', 'Départ de juin'),
(9, '2024-08-12', 'Départ d\'août'),
(9, '2024-10-28', 'Départ d\'octobre'),
(10, '2024-03-30', 'Départ de printemps'),
(10, '2024-06-05', 'Départ de juin'),
(10, '2024-08-18', 'Départ d\'été'),
(10, '2024-11-25', 'Départ d\'automne');
