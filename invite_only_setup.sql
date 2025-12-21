-- Create a table for invited emails
CREATE TABLE IF NOT EXISTS public.allowed_emails (
    email TEXT PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.allowed_emails ENABLE ROW LEVEL SECURITY;

-- Only let authenticated users read (or maybe only admins, but for now simple read)
CREATE POLICY "Anyone can check if an email is allowed" ON public.allowed_emails
    FOR SELECT USING (true);

-- ADD YOUR EMAIL HERE TO TEST
-- INSERT INTO public.allowed_emails (email) VALUES ('your-email@example.com');
