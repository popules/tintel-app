-- Add link column to notifications table
ALTER TABLE public.notifications 
ADD COLUMN IF NOT EXISTS link TEXT;

-- Update the comment for 'type' to include 'match'
COMMENT ON COLUMN public.notifications.type IS 'signal, info, alert, match';
