-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Products Table
create table if not exists products (
  id uuid default uuid_generate_v4() primary key,
  sku text unique not null,
  name text not null,
  category text not null,
  description text,
  price decimal not null,
  currency text default 'MAD',
  labor_hours integer default 0,
  image_url text,
  color text,
  finish text,
  warranty text,
  -- Store arrays as JSONB
  includes jsonb default '[]'::jsonb,
  materials jsonb default '[]'::jsonb,
  colors jsonb default '[]'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Bookings Table
create table if not exists bookings (
  id uuid default uuid_generate_v4() primary key,
  customer_name text not null,
  customer_email text not null,
  customer_phone text,
  location_id text not null,
  date date not null,
  time text not null,
  vehicle_info jsonb,
  quote_id uuid,
  status text default 'pending', -- pending, confirmed, completed, cancelled
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Quotes Table
create table if not exists quotes (
  id uuid default uuid_generate_v4() primary key,
  items jsonb not null, -- Array of selected products
  vehicle_info jsonb,
  total_parts decimal not null,
  total_labor decimal not null,
  rush_fee decimal default 0,
  total_amount decimal not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS Policies (Row Level Security)
alter table products enable row level security;
alter table bookings enable row level security;
alter table quotes enable row level security;

-- Allow public read access to products
create policy "Public products are viewable by everyone"
  on products for select
  using ( true );

-- Allow anyone to create a booking (for now)
create policy "Anyone can insert bookings"
  on bookings for insert
  with check ( true );

-- Seed Data (from products.js)
insert into products (sku, name, category, price, labor_hours, color, finish, warranty, includes, type) values
-- Paints
('AAW-PNT-001', 'Sahara Gold Metallic', 'paints', 4500, 24, '#C9A961', null, null, null, null),
('AAW-PNT-002', 'Atlas Burgundy Pearl', 'paints', 5200, 28, '#6B1D2D', null, null, null, null),
('AAW-PNT-003', 'Midnight Casablanca', 'paints', 4800, 26, '#0D1B2A', null, null, null, null),
('AAW-PNT-004', 'Marrakech Sunset Orange', 'paints', 5500, 30, '#E85D04', null, null, null, null),
('AAW-PNT-005', 'Mediterranean Blue', 'paints', 4600, 24, '#0077B6', null, null, null, null),
('AAW-PNT-006', 'Ceramic White Pearl', 'paints', 4200, 22, '#F8F9FA', null, null, null, null),
('AAW-PNT-007', 'Obsidian Black', 'paints', 4000, 20, '#1A1A2E', null, null, null, null),
('AAW-PNT-008', 'Desert Storm Grey', 'paints', 4300, 24, '#6C757D', null, null, null, null),

-- Wraps
('AAW-WRP-001', 'Satin Khaki Green', 'wraps', 18000, 32, '#4A5D23', 'Satin', '5 years', null, null),
('AAW-WRP-002', 'Gloss Midnight Purple', 'wraps', 20000, 35, '#2D1B4E', 'Gloss', '5 years', null, null),
('AAW-WRP-003', 'Matte Nardo Grey', 'wraps', 22000, 36, '#6E6E6E', 'Matte', '5 years', null, null),
('AAW-WRP-004', 'Chrome Rose Gold', 'wraps', 35000, 45, '#E8B4B8', 'Chrome', '3 years', null, null),

-- Body Kits
('AAW-BDK-001', 'Atlas Aero Package', 'bodykits', 85000, 48, null, null, null, '["Front bumper", "Side skirts", "Rear diffuser", "Spoiler"]', 'Full Kit'),
('AAW-BDK-002', 'Sport Front Bumper', 'bodykits', 25000, 12, null, null, null, '["Front bumper", "Lip spoiler"]', 'Front'),

-- Wheels
('AAW-WHL-001', 'Atlas Forged 21"', 'wheels', 42000, 4, null, 'Gloss Black', null, null, null),
('AAW-WHL-002', 'Sahara Flow Formed 20"', 'wheels', 32000, 4, null, 'Brushed Bronze', null, null, null),
('AAW-WHL-003', 'Marrakech Multi-Spoke 19"', 'wheels', 28000, 4, null, 'Machined Silver', null, null, null),
('AAW-WHL-004', 'Carbon Fiber Wheels 20"', 'wheels', 120000, 4, null, 'Carbon Weave', null, null, null),

-- Starlight
('AAW-STR-001', 'Starlight Headliner - Standard', 'starlight', 25000, 24, null, null, null, null, null),
('AAW-STR-002', 'Starlight Headliner - Premium', 'starlight', 45000, 36, null, null, null, null, null),
('AAW-STR-003', 'Starlight Headliner - Galaxy', 'starlight', 75000, 48, null, null, null, null, null),

-- Interior
('AAW-INT-001', 'Full Leather Retrim', 'interior', 65000, 72, null, null, null, null, 'Complete'),
('AAW-INT-003', 'Carbon Fiber Trim Set', 'interior', 28000, 16, null, null, null, null, 'Trim'),

-- Accessories
('AAW-ACC-001', 'Performance Exhaust System', 'accessories', 35000, 8, null, null, null, null, 'Exhaust'),
('AAW-ACC-002', 'Sport Suspension Kit', 'accessories', 28000, 16, null, null, null, null, 'Suspension')
on conflict (sku) do nothing;
