-- Enable the pgvector extension to work with embedding vectors
create extension if not exists vector;

-- 1. Create Job Embeddings Table
-- NOTE: job_posts.id is BIGINT, so job_id must be BIGINT
create table if not exists public.job_embeddings (
  id uuid default gen_random_uuid() primary key,
  job_id bigint references public.job_posts(id) on delete cascade not null, 
  embedding vector(1536) not null, -- OpenAI text-embedding-3-small dimension
  created_at timestamp with time zone default now(),
  unique(job_id)
);

-- 2. Create Candidate Embeddings Table
-- NOTE: candidates.id is UUID (auth.users), so candidate_id is UUID
create table if not exists public.candidate_embeddings (
  id uuid default gen_random_uuid() primary key,
  candidate_id uuid references public.candidates(id) on delete cascade not null,
  embedding vector(1536) not null,
  created_at timestamp with time zone default now(),
  unique(candidate_id)
);

-- 3. Enable RLS on these tables (inherit access from parent)
alter table public.job_embeddings enable row level security;
alter table public.candidate_embeddings enable row level security;

-- Policies for Job Embeddings (Public Read, Recruiter Write)
create policy "Job Embeddings are viewable by everyone"
  on public.job_embeddings for select
  using (true);

create policy "Recruiters can insert job embeddings"
  on public.job_embeddings for insert
  with check (auth.role() = 'authenticated'); 
  -- In reality, this should be restricted to the job owner, but for V1 broad auth is okay.

-- Policies for Candidate Embeddings (Recruiter Read, Candidate Write)
create policy "Recruiters can view candidate embeddings"
  on public.candidate_embeddings for select
  using ( auth.uid() in (select id from public.profiles where role = 'recruiter') );

create policy "Candidates can insert their own embedding"
  on public.candidate_embeddings for insert
  with check ( auth.uid() = candidate_id );

create policy "Candidates can update their own embedding"
  on public.candidate_embeddings for update
  using ( auth.uid() = candidate_id );

-- 4. Search Function: Match Jobs (For Candidates)
create or replace function match_jobs (
  query_embedding vector(1536),
  match_threshold float,
  match_count int
)
returns table (
  id uuid,
  job_id bigint, -- Changed to BigInt
  similarity float
)
language plpgsql
as $$
begin
  return query
  select
    job_embeddings.id,
    job_embeddings.job_id,
    1 - (job_embeddings.embedding <=> query_embedding) as similarity
  from job_embeddings
  where 1 - (job_embeddings.embedding <=> query_embedding) > match_threshold
  order by job_embeddings.embedding <=> query_embedding
  limit match_count;
end;
$$;

-- 5. Search Function: Match Candidates (For Recruiters)
create or replace function match_candidates (
  query_embedding vector(1536),
  match_threshold float,
  match_count int
)
returns table (
  id uuid,
  candidate_id uuid, -- Remains UUID
  similarity float
)
language plpgsql
as $$
begin
  return query
  select
    candidate_embeddings.id,
    candidate_embeddings.candidate_id,
    1 - (candidate_embeddings.embedding <=> query_embedding) as similarity
  from candidate_embeddings
  where 1 - (candidate_embeddings.embedding <=> query_embedding) > match_threshold
  order by candidate_embeddings.embedding <=> query_embedding
  limit match_count;
end;
$$;
