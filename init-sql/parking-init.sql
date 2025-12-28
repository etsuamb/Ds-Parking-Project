CREATE TABLE IF NOT EXISTS parking_spots (
  id SERIAL PRIMARY KEY,
  lot_id VARCHAR(50) NOT NULL,
  spot_number VARCHAR(20) NOT NULL,
  is_reserved BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS reservations (
  id SERIAL PRIMARY KEY,
  booking_id INTEGER NOT NULL,
  spot_id INTEGER REFERENCES parking_spots(id),
  reserved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed initial parking spots
INSERT INTO parking_spots (lot_id, spot_number)
VALUES
('lot1', 'A1'), ('lot1', 'A2'), ('lot1', 'A3'), ('lot1', 'A4'),
('lot2', 'B1'), ('lot2', 'B2'), ('lot2', 'B3')
ON CONFLICT DO NOTHING;