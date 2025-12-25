-- Updated Credit & Subscription System
-- Supports both "Pay-per-unlock" and "Unlimited Subscription"

-- 1. Add Subscription Columns
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS subscription_tier TEXT DEFAULT 'free', -- 'free', 'pro', 'enterprise'
ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'inactive'; -- 'active', 'inactive', 'past_due'

-- 2. Update the unlock_candidate function to handle Subscriptions
CREATE OR REPLACE FUNCTION unlock_candidate(target_candidate_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    current_credits INTEGER;
    current_tier TEXT;
    current_status TEXT;
    recruiter_uid UUID;
BEGIN
    recruiter_uid := auth.uid();

    -- Check if already unlocked
    IF EXISTS (SELECT 1 FROM public.unlocks WHERE recruiter_id = recruiter_uid AND candidate_id = target_candidate_id) THEN
        RETURN jsonb_build_object('success', true, 'message', 'Already unlocked', 'source', 'history');
    END IF;

    -- Get recruiter profile data
    SELECT credits, subscription_tier, subscription_status 
    INTO current_credits, current_tier, current_status 
    FROM public.profiles 
    WHERE id = recruiter_uid;

    -- CHECK 1: Is user a Subscriber? (Unlimited Access)
    IF current_tier IN ('pro', 'enterprise') AND current_status = 'active' THEN
        -- Allow access without deducting credits
        INSERT INTO public.unlocks (recruiter_id, candidate_id)
        VALUES (recruiter_uid, target_candidate_id);
        
        RETURN jsonb_build_object(
            'success', true, 
            'message', 'Unlocked via Subscription', 
            'remaining', current_credits,
            'source', 'subscription'
        );
    END IF;

    -- CHECK 2: Does user have credits?
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

    RETURN jsonb_build_object(
        'success', true, 
        'remaining', current_credits - 1,
        'source', 'credit'
    );
END;
$$;
