-- Add missing years_of_experience column to candidates table
ALTER TABLE public.candidates 
ADD COLUMN IF NOT EXISTS years_of_experience INTEGER;

-- Ensure it's accessible to the user
GRANT ALL ON TABLE public.candidates TO authenticated;
