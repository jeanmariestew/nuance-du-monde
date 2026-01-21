ALTER TABLE offers ADD COLUMN coordinates TEXT NULL;
ALTER TABLE offers ADD COLUMN map_center TEXT NULL;

-- Example usage:
-- UPDATE offers SET coordinates = '[{"name": "Tunis", "lat": 36.8065, "lng": 10.1815}, {"name": "Kairouan", "lat": 35.6781, "lng": 10.0963}]' WHERE id = 43;
-- UPDATE offers SET map_center = '{"lat": 36.0, "lng": 10.0, "zoom": 7}' WHERE id = 43;
