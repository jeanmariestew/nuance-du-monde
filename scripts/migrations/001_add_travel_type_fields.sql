-- Add description, short_description, image_url, and sort_order to travel_types table
ALTER TABLE travel_types
ADD COLUMN description TEXT NULL AFTER slug,
ADD COLUMN short_description VARCHAR(500) NULL AFTER description,
ADD COLUMN image_url VARCHAR(1024) NULL AFTER short_description,
ADD COLUMN sort_order INT NOT NULL DEFAULT 0 AFTER is_active;
