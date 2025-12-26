-- Update unlock_candidate to respect Pro subscription (Unlimited)

CREATE OR REPLACE FUNCTION unlock_candidate(target_candidate_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    current_credits INTEGER;
    user_tier TEXT;
    recruiter_uid UUID;
BEGIN
    recruiter_uid := auth.uid();

    -- Check if already unlocked
    IF EXISTS (SELECT 1 FROM public.unlocks WHERE recruiter_id = recruiter_uid AND candidate_id = target_candidate_id) THEN
        RETURN jsonb_build_object('success', true, 'message', 'Already unlocked', 'source', 'existing');
    END IF;

    -- Get profile data (credits AND subscription_tier)
    SELECT credits, subscription_tier INTO current_credits, user_tier 
    FROM public.profiles 
    WHERE id = recruiter_uid;

    -- IF PRO: Bypass credit check, don't deduct
    IF user_tier = 'pro' THEN
         -- Record unlock
        INSERT INTO public.unlocks (recruiter_id, candidate_id)
        VALUES (recruiter_uid, target_candidate_id);
    
        RETURN jsonb_build_object('success', true, 'remaining', current_credits, 'source', 'subscription');
    END IF;

    -- IF FREE/STARTER: Deduct credits
    IF current_credits < 1 THEN
        RETURN jsonb_build_object('success', false, 'message', 'nsufficient_credits');
    END IF;

    -- Deduct credit
    UPDATE public.profiles 
    SET credits = credits - 1 
    WHERE id = recruiter_uid;

    -- Record unlock
    INSERT INTO public.unlocks (recruiter_id, candidate_id)
    VALUES (recruiter_uid, target_candidate_id);

    RETURN jsonb_build_object('success', true, 'remaining', current_credits - 1, 'source', 'credit');
END;
$$;
