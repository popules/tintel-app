-- Add structured data columns for The Smooth CV 2.0
ALTER TABLE public.candidates 
ADD COLUMN IF NOT EXISTS work_experience JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS education JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS languages JSONB DEFAULT '[]'::jsonb;

-- Comment on columns for clarity
COMMENT ON COLUMN public.candidates.work_experience IS 'Array of {company, role, start_date, end_date, description}';
COMMENT ON COLUMN public.candidates.education IS 'Array of {school, degree, start_date, end_date}';
