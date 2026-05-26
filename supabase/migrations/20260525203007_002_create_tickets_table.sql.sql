/*
  # Add tickets table for individual tickets

  1. New Tables
    - `tickets`
      - `id` (uuid, primary key)
      - `reservation_id` (uuid, foreign key to reservations)
      - `ticket_number` (integer) - Numéro du ticket dans la réservation (1, 2, 3...)
      - `reference` (text, unique) - Référence unique du ticket (ex: LPP-ABC12345-001)
      - `qr_data` (text) - Données JSON encodées dans le QR code
      - `status` (text) - Statut du ticket (active, used, cancelled)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `tickets` table
    - Policy: Anyone can insert (via reservation creation)
    - Policy: Public can read by reference (for validation)

  3. Changes to reservations table
    - `qr_data` column removed (moved to tickets)
    - `quantity` now just tracks how many tickets were purchased
*/

-- Create tickets table
CREATE TABLE IF NOT EXISTS tickets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reservation_id uuid NOT NULL REFERENCES reservations(id) ON DELETE CASCADE,
  ticket_number integer NOT NULL,
  reference text UNIQUE NOT NULL,
  qr_data text NOT NULL,
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public inserts (via reservation creation)
CREATE POLICY "Anyone can create tickets"
  ON tickets
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Policy: Users can read their own tickets via reservation
CREATE POLICY "Users can read own tickets"
  ON tickets
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM reservations
      WHERE reservations.id = tickets.reservation_id
      AND reservations.buyer_email = auth.jwt() ->> 'email'
    )
  );

-- Policy: Public can read by reference (for validation)
CREATE POLICY "Public can read by reference"
  ON tickets
  FOR SELECT
  TO anon, authenticated
  USING (reference IS NOT NULL);

-- Indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_tickets_reference ON tickets(reference);
CREATE INDEX IF NOT EXISTS idx_tickets_reservation ON tickets(reservation_id);
CREATE INDEX IF NOT EXISTS idx_tickets_created ON tickets(created_at DESC);

-- Remove qr_data from reservations (now in tickets)
ALTER TABLE reservations DROP COLUMN IF EXISTS qr_data;
