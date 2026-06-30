-- Products table
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  name_persian TEXT NOT NULL,
  description TEXT DEFAULT '',
  description_persian TEXT DEFAULT '',
  price NUMERIC NOT NULL,
  category TEXT NOT NULL,
  category_persian TEXT DEFAULT '',
  sizes INTEGER[] DEFAULT '{}',
  colors TEXT DEFAULT '[]',
  image TEXT DEFAULT '',
  images TEXT DEFAULT '[]',
  brand TEXT DEFAULT '',
  rating NUMERIC DEFAULT 4.0,
  in_stock BOOLEAN DEFAULT TRUE,
  featured BOOLEAN DEFAULT FALSE,
  new BOOLEAN DEFAULT FALSE,
  sale BOOLEAN DEFAULT FALSE,
  discount INTEGER DEFAULT 0,
  image_links TEXT DEFAULT NULL,
  podcast_link TEXT DEFAULT NULL,
  video_link TEXT DEFAULT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  items TEXT DEFAULT '[]',
  total NUMERIC DEFAULT 0,
  status TEXT DEFAULT 'pending',
  customer_name TEXT DEFAULT '',
  customer_phone TEXT DEFAULT '',
  customer_address TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT DEFAULT '',
  subject TEXT DEFAULT '',
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Knowledge base table for chatbot
CREATE TABLE IF NOT EXISTS knowledge_base (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'custom',
  tags TEXT DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Allow public access (since we use anon key from client)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_base ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow anon all" ON products;
DROP POLICY IF EXISTS "Allow anon all" ON orders;
DROP POLICY IF EXISTS "Allow anon all" ON messages;
DROP POLICY IF EXISTS "Allow anon all" ON knowledge_base;

CREATE POLICY "Allow anon all" ON products FOR ALL USING (true);
CREATE POLICY "Allow anon all" ON orders FOR ALL USING (true);
CREATE POLICY "Allow anon all" ON messages FOR ALL USING (true);
CREATE POLICY "Allow anon all" ON knowledge_base FOR ALL USING (true);
