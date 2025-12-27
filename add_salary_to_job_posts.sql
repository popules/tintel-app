-- Add Salary Intelligence Columns
-- These will be populated by our AI "Pricer" Engine

ALTER TABLE job_posts 
ADD COLUMN IF NOT EXISTS salary_min INT,
ADD COLUMN IF NOT EXISTS salary_max INT,
ADD COLUMN IF NOT EXISTS salary_currency TEXT DEFAULT 'SEK',
ADD COLUMN IF NOT EXISTS salary_period TEXT DEFAULT 'MONTHLY'; -- MONTHLY, HOURLY, YEARLY

-- Add an index to allow filtering by salary logic later
CREATE INDEX IF NOT EXISTS job_posts_salary_min_idx ON job_posts (salary_min);
CREATE INDEX IF NOT EXISTS job_posts_salary_max_idx ON job_posts (salary_max);

-- Comment for clarity
COMMENT ON COLUMN job_posts.salary_min IS 'AI-estimated minimum salary in currency';
COMMENT ON COLUMN job_posts.salary_max IS 'AI-estimated maximum salary in currency';
