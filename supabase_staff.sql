-- Staff access control for chat system
-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS staff_users (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  role TEXT DEFAULT 'staff', -- 'owner' or 'staff' or 'mod'
  display_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (public can read to check access)
ALTER TABLE staff_users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read staff_users" ON staff_users FOR SELECT USING (true);

-- Index
CREATE INDEX IF NOT EXISTS idx_staff_users_email ON staff_users(email);
