-- 1. Update the role constraint to allow 'admin'
ALTER TABLE public.profiles 
DROP CONSTRAINT IF EXISTS profiles_role_check;

ALTER TABLE public.profiles 
ADD CONSTRAINT profiles_role_check 
CHECK (role IN ('recruiter', 'candidate', 'admin'));

-- 2. Promote anton@tintel.se to admin
-- We find the user ID from auth.users and update public.profiles
UPDATE public.profiles
SET role = 'admin'
WHERE id = (SELECT id FROM auth.users WHERE email = 'anton@tintel.se');

-- 3. Also update the metadata in auth.users so the token has the correct role
UPDATE auth.users 
SET raw_user_meta_data = raw_user_meta_data || '{"role": "admin"}'::jsonb
WHERE email = 'anton@tintel.se';
