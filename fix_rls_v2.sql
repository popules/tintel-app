-- Drop policies if they exist to avoid duplication error
DROP POLICY IF EXISTS "Users can insert their own saved jobs" ON saved_jobs;
DROP POLICY IF EXISTS "Users can view their own saved jobs" ON saved_jobs;
DROP POLICY IF EXISTS "Users can delete their own saved jobs" ON saved_jobs;
DROP POLICY IF EXISTS "Users can update their own saved jobs" ON saved_jobs;

-- Enable RLS on saved_jobs (if not already)
ALTER TABLE saved_jobs ENABLE ROW LEVEL SECURITY;

-- Re-create policies
CREATE POLICY "Users can insert their own saved jobs" 
ON saved_jobs FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own saved jobs" 
ON saved_jobs FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own saved jobs" 
ON saved_jobs FOR DELETE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own saved jobs" 
ON saved_jobs FOR UPDATE 
USING (auth.uid() = user_id);
