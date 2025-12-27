-- Add monetization columns to candidates table

ALTER TABLE public.candidates
ADD COLUMN IF NOT EXISTS oracle_credits INTEGER DEFAULT 10,
ADD COLUMN IF NOT EXISTS is_premium BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS strip_customer_id TEXT DEFAULT NULL;

COMMENT ON COLUMN public.candidates.oracle_credits IS 'Number of AI chat messages remaining';
COMMENT ON COLUMN public.candidates.is_premium IS 'Whether the candidate has an active Pro subscription';
