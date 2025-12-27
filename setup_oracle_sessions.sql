-- Create oracle_sessions table to store AI interviews
create type oracle_session_status as enum ('active', 'completed', 'abandoned');

create table oracle_sessions (
    id uuid default gen_random_uuid() primary key,
    candidate_id uuid references auth.users(id) not null,
    job_id bigint references job_posts(id) not null,
    status oracle_session_status default 'active',
    
    -- Structure: [{role: 'user'|'assistant', content: string, timestamp: string}]
    chat_history jsonb default '[]'::jsonb,
    
    -- Snapshot of market stats at the time of interview (Salary stats, Hiring Velocity)
    -- This ensures the "Consultant" context remains consistent even if live data changes.
    market_context_snapshot jsonb default '{}'::jsonb,
    
    -- The output for the Recruiter
    screening_analysis jsonb default '{}'::jsonb,
    
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- Enable RLS
alter table oracle_sessions enable row level security;

-- Candidates can see their own sessions
create policy "Candidates can view own sessions"
    on oracle_sessions for select
    using (auth.uid() = candidate_id);

-- Candidates can insert their own sessions
create policy "Candidates can create sessions"
    on oracle_sessions for insert
    with check (auth.uid() = candidate_id);

-- Candidates can update their own sessions (to append chat)
create policy "Candidates can update own sessions"
    on oracle_sessions for update
    using (auth.uid() = candidate_id);

-- Timestamps trigger
create trigger update_oracle_sessions_modtime
    before update on oracle_sessions
    for each row execute procedure update_modified_column();
