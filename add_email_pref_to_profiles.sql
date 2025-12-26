
-- Add email notification preferences to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS email_notification_enabled BOOLEAN DEFAULT TRUE;

-- Comment
COMMENT ON COLUMN public.profiles.email_notification_enabled IS 'Whether the user wants to receive daily email digests';
