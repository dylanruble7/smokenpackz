-- GP Price Tracker Table
-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS gp_prices (
  id SERIAL PRIMARY KEY,
  competitor TEXT NOT NULL,
  price_per_mil DECIMAL(10,2) NOT NULL,
  url TEXT,
  is_us BOOLEAN DEFAULT FALSE,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default competitor prices
INSERT INTO gp_prices (competitor, price_per_mil, url, is_us) VALUES
  ('Eldorado', 0.27, 'https://eldorado.gg', FALSE),
  ('ChicksGold', 0.28, 'https://chicksgold.com', FALSE),
  ('PieGP', 0.26, 'https://piegp.com', FALSE),
  ('SmokenPackz', 0.25, 'https://smokenpackz.com', TRUE)
ON CONFLICT DO NOTHING;

-- Enable Row Level Security (read-only for public)
ALTER TABLE gp_prices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read gp_prices" ON gp_prices FOR SELECT USING (true);

-- Helpful index
CREATE INDEX IF NOT EXISTS idx_gp_prices_competitor ON gp_prices(competitor);
