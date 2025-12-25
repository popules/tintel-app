-- Create applications table for tracking candidate job pipeline
create table if not exists applications (
  id uuid default gen_random_uuid() primary key,
  candidate_id uuid references candidates(id) on delete cascade not null,
  
  -- We rely on the external job ID, but we also snapshot the data 
  -- because scraped jobs might disappear or change.
  job_id text not null, 
  job_title text not null,
  company_name text not null,
  job_url text, -- The external link they clicked
  
  -- Snapshot of full job data (optional, for "Context" view later)
  job_data jsonb default '{}'::jsonb,
  
  -- Pipeline Status
  status text default 'applied' check (status in ('saved', 'applied', 'interview', 'offer', 'rejected', 'ghosted')),
  
  -- User notes
  notes text,
  
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- RLS
alter table applications enable row level security;

-- Candidates can view/manage THEIR OWN applications
create policy "Candidates can view own applications"
  on applications for select
  using ( auth.uid() = candidate_id );

create policy "Candidates can insert own applications"
  on applications for insert
  with check ( auth.uid() = candidate_id );

create policy "Candidates can update own applications"
  on applications for update
  using ( auth.uid() = candidate_id );

create policy "Candidates can delete own applications"
  on applications for delete
  using ( auth.uid() = candidate_id );

-- Indexes for performance
create index applications_candidate_id_idx on applications(candidate_id);
create index applications_status_idx on applications(status);
