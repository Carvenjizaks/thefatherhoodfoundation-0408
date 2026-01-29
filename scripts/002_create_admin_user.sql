-- Create Admin User Script
-- This script should be run AFTER the user signs up through the auth UI
-- Replace YOUR_USER_ID with the actual UUID from auth.users after signup

-- First, you need to sign up at: /auth/sign-up with:
-- Email: carvenjiz@gmail.com
-- Password: Admin@123

-- After signup, find your user ID by running:
-- SELECT id FROM auth.users WHERE email = 'carvenjiz@gmail.com';

-- Then create your organization (replace YOUR_USER_ID with actual UUID):
INSERT INTO public.organizations (name, subdomain, created_by)
VALUES (
  'NexiumDigital',
  'nexiumdigital',
  'YOUR_USER_ID'
) RETURNING id;

-- Copy the organization ID from above, then create your profile:
INSERT INTO public.profiles (
  id,
  email,
  full_name,
  role,
  organization_id,
  is_active,
  phone_number
) VALUES (
  'YOUR_USER_ID',
  'carvenjiz@gmail.com',
  'Main Administrator',
  'admin',
  'YOUR_ORG_ID',
  true,
  NULL
);

-- Verify the setup:
SELECT 
  p.id,
  p.email,
  p.full_name,
  p.role,
  o.name as organization_name,
  o.subdomain
FROM public.profiles p
JOIN public.organizations o ON p.organization_id = o.id
WHERE p.email = 'carvenjiz@gmail.com';
