-- Seed page_settings with all site pages
-- All pages default to is_visible = true (enabled)

INSERT INTO page_settings (page_path, page_name, is_visible, hidden_message, updated_at)
VALUES
  ('/', 'Home', true, 'This page is currently under maintenance. Please check back soon.', NOW()),
  ('/about', 'About', true, 'This page is currently under maintenance. Please check back soon.', NOW()),
  ('/curriculum', 'Curriculum for Men', true, 'This page is currently under maintenance. Please check back soon.', NOW()),
  ('/curriculum/sign-up', 'Curriculum Sign Up', true, 'This page is currently under maintenance. Please check back soon.', NOW()),
  ('/mentoring-men', 'Monthly Table Talk for Men', true, 'This page is currently under maintenance. Please check back soon.', NOW()),
  ('/active-parenting', 'ActiveParenting', false, 'The ActiveParenting program page is coming soon. Stay tuned!', NOW()),
  ('/my-great-marriage', 'MyGreatMarriage', true, 'This page is currently under maintenance. Please check back soon.', NOW()),
  ('/community-development', 'Social Impact', true, 'This page is currently under maintenance. Please check back soon.', NOW()),
  ('/partnership', 'Partnership & Giving', true, 'This page is currently under maintenance. Please check back soon.', NOW()),
  ('/gideon300', 'Gideon300', true, 'This page is currently under maintenance. Please check back soon.', NOW()),
  ('/get-involved', 'Get Involved', true, 'This page is currently under maintenance. Please check back soon.', NOW()),
  ('/donate', 'Donate', true, 'This page is currently under maintenance. Please check back soon.', NOW()),
  ('/events', 'Events', true, 'This page is currently under maintenance. Please check back soon.', NOW()),
  ('/contact', 'Contact', true, 'This page is currently under maintenance. Please check back soon.', NOW()),
  ('/blog', 'Blog', true, 'This page is currently under maintenance. Please check back soon.', NOW()),
  ('/privacy-policy', 'Privacy Policy', true, 'This page is currently under maintenance. Please check back soon.', NOW()),
  ('/terms-of-service', 'Terms of Service', true, 'This page is currently under maintenance. Please check back soon.', NOW())
ON CONFLICT (page_path) DO UPDATE
  SET page_name = EXCLUDED.page_name,
      updated_at = NOW();
