-- Add preferred_language to profiles
alter table public.profiles 
add column if not exists preferred_language text default 'sv' check (preferred_language in ('en', 'sv'));

-- Comment on column
comment on column public.profiles.preferred_language is 'User preferred language for email and UI (en/sv)';
