-- Create donations table to store donation submissions
CREATE TABLE IF NOT EXISTS donations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  amount NUMERIC(10, 2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'NAD',
  frequency VARCHAR(20) NOT NULL CHECK (frequency IN ('once', 'monthly', 'yearly')),
  payment_method VARCHAR(50) NOT NULL CHECK (payment_method IN ('paypal', 'paytoday', 'bank_transfer')),
  payment_status VARCHAR(50) DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;

-- Policy for service role to manage donations
CREATE POLICY "Service role can manage donations" ON donations
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Policy for public to insert donations
CREATE POLICY "Allow public insert donations" ON donations
  FOR INSERT
  WITH CHECK (true);
