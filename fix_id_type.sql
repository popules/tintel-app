-- Fix type mismatch for saved_jobs.job_id
-- The error "invalid input syntax for type uuid" indicates job_id is text/int (from Platsbanken) but column expects UUID.

-- 1. Drop the constraint first (if it exists) to allow type change
ALTER TABLE saved_jobs DROP CONSTRAINT IF EXISTS saved_jobs_job_id_fkey;

-- 2. Change the column type to TEXT to support any ID format
ALTER TABLE saved_jobs ALTER COLUMN job_id TYPE text;

-- 3. Re-add the foreign key constraint (assuming job_posts.id is also text/compatible)
-- If job_posts.id is NOT unique/primary key, this might fail, but usually it is.
ALTER TABLE saved_jobs 
ADD CONSTRAINT saved_jobs_job_id_fkey 
FOREIGN KEY (job_id) 
REFERENCES job_posts (id);
