-- Create feedback_responses table
CREATE TABLE IF NOT EXISTS feedback_responses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  challenge TEXT NOT NULL,
  urgency INTEGER NOT NULL CHECK (urgency >= 1 AND urgency <= 10),
  category TEXT NOT NULL,
  comments TEXT,
  anonymous BOOLEAN DEFAULT true,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_feedback_submitted_at ON feedback_responses(submitted_at DESC);
CREATE INDEX IF NOT EXISTS idx_feedback_category ON feedback_responses(category);
CREATE INDEX IF NOT EXISTS idx_feedback_urgency ON feedback_responses(urgency);

-- Enable RLS (Row Level Security)
ALTER TABLE feedback_responses ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anonymous inserts
CREATE POLICY "Allow anonymous inserts" ON feedback_responses
  FOR INSERT WITH CHECK (true);

-- Create policy to allow admin read access
CREATE POLICY "Allow admin read access" ON feedback_responses
  FOR SELECT USING (true);