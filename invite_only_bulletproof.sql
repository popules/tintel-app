-- 1. Table for whitelisted (invited) emails
CREATE TABLE IF NOT EXISTS public.allowed_emails (
    email TEXT PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Table for access requests (the "Waitlist")
CREATE TABLE IF NOT EXISTS public.access_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Enable RLS
ALTER TABLE public.allowed_emails ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.access_requests ENABLE ROW LEVEL SECURITY;

-- 4. Policies (Safely recreated)
DROP POLICY IF EXISTS "Anyone can check whitelist" ON public.allowed_emails;
CREATE POLICY "Anyone can check whitelist" ON public.allowed_emails FOR SELECT USING (true);

DROP POLICY IF EXISTS "Anyone can submit a request" ON public.access_requests;
CREATE POLICY "Anyone can submit a request" ON public.access_requests FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can check their own request" ON public.access_requests;
CREATE POLICY "Anyone can check their own request" ON public.access_requests FOR SELECT USING (true);

-- 5. BACKEND GUARD (TRIGGER)
CREATE OR REPLACE FUNCTION public.check_allowed_email()
RETURNS TRIGGER AS $$
BEGIN
    IF EXISTS (SELECT 1 FROM public.allowed_emails WHERE email = NEW.email) THEN
        RETURN NEW;
    ELSE
        RAISE EXCEPTION 'Tintel is in private beta. Your email must be whitelisted before signing up.';
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    BEFORE INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.check_allowed_email();

-- 6. ADD YOURSELF TO TEST
INSERT INTO public.allowed_emails (email) VALUES ('anton@tintel.se') 
ON CONFLICT (email) DO NOTHING;
