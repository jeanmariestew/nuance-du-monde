-- Migration: Add is_pro flag to travel_types table
-- Date: 2026-03-10

ALTER TABLE travel_types ADD COLUMN is_pro BOOLEAN DEFAULT FALSE AFTER is_active;

-- Index for filtering
CREATE INDEX idx_is_pro ON travel_types(is_pro);
