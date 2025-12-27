-- Function to get unique locations from active jobs (last 30 days)
CREATE OR REPLACE FUNCTION get_active_job_locations()
RETURNS TABLE (county text, location text)
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT DISTINCT county, location
  FROM job_posts
  WHERE created_at > (now() - interval '30 days')
  AND county IS NOT NULL
  AND location IS NOT NULL
  ORDER BY county, location;
$$;

-- Function to get unique categories from active jobs
CREATE OR REPLACE FUNCTION get_active_job_categories()
RETURNS TABLE (category text)
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT DISTINCT broad_category as category
  FROM job_posts
  WHERE created_at > (now() - interval '30 days')
  AND broad_category IS NOT NULL
  ORDER BY broad_category;
$$;
