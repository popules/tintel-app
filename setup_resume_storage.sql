-- Create a new storage bucket for resumes
insert into storage.buckets (id, name, public)
values ('resumes', 'resumes', false)
on conflict (id) do nothing;

-- Remove existing policies to avoid conflicts
drop policy if exists "Users can upload their own resume" on storage.objects;
drop policy if exists "Users can update their own resume" on storage.objects;
drop policy if exists "Users can read their own resume" on storage.objects;
drop policy if exists "Users can delete their own resume" on storage.objects;

-- Policy: Users can upload their own resume
create policy "Users can upload their own resume"
on storage.objects for insert
with check ( bucket_id = 'resumes' and auth.uid() = owner );

-- Policy: Users can update their own resume
create policy "Users can update their own resume"
on storage.objects for update
using ( bucket_id = 'resumes' and auth.uid() = owner );

-- Policy: Users can read their own resume
create policy "Users can read their own resume"
on storage.objects for select
using ( bucket_id = 'resumes' and auth.uid() = owner );

-- Policy: Users can delete their own resume
create policy "Users can delete their own resume"
on storage.objects for delete
using ( bucket_id = 'resumes' and auth.uid() = owner );

-- Add resume_url column to candidates table if it doesn't exist
alter table public.candidates
add column if not exists resume_url text;
