-- Add status column to saved_jobs if it doesn't exist
ALTER TABLE saved_jobs 
ADD COLUMN IF NOT EXISTS status text DEFAULT 'new';

-- Add pitch column to saved_jobs if it doesn't exist (for future use)
ALTER TABLE saved_jobs
ADD COLUMN IF NOT EXISTS pitch text;

-- Create an index on status for faster filtering
CREATE INDEX IF NOT EXISTS idx_saved_jobs_status ON saved_jobs(status);
