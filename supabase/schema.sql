-- Run this in your Supabase SQL Editor
-- Create all tables for Sole Store

CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  name_persian TEXT NOT NULL,
  description TEXT DEFAULT '',
  description_persian TEXT DEFAULT '',
  price INTEGER NOT NULL DEFAULT 0,
  category TEXT NOT NULL DEFAULT 'sneakers',
  category_persian TEXT DEFAULT '',
  sizes INTEGER[] DEFAULT '{40,41,42,43}',
  colors JSONB DEFAULT '[]',
  image TEXT DEFAULT '',
  images JSONB DEFAULT '[]',
  brand TEXT NOT NULL DEFAULT '',
  rating REAL DEFAULT 4.0,
  in_stock BOOLEAN DEFAULT true,
  featured BOOLEAN DEFAULT false,
  new BOOLEAN DEFAULT false,
  sale BOOLEAN DEFAULT false,
  discount INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  customer_name TEXT NOT NULL DEFAULT '',
  phone TEXT DEFAULT '',
  email TEXT DEFAULT '',
  address TEXT DEFAULT '',
  notes TEXT DEFAULT '',
  total INTEGER DEFAULT 0,
  status TEXT DEFAULT 'pending',
  items JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS messages (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL DEFAULT '',
  email TEXT DEFAULT '',
  subject TEXT DEFAULT '',
  message TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_all" ON products FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_all" ON orders FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_all" ON messages FOR ALL USING (true) WITH CHECK (true);
