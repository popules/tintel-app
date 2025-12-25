-- Allow users to insert their own profile (fix for FK constraints during onboarding)
drop policy if exists "Users can insert their own profile." on profiles;
create policy "Users can insert their own profile."
on profiles for insert
with check ( auth.uid() = id );

-- Ensure update is allowed too for upserts
drop policy if exists "Users can update own profile." on profiles;
create policy "Users can update own profile."
on profiles for update
using ( auth.uid() = id );

-- Ensure select is allowed (needed for upsert conflict check)
drop policy if exists "Public profiles are viewable by everyone." on profiles;
create policy "Public profiles are viewable by everyone."
on profiles for select
using ( true );
