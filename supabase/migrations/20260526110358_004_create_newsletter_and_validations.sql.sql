/*
  # Add newsletter and analytics tables

  1. New Tables
    - `newsletter_subscriptions`
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `subscribed_at` (timestamp)
      - `is_active` (boolean)

    - `ticket_validations`
      - `id` (uuid, primary key)
      - `ticket_id` (uuid, FK to tickets)
      - `validated_by` (uuid, FK to profiles)
      - `validated_at` (timestamp)
      - `location` (text)

  2. Security
    - Newsletter: public can subscribe, admin can manage
    - Validations: organizer/admin can create, read own
*/

-- Newsletter subscriptions
CREATE TABLE IF NOT EXISTS newsletter_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  subscribed_at timestamptz DEFAULT now(),
  is_active boolean NOT NULL DEFAULT true
);

-- Ticket validations (scan history)
CREATE TABLE IF NOT EXISTS ticket_validations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id uuid NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
  validated_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  validated_at timestamptz DEFAULT now(),
  location text DEFAULT 'Entrée principale',
  notes text
);

-- Enable RLS
ALTER TABLE newsletter_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_validations ENABLE ROW LEVEL SECURITY;

-- Newsletter policies
CREATE POLICY "Anyone can subscribe to newsletter"
  ON newsletter_subscriptions FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can manage newsletter"
  ON newsletter_subscriptions FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Ticket validation policies
CREATE POLICY "Organizers can validate tickets"
  ON ticket_validations FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'organizer')
    )
  );

CREATE POLICY "Organizers can read validations"
  ON ticket_validations FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'organizer')
    )
  );

-- Indexes
CREATE INDEX IF NOT EXISTS idx_newsletter_email ON newsletter_subscriptions(email);
CREATE INDEX IF NOT EXISTS idx_validations_ticket ON ticket_validations(ticket_id);
CREATE INDEX IF NOT EXISTS idx_validations_date ON ticket_validations(validated_at DESC);
