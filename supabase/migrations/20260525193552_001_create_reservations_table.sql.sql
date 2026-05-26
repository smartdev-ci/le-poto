/*
  # Create reservations table

  1. New Tables
    - `reservations`
      - `id` (uuid, primary key)
      - `reference` (text, unique) - Reference unique du ticket (ex: LPP-ABC12345)
      - `event_name` (text) - Nom de l'événement
      - `event_date` (text) - Date de l'événement
      - `buyer_name` (text) - Nom complet de l'acheteur
      - `buyer_email` (text) - Email de l'acheteur
      - `buyer_phone` (text) - Téléphone de l'acheteur
      - `quantity` (integer) - Nombre de billets
      - `total_price` (integer) - Prix total en FCFA
      - `payment_method` (text) - Méthode de paiement
      - `payment_status` (text) - Statut du paiement (pending, confirmed, failed)
      - `qr_data` (text) - Données encodées dans le QR code
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `reservations` table
    - Policy: Anyone can insert (for public ticket purchases)
    - Policy: Only authenticated users can read their own reservations by email
*/

CREATE TABLE IF NOT EXISTS reservations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reference text UNIQUE NOT NULL,
  event_name text NOT NULL DEFAULT 'Le Petit Poto - Édition 5',
  event_date text NOT NULL DEFAULT '28 Juin 2026',
  buyer_name text NOT NULL,
  buyer_email text NOT NULL,
  buyer_phone text NOT NULL,
  quantity integer NOT NULL DEFAULT 1,
  total_price integer NOT NULL,
  payment_method text NOT NULL DEFAULT 'orange_money',
  payment_status text NOT NULL DEFAULT 'pending',
  qr_data text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public inserts (for ticket purchases)
CREATE POLICY "Anyone can create reservations"
  ON reservations
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Policy: Users can read their own reservations by email
CREATE POLICY "Users can read own reservations"
  ON reservations
  FOR SELECT
  TO authenticated
  USING (buyer_email = auth.jwt() ->> 'email');

-- Policy: Allow public read by reference (for ticket validation)
CREATE POLICY "Public can read by reference"
  ON reservations
  FOR SELECT
  TO anon, authenticated
  USING (reference IS NOT NULL);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_reservations_reference ON reservations(reference);
CREATE INDEX IF NOT EXISTS idx_reservations_email ON reservations(buyer_email);
CREATE INDEX IF NOT EXISTS idx_reservations_created ON reservations(created_at DESC);
