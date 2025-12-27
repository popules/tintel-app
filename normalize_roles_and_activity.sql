-- 1. Normalize Roles (Strict Lowercase)
-- This ensures 'Candidate', 'CANDIDATE', and 'candidate' are all treated effectively as 'candidate'
UPDATE profiles 
SET role = lower(role);

-- Optional: Add a check constraint to prevent future bad data (if supported by your setup)
-- ALTER TABLE profiles ADD CONSTRAINT role_lowercase_check CHECK (role = lower(role));


-- 2. Activity Tracking for "Poaching Signals"
-- We add a specific 'last_active_at' timestamp to the candidates table.
-- This allows us to sort candidates by "Freshness" in the recruiter dashboard.

ALTER TABLE candidates 
ADD COLUMN IF NOT EXISTS last_active_at timestamptz DEFAULT now();

-- 3. Create Trigger Function
CREATE OR REPLACE FUNCTION update_candidate_last_active()
RETURNS TRIGGER AS $$
BEGIN
    NEW.last_active_at = now();
    -- Also keep standard updated_at in sync
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 4. Create Trigger
-- This fires whenever the Candidate Profile is Upserted/Updated (e.g. by the Smooth CV builder)
DROP TRIGGER IF EXISTS trigger_update_candidate_last_active ON candidates;

CREATE TRIGGER trigger_update_candidate_last_active
BEFORE UPDATE ON candidates
FOR EACH ROW
EXECUTE FUNCTION update_candidate_last_active();

-- Comment
COMMENT ON COLUMN candidates.last_active_at IS 'Timestamp of the last meaningful interaction with the CV builder or profile.';
