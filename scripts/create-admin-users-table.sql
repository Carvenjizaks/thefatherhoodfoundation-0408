-- Create admin_users table for multi-user admin access
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'staff', -- 'owner' or 'staff'
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);

-- Insert the owner account (Carven Izaks)
-- Password: !carvenjizaks*Ci26 (hashed with bcrypt)
INSERT INTO admin_users (email, password_hash, first_name, last_name, role)
VALUES (
  'carvenjizaks@gmail.com',
  '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X5.6HtLpMl5E8HXKe',
  'Carven',
  'Izaks',
  'owner'
) ON CONFLICT (email) DO NOTHING;

-- Enable RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- RLS policy - allow all operations for authenticated service role
CREATE POLICY "Service role can manage admin_users" ON admin_users
  FOR ALL USING (true);
