-- Add territory management to profiles
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS territories TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS home_city TEXT;

-- Update RLS policies to ensure user can update their territories
-- (Existing policies on profiles likely cover this, but good to verify)
