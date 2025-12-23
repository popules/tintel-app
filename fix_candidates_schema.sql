-- Add potentially missing columns to the candidates table
ALTER TABLE public.candidates 
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS linkedin_url TEXT,
ADD COLUMN IF NOT EXISTS website TEXT,
ADD COLUMN IF NOT EXISTS cv_url TEXT;

-- Verify RLS policies exist (Just logically, no-op if exists)
-- This ensures you can actually INSERT/UPDATE your own row
-- (Copying from marketplace_schema.sql just in case)
DROP POLICY IF EXISTS "Candidates can insert own profile" ON candidates;
CREATE POLICY "Candidates can insert own profile" ON candidates FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Candidates can update own profile" ON candidates;
CREATE POLICY "Candidates can update own profile" ON candidates FOR UPDATE USING (auth.uid() = id);

-- Just for sanity, allow select for own profile
DROP POLICY IF EXISTS "Candidates can view own profile" ON candidates;
CREATE POLICY "Candidates can view own profile" ON candidates FOR SELECT USING (auth.uid() = id);
