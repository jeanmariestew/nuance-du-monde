-- Add duration_days and duration_nights fields to offers table
ALTER TABLE offers 
ADD COLUMN duration_days INT UNSIGNED NULL AFTER duration,
ADD COLUMN duration_nights INT UNSIGNED NULL AFTER duration_days;

-- Update existing offers with sample duration data
UPDATE offers SET 
  duration_days = 12, 
  duration_nights = 10 
WHERE title LIKE '%Egypte%' OR title LIKE '%Egypt%';

UPDATE offers SET 
  duration_days = 8, 
  duration_nights = 7 
WHERE title LIKE '%Maroc%' OR title LIKE '%Morocco%';

UPDATE offers SET 
  duration_days = 10, 
  duration_nights = 9 
WHERE title LIKE '%Kenya%' OR title LIKE '%Afrique%';

UPDATE offers SET 
  duration_days = 14, 
  duration_nights = 13 
WHERE title LIKE '%Colombie%' OR title LIKE '%Colombia%';

UPDATE offers SET 
  duration_days = 7, 
  duration_nights = 6 
WHERE title LIKE '%Thaïlande%' OR title LIKE '%Thailand%';

-- Set default values for any remaining offers
UPDATE offers SET 
  duration_days = 7, 
  duration_nights = 6 
WHERE duration_days IS NULL AND duration_nights IS NULL;
