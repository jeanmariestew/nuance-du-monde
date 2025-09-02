-- Add agency column to partners table
ALTER TABLE partners ADD COLUMN agency VARCHAR(191) NOT NULL DEFAULT '' AFTER name;

-- Update existing partners with default agency names
UPDATE partners SET agency = 'Agence partenaire' WHERE agency = '';
