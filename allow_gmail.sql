-- Whitelist your Gmail account for Candidate Signup
INSERT INTO public.allowed_emails (email) VALUES ('aberg.anton@gmail.com');

-- OPTIONAL: If you want to use your 'anton@tintel.se' for the Candidate Portal, 
-- you need to change its role from 'recruiter' to 'candidate'.
-- UPDATE auth.users SET raw_user_meta_data = jsonb_set(raw_user_meta_data, '{role}', '"candidate"') WHERE email = 'anton@tintel.se';
-- UPDATE public.profiles SET role = 'candidate' WHERE id = (SELECT id FROM auth.users WHERE email = 'anton@tintel.se');
