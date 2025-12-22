-- monitored_companies.sql
CREATE TABLE IF NOT EXISTS monitored_companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    company_name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, company_name)
);

ALTER TABLE monitored_companies ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage their own monitored companies" ON monitored_companies;
CREATE POLICY "Users can manage their own monitored companies"
ON monitored_companies
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
