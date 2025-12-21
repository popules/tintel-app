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

-- 4. Policies
-- Anyone can read their own request status or check if whitelisted (simplified)
CREATE POLICY "Anyone can check whitelist" ON public.allowed_emails FOR SELECT USING (true);
CREATE POLICY "Anyone can submit a request" ON public.access_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can check their own request" ON public.access_requests FOR SELECT USING (true);

-- 5. BACKEND GUARD (TRIGGER)
-- Stops any signup for an email NOT in the allowed_emails table.
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

-- 6. HELPER: APPROVAL FUNCTION
-- You can run this in SQL to approve a request:
-- INSERT INTO allowed_emails (email) SELECT email FROM access_requests WHERE email = 'target@example.com';
-- UPDATE access_requests SET status = 'approved' WHERE email = 'target@example.com';
