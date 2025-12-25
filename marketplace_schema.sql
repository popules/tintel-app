-- 1. Add Role to Profiles
-- Default to 'recruiter' for backward compatibility
alter table profiles 
add column if not exists role text default 'recruiter' check (role in ('recruiter', 'candidate', 'admin'));

-- 2. Create Candidates Table (Extension of Profile)
create table if not exists candidates (
  id uuid references profiles(id) not null primary key,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  
  -- The "Smooth Profile" Data
  headline text, -- e.g. "Senior Carpenter"
  bio text,      -- AI enhanced summary
  location text, -- e.g. "Stockholm"
  experience_years int default 0,
  skills text[], -- Array of strings e.g. ['Framing', 'Drywall']
  
  -- Status
  is_open boolean default true, -- Visible in search?
  
  -- Metadata
  linkedin_url text,
  phone text
);

-- 3. Enable RLS
alter table candidates enable row level security;

-- 4. RLS Policies

-- Public/Recruiters can view OPEN candidates
create policy "Recruiters can view open candidates" 
on candidates for select 
using (is_open = true);

-- Candidates can manage their own profile
create policy "Candidates can insert own profile" 
on candidates for insert 
with check (auth.uid() = id);

create policy "Candidates can update own profile" 
on candidates for update 
using (auth.uid() = id);

create policy "Candidates can view own profile" 
on candidates for select 
using (auth.uid() = id);

-- 5. Create specialized index for Skill Search (Array)
create index if not exists candidates_skills_idx on candidates using gin (skills);

-- 6. Update User Trigger to handle Role
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url, role)
  values (
    new.id, 
    new.raw_user_meta_data->>'full_name', 
    new.raw_user_meta_data->>'avatar_url',
    coalesce(new.raw_user_meta_data->>'role', 'recruiter') -- Default to recruiter
  );
  return new;
end;
$$ language plpgsql security definer;
