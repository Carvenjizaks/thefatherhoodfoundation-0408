-- Enable all pages to be publicly visible
UPDATE page_settings SET is_visible = true;

-- Confirm results
SELECT page_path, page_name, is_visible FROM page_settings ORDER BY page_path;
