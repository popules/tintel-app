-- Create a table for saved jobs
create table saved_jobs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  job_id uuid not null, -- Assuming job_id comes from your jobs source, might not be a foreign key if jobs are external or in a different table structure
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  job_data jsonb -- Optional: cache job details if jobs might disappear
);

-- Enable RLS
alter table saved_jobs enable row level security;

-- Policies
create policy "Users can insert their own saved jobs"
  on saved_jobs for insert
  with check (auth.uid() = user_id);

create policy "Users can view their own saved jobs"
  on saved_jobs for select
  using (auth.uid() = user_id);

create policy "Users can delete their own saved jobs"
  on saved_jobs for delete
  using (auth.uid() = user_id);

-- Create a unique constraint to prevent duplicate saves
create unique index saved_jobs_user_job_idx on saved_jobs (user_id, job_id);
