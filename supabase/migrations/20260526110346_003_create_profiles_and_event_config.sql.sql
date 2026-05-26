/*
  # Add user profiles and event configuration

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key, references auth.users)
      - `full_name` (text)
      - `phone` (text)
      - `role` (text) - 'client', 'organizer', 'admin'
      - `created_at` (timestamp)

    - `event_config`
      - `id` (uuid, primary key)
      - `name` (text) - Event name
      - `date` (text) - Event date
      - `venue` (text) - Event venue
      - `description` (text)
      - `price` (integer) - Ticket price in FCFA
      - `tickets_total` (integer) - Total tickets available
      - `tickets_sold` (integer) - Tickets sold count
      - `is_active` (boolean)
      - `image_url` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Profiles: users can read/update own profile
    - Event config: public read, admin/organizer write

  3. Notes
    - Single event architecture
    - User roles: client, organizer, admin
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  phone text,
  role text NOT NULL DEFAULT 'client' CHECK (role IN ('client', 'organizer', 'admin')),
  created_at timestamptz DEFAULT now()
);

-- Create event_config table
CREATE TABLE IF NOT EXISTS event_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL DEFAULT 'Le Petit Poto - Édition 5',
  date text NOT NULL DEFAULT '28 Juin 2026',
  venue text NOT NULL DEFAULT 'Palais de la Culture, Abidjan',
  description text DEFAULT 'L''événement culturel incontournable - Le Grand Retour',
  price integer NOT NULL DEFAULT 5000,
  tickets_total integer NOT NULL DEFAULT 500,
  tickets_sold integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  image_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_config ENABLE ROW LEVEL SECURITY;

-- Policies for profiles
CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Policies for event_config (public read)
CREATE POLICY "Public can read event config"
  ON event_config FOR SELECT
  TO anon, authenticated
  USING (true);

-- Admin/organizer can manage event config
CREATE POLICY "Admins can manage event config"
  ON event_config FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'organizer')
    )
  );

-- Insert default event config
INSERT INTO event_config (id, name, date, venue, description, price, tickets_total)
VALUES (
  gen_random_uuid(),
  'Le Petit Poto - Édition 5',
  '28 Juin 2026',
  'Palais de la Culture, Abidjan',
  'Le Grand Retour - L''événement culturel incontournable de l''année',
  5000,
  500
) ON CONFLICT DO NOTHING;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_event_config_active ON event_config(is_active);
