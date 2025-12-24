-- Ensure Row Level Security is enabled
ALTER TABLE public.candidates ENABLE ROW LEVEL SECURITY;

-- 1. Candidates can VIEW their own profile (Existing, but good to ensure)
DROP POLICY IF EXISTS "Candidates can view own profile" ON public.candidates;
CREATE POLICY "Candidates can view own profile"
ON public.candidates FOR SELECT
USING (auth.uid() = id);

-- 2. Candidates can UPDATE their own profile
DROP POLICY IF EXISTS "Candidates can update own profile" ON public.candidates;
CREATE POLICY "Candidates can update own profile"
ON public.candidates FOR UPDATE
USING (auth.uid() = id);

-- 3. Candidates can INSERT their own profile
DROP POLICY IF EXISTS "Candidates can insert own profile" ON public.candidates;
CREATE POLICY "Candidates can insert own profile"
ON public.candidates FOR INSERT
WITH CHECK (auth.uid() = id);

-- 4. RECRUITERS can VIEW ALL profiles (The missing piece!)
DROP POLICY IF EXISTS "Recruiters can view all candidates" ON public.candidates;
CREATE POLICY "Recruiters can view all candidates"
ON public.candidates FOR SELECT
USING ( 
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'recruiter'
  )
);
