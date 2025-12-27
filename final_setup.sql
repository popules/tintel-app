-- 1. Add monetization columns to candidates table
ALTER TABLE public.candidates
ADD COLUMN IF NOT EXISTS oracle_credits INTEGER DEFAULT 10,
ADD COLUMN IF NOT EXISTS is_premium BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT DEFAULT NULL;

COMMENT ON COLUMN public.candidates.oracle_credits IS 'Number of AI chat messages remaining';
COMMENT ON COLUMN public.candidates.is_premium IS 'Whether the candidate has an active Pro subscription';


-- 2. Create RPC function for safe credit updates
-- Use: await supabase.rpc('increment_credits', { user_id: '...', amount: -1 })
CREATE OR REPLACE FUNCTION increment_credits(user_id UUID, amount INTEGER)
RETURNS VOID AS $$
BEGIN
  UPDATE public.candidates
  SET oracle_credits = COALESCE(oracle_credits, 0) + amount
  WHERE id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
