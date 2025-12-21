-- Enable RLS on saved_jobs (if not already)
ALTER TABLE saved_jobs ENABLE ROW LEVEL SECURITY;

-- Allow users to insert their own saved jobs
CREATE POLICY "Users can insert their own saved jobs" 
ON saved_jobs FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Allow users to view their own saved jobs
CREATE POLICY "Users can view their own saved jobs" 
ON saved_jobs FOR SELECT 
USING (auth.uid() = user_id);

-- Allow users to delete their own saved jobs
CREATE POLICY "Users can delete their own saved jobs" 
ON saved_jobs FOR DELETE 
USING (auth.uid() = user_id);

-- Allow users to update their own saved jobs (for status changes)
CREATE POLICY "Users can update their own saved jobs" 
ON saved_jobs FOR UPDATE 
USING (auth.uid() = user_id);
