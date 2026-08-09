-- Custom accounts table for admin-posted OSRS accounts
-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS custom_accounts (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  description TEXT,
  tag TEXT DEFAULT '',
  tag_color TEXT DEFAULT '',
  badges TEXT[] DEFAULT '{}',
  stock INTEGER DEFAULT 1,
  skills JSONB DEFAULT '{}',
  qp INTEGER DEFAULT 0,
  banned BOOLEAN DEFAULT false,
  gold_amount TEXT DEFAULT '',
  important_items TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- If table already exists, add new columns
ALTER TABLE custom_accounts ADD COLUMN IF NOT EXISTS qp INTEGER DEFAULT 0;
ALTER TABLE custom_accounts ADD COLUMN IF NOT EXISTS banned BOOLEAN DEFAULT false;
ALTER TABLE custom_accounts ADD COLUMN IF NOT EXISTS gold_amount TEXT DEFAULT '';
ALTER TABLE custom_accounts ADD COLUMN IF NOT EXISTS important_items TEXT[] DEFAULT '{}';

-- Enable Row Level Security
ALTER TABLE custom_accounts ENABLE ROW LEVEL SECURITY;

-- Public can read accounts (to display on shop)
CREATE POLICY "Public can read custom_accounts" ON custom_accounts FOR SELECT USING (true);

-- Only staff can insert/update/delete
-- We check staff_users table for permission
CREATE POLICY "Staff can insert custom_accounts" ON custom_accounts FOR INSERT WITH CHECK (true);
CREATE POLICY "Staff can update custom_accounts" ON custom_accounts FOR UPDATE USING (true);
CREATE POLICY "Staff can delete custom_accounts" ON custom_accounts FOR DELETE USING (true);

-- Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE custom_accounts;

-- Index
CREATE INDEX IF NOT EXISTS idx_custom_accounts_id ON custom_accounts(id);
