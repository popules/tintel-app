-- 1. DROP the "Invite Only" blocking trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.check_allowed_email();

-- 2. Add 'role' column to profiles if missing (for easier querying)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role text default 'recruiter';

-- 3. Upgrade the New User Handler
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  user_role text;
  user_full_name text;
  user_avatar text;
BEGIN
  -- Extract metadata
  user_role := COALESCE(new.raw_user_meta_data->>'role', 'recruiter'); -- Default to recruiter
  user_full_name := new.raw_user_meta_data->>'full_name';
  user_avatar := new.raw_user_meta_data->>'avatar_url';

  -- Insert into PROFILES (Main Identity)
  INSERT INTO public.profiles (
    id, 
    full_name, 
    avatar_url, 
    role, 
    membership_tier, 
    credits_remaining
  )
  VALUES (
    new.id, 
    user_full_name, 
    user_avatar, 
    user_role,
    CASE 
      WHEN user_role = 'candidate' THEN 'candidate' 
      ELSE 'free_trial' -- Recruiters start on Free Trial
    END,
    CASE 
      WHEN user_role = 'candidate' THEN 0 
      ELSE 5 -- Recruiters get 5 free credits
    END
  );

  -- If Candidate, Init Candidate Table
  IF user_role = 'candidate' THEN
    INSERT INTO public.candidates (id, created_at)
    VALUES (new.id, now())
    ON CONFLICT (id) DO NOTHING;
  END IF;

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Re-attach the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 5. Create "Welcome Email" Queue (Optional foundation for future emails)
CREATE TABLE IF NOT EXISTS public.email_queue (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users NOT NULL,
    email_type TEXT NOT NULL, -- 'welcome_candidate', 'welcome_recruiter'
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Trigger to log welcome email
CREATE OR REPLACE FUNCTION public.queue_welcome_email()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.email_queue (user_id, email_type)
  VALUES (
    new.id, 
    CASE 
      WHEN new.role = 'candidate' THEN 'welcome_candidate' 
      ELSE 'welcome_recruiter' 
    END
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_profile_created
  AFTER INSERT ON public.profiles
  FOR EACH ROW EXECUTE PROCEDURE public.queue_welcome_email();
