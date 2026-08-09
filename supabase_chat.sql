-- Chat System for OSRS GP Orders
-- Run this in Supabase SQL Editor

-- Chat rooms (one per order)
CREATE TABLE IF NOT EXISTS chat_rooms (
  id SERIAL PRIMARY KEY,
  order_id TEXT NOT NULL UNIQUE,
  buyer_email TEXT,
  buyer_rsn TEXT,
  status TEXT DEFAULT 'waiting', -- waiting, active, closed
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Chat messages
CREATE TABLE IF NOT EXISTS chat_messages (
  id SERIAL PRIMARY KEY,
  order_id TEXT NOT NULL REFERENCES chat_rooms(order_id) ON DELETE CASCADE,
  sender TEXT NOT NULL, -- 'buyer' or 'mod'
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE chat_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Public can read and insert chat rooms (buyers create rooms when placing orders)
CREATE POLICY "Public can read chat_rooms" ON chat_rooms FOR SELECT USING (true);
CREATE POLICY "Public can insert chat_rooms" ON chat_rooms FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can update chat_rooms" ON chat_rooms FOR UPDATE USING (true);

-- Public can read and insert messages
CREATE POLICY "Public can read chat_messages" ON chat_messages FOR SELECT USING (true);
CREATE POLICY "Public can insert chat_messages" ON chat_messages FOR INSERT WITH CHECK (true);

-- Enable Realtime for chat_messages
ALTER PUBLICATION supabase_realtime ADD TABLE chat_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE chat_rooms;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_chat_messages_order_id ON chat_messages(order_id);
CREATE INDEX IF NOT EXISTS idx_chat_rooms_order_id ON chat_rooms(order_id);
