-- Credit System Migration

-- 1. Add credits column to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS credits INTEGER DEFAULT 3;

-- 2. Add unlocks table to track who unlocked whom (deduplication)
CREATE TABLE IF NOT EXISTS public.unlocks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recruiter_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    candidate_id UUID REFERENCES public.candidates(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    UNIQUE(recruiter_id, candidate_id)
);

-- Enable RLS logic
ALTER TABLE public.unlocks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Recruiters can view their unlocks"
    ON public.unlocks FOR SELECT
    USING (auth.uid() = recruiter_id);

-- 3. Secure RPC to unlock a candidate
CREATE OR REPLACE FUNCTION unlock_candidate(target_candidate_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    current_credits INTEGER;
    recruiter_uid UUID;
BEGIN
    recruiter_uid := auth.uid();

    -- Check if already unlocked
    IF EXISTS (SELECT 1 FROM public.unlocks WHERE recruiter_id = recruiter_uid AND candidate_id = target_candidate_id) THEN
        RETURN jsonb_build_object('success', true, 'message', 'Already unlocked');
    END IF;

    -- Get current credits
    SELECT credits INTO current_credits FROM public.profiles WHERE id = recruiter_uid;

    IF current_credits < 1 THEN
        RETURN jsonb_build_object('success', false, 'message', 'Insufficient credits');
    END IF;

    -- Deduct credit
    UPDATE public.profiles 
    SET credits = credits - 1 
    WHERE id = recruiter_uid;

    -- Record unlock
    INSERT INTO public.unlocks (recruiter_id, candidate_id)
    VALUES (recruiter_uid, target_candidate_id);

    RETURN jsonb_build_object('success', true, 'remaining', current_credits - 1);
END;
$$;
