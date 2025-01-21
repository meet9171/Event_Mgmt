/*
  # Initial Schema Setup for Event Management System

  1. Tables
    - users (managed by Supabase Auth)
    - events
      - Basic event information
      - Customization options
      - Capacity and pricing
    - registrations
      - Event registration records
      - Payment status
      - Attendee information
    - form_fields
      - Custom form field definitions
      - Validation rules
    - form_responses
      - Attendee form submissions
      - Field values

  2. Security
    - RLS policies for all tables
    - Owner-based access control
*/

-- Events table
CREATE TABLE events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  event_type text NOT NULL,
  start_date timestamptz NOT NULL,
  end_date timestamptz NOT NULL,
  venue text NOT NULL,
  capacity integer,
  price decimal(10,2),
  currency text DEFAULT 'USD',
  logo_url text,
  banner_url text,
  is_published boolean DEFAULT false,
  custom_color text,
  registration_open boolean DEFAULT true
);

-- Form fields table
CREATE TABLE form_fields (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid REFERENCES events(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  field_type text NOT NULL,
  label text NOT NULL,
  placeholder text,
  options jsonb,
  is_required boolean DEFAULT false,
  validation_rules jsonb,
  order_index integer NOT NULL
);

-- Registrations table
CREATE TABLE registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  event_id uuid REFERENCES events(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  attendee_email text NOT NULL,
  attendee_name text NOT NULL,
  payment_status text DEFAULT 'pending',
  payment_amount decimal(10,2),
  ticket_code text UNIQUE,
  check_in_time timestamptz,
  status text DEFAULT 'registered'
);

-- Form responses table
CREATE TABLE form_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  registration_id uuid REFERENCES registrations(id) ON DELETE CASCADE,
  field_id uuid REFERENCES form_fields(id) ON DELETE CASCADE,
  response_value text
);

-- Enable RLS
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE form_fields ENABLE ROW LEVEL SECURITY;
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE form_responses ENABLE ROW LEVEL SECURITY;

-- Events policies
CREATE POLICY "Users can view published events"
  ON events FOR SELECT
  USING (is_published = true OR auth.uid() = user_id);

CREATE POLICY "Users can create events"
  ON events FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own events"
  ON events FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own events"
  ON events FOR DELETE
  USING (auth.uid() = user_id);

-- Form fields policies
CREATE POLICY "Public can view form fields"
  ON form_fields FOR SELECT
  USING (true);

CREATE POLICY "Event owners can manage form fields"
  ON form_fields FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = form_fields.event_id
      AND events.user_id = auth.uid()
    )
  );

-- Registrations policies
CREATE POLICY "Users can view own registrations"
  ON registrations FOR SELECT
  USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = registrations.event_id
      AND events.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create registrations"
  ON registrations FOR INSERT
  WITH CHECK (true);

-- Form responses policies
CREATE POLICY "Users can view own responses"
  ON form_responses FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM registrations
      WHERE registrations.id = form_responses.registration_id
      AND (
        registrations.user_id = auth.uid() OR
        EXISTS (
          SELECT 1 FROM events
          WHERE events.id = registrations.event_id
          AND events.user_id = auth.uid()
        )
      )
    )
  );

CREATE POLICY "Users can create responses"
  ON form_responses FOR INSERT
  WITH CHECK (true);

-- Functions
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers
CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON events
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();