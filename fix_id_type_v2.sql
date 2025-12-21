-- Fix type mismatch for saved_jobs.job_id
-- Error confirmed: job_posts.id is BIGINT. saved_jobs.job_id must also be BIGINT.

-- 1. Drop the constraint
ALTER TABLE saved_jobs DROP CONSTRAINT IF EXISTS saved_jobs_job_id_fkey;

-- 2. Change the column type to BIGINT
-- We cast via text to handle potential uuid-string to number conversions if needed, though usually just ::bigint works.
-- If this fails due to non-numeric data, we might need to truncate saved_jobs first:
-- TRUNCATE TABLE saved_jobs; 
ALTER TABLE saved_jobs ALTER COLUMN job_id TYPE bigint USING job_id::text::bigint;

-- 3. Re-add the foreign key constraint
ALTER TABLE saved_jobs 
ADD CONSTRAINT saved_jobs_job_id_fkey 
FOREIGN KEY (job_id) 
REFERENCES job_posts (id);
